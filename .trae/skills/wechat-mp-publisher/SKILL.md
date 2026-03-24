# 微信公众号智能发布技能

让 AI 直接发布文章到微信公众号。无需 MCP 进程，一个 Skill 文件 + curl 搞定一切。

## 功能能力

| 能力 | 说明 |
| --- | --- |
| Markdown → 微信 HTML | 自动转换，全内联样式，移动端适配 |
| 图片上传 | 文章内图 + 封面图上传到微信 CDN |
| 草稿管理 | 创建、列出、删除草稿 |
| 多账号切换 | 凭证统一存密码管理器，一句话切换 |
| 踩坑指南内置 | 9+ 次生产迭代总结的 HTML 兼容性坑 |

## 前置条件

你需要：
1. 一个有开发者权限的微信公众号（订阅号或服务号）
2. AppID 和 AppSecret（从 developers.weixin.qq.com 获取）
3. 公网 IP 加入 IP 白名单
4. 凭证存到密钥管理器（Bitwarden、1Password、环境变量等）

## 微信 API 调用指南

### 1. 获取 Access Token

```bash
curl -s -4 "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=YOUR_APPID&secret=YOUR_APPSECRET"
```

返回：
```json
{
  "access_token": "ACCESS_TOKEN",
  "expires_in": 7200
}
```

### 2. 上传永久图片素材

```bash
curl -s -4 -F "media=@/path/to/image.jpg" "https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=image"
```

返回：
```json
{
  "media_id": "MEDIA_ID",
  "url": "https://mmbiz.qpic.cn/..."
}
```

### 3. 上传临时图片用于封面

```bash
curl -s -4 -F "media=@/path/to/cover.jpg" "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=image"
```

返回：
```json
{
  "type": "image",
  "media_id": "MEDIA_ID",
  "created_at": 123456789
}
```

### 4. 创建草稿

```bash
curl -s -4 -X POST "https://api.weixin.qq.com/cgi-bin/draft/add?access_token=ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "articles": [
      {
        "title": "文章标题",
        "author": "作者",
        "digest": "摘要",
        "content": "HTML内容",
        "content_source_url": "原文链接",
        "thumb_media_id": "封面图media_id",
        "show_cover_pic": 1,
        "need_open_comment": 1,
        "only_fans_can_comment": 0
      }
    ]
  }'
```

返回：
```json
{
  "media_id": "DRAFT_MEDIA_ID"
}
```

### 5. 获取草稿列表

```bash
curl -s -4 -X POST "https://api.weixin.qq.com/cgi-bin/draft/batchget?access_token=ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "offset": 0,
    "count": 20,
    "no_content": 0
  }'
```

### 6. 删除草稿

```bash
curl -s -4 -X POST "https://api.weixin.qq.com/cgi-bin/draft/delete?access_token=ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "media_id": "DRAFT_MEDIA_ID"
  }'
```

## Markdown → 微信 HTML 转换规则

⚠️ 重要：微信公众号对 HTML 有严格限制，必须遵循以下规则

### ❌ 禁止使用
- class 和 id 属性
- CSS 变量
- flexbox / grid
- 外部图片（必须先上传到微信 CDN）
- \<script\> 标签

### ✅ 必须使用
- 内联样式（style=""）
- 微信 CDN 图片 URL
- 基础 HTML 标签

### 踩坑指南（Pitfalls）

| 问题 | ❌ 错误写法 | ✅ 正确写法 | 原因 |
| --- | --- | --- | --- |
| \<strong\> 换行 | `<strong style="...">` | `<strong>文字</strong>` | 加 style 属性会变成块级元素 |
| 列表空子弹 | `<ul>\n<li>...</li>\n</ul>` | `<ul><li>...</li></ul>` | 标签间的换行被渲染成空子弹 |
| 图片不显示 | `<img src="外部URL">` | 先上传到微信 CDN | 外部图片被静默屏蔽 |
| 代码块手机大空白 | `word-wrap:break-word` | `word-break:break-all` | break-word 在空格处断行产生巨大空白 |
| \<pre\> 换行消失 | `<pre>` 内用 `\n` | 用 `<br/>` | 微信吞掉 \<pre\> 内的原始换行符 |
| 搜一搜自动链接 | 英文术语裸写 | 包在 `<code>` 里 | 英文关键词被自动加上蓝色🔍链接 |
| 表头颜色 | 自定义表头背景色 | 用微信默认或深色 | 渲染结果和预期不同 |

## 使用流程示例

### 完整发布流程

1. 获取 Access Token
2. 将 Markdown 转换为符合微信规范的 HTML
3. 提取 HTML 中的所有图片，逐个上传到微信 CDN
4. 上传封面图获取 thumb_media_id
5. 替换 HTML 中的图片 URL 为微信 CDN URL
6. 调用创建草稿 API
7. 返回 draft_media_id 给用户，提示去公众号后台确认发布

### 常用指令示例

```
帮我把这篇 Markdown 文章发到公众号
把最新的博客文章发布到我的公众号
创建一个公众号草稿，标题是"xxx"
列出我最近的公众号草稿
删除那个 draft_media_id 为 xxx 的草稿
```

## 多账号支持

凭证存储格式建议：

```
账户名: my-personal-account
AppID: wx1234567890abcdef
AppSecret: xxxxxxxxxxxxxxxxxxxxxxxx

账户名: wife-brand-account
AppID: wx0987654321fedcba
AppSecret: yyyyyyyyyyyyyyyyyyyyyyyy
```

切换账号示例：
```
帮我把文章发到老婆的品牌号上
使用 my-personal-account 账号发布
