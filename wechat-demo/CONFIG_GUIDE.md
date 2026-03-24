# 配置指南

## 必须修改的配置项

### 1. API 基础地址

**文件**: `utils/config.js`

```javascript
module.exports = {
  baseUrl: 'https://api.example.com',  // ⚠️ 修改为实际的 API 地址
  timeout: 10000,
  appId: 'your-app-id'  // ⚠️ 修改为实际的 AppID
};
```

**修改说明**:
- `baseUrl`: 修改为你的后端 API 地址
- `appId`: 修改为你的微信小程序 AppID

---

### 2. 小程序 AppID

**文件**: `project.config.json`

```json
{
  "appid": "your-app-id",  // ⚠️ 修改为实际的 AppID
  "projectname": "wechat-demo",
  ...
}
```

**修改说明**:
- `appid`: 修改为你的微信小程序 AppID

---

### 3. 服务器域名配置

**步骤**:
1. 登录微信公众平台
2. 进入"开发" -> "开发管理" -> "开发设置"
3. 在"服务器域名"中配置:
   - request 合法域名: 你的 API 域名
   - uploadFile 合法域名: 你的文件上传域名（如果有）
   - downloadFile 合法域名: 你的文件下载域名（如果有）

**注意**:
- 域名必须是 HTTPS
- 域名不能包含端口号
- 域名不能使用 IP 地址

---

### 4. 用户协议和隐私政策

**文件**: `pages/login/login.js`

```javascript
showAgreement() {
  wx.showModal({
    title: '用户协议',
    content: '用户协议内容...',  // ⚠️ 修改为实际的协议内容
    showCancel: false
  });
},

showPrivacy() {
  wx.showModal({
    title: '隐私政策',
    content: '隐私政策内容...',  // ⚠️ 修改为实际的政策内容
    showCancel: false
  });
}
```

**修改说明**:
- 替换为实际的协议和政策内容
- 建议跳转到专门的协议页面，而不是使用 Modal

---

## 可选配置项

### 1. 支付功能

**文件**: `pages/payment/payment.js`

```javascript
wechatPay(payData) {
  wx.requestPayment({
    timeStamp: payData.timeStamp,
    nonceStr: payData.nonceStr,
    package: payData.package,
    signType: payData.signType,
    paySign: payData.paySign,
    ...
  });
}
```

**配置说明**:
- 需要在微信公众平台开通微信支付
- 需要后端配合生成支付参数

---

### 2. 地图功能

**文件**: `pages/permission/permission.wxml`

```xml
<map 
  longitude="113.324520" 
  latitude="23.099994" 
  scale="14">
</map>
```

**配置说明**:
- 需要在微信公众平台开通地图服务
- 需要配置腾讯地图 API Key

---

### 3. 视频功能

**文件**: `pages/permission/permission.wxml`

```xml
<video src="http://example.com/video.mp4"></video>
```

**配置说明**:
- 修改为实际的视频地址
- 确保视频域名在白名单中

---

## 开发环境配置

### 1. 本地开发

**文件**: `project.config.json`

```json
{
  "setting": {
    "urlCheck": false,  // 关闭域名校验（仅开发环境）
    "es6": true,
    "postcss": true,
    "minified": false
  }
}
```

**注意**:
- `urlCheck: false` 仅用于开发环境
- 生产环境必须开启域名校验

---

### 2. 调试模式

**文件**: `utils/config.js`

```javascript
module.exports = {
  baseUrl: 'https://dev-api.example.com',  // 开发环境地址
  timeout: 10000,
  appId: 'your-app-id',
  debug: true  // 开启调试模式
};
```

---

## 生产环境配置

### 1. 正式环境

**文件**: `utils/config.js`

```javascript
module.exports = {
  baseUrl: 'https://api.example.com',  // 生产环境地址
  timeout: 10000,
  appId: 'your-app-id',
  debug: false  // 关闭调试模式
};
```

---

### 2. 性能优化

**文件**: `project.config.json`

```json
{
  "setting": {
    "urlCheck": true,  // 开启域名校验
    "es6": true,
    "postcss": true,
    "minified": true  // 代码压缩
  }
}
```

---

## 环境变量管理

建议使用不同的配置文件来管理不同环境：

```
utils/
├── config.dev.js    # 开发环境配置
├── config.prod.js  # 生产环境配置
└── config.js       # 当前使用的配置
```

**使用方式**:

```javascript
// config.js
const isDev = true;  // 根据环境切换

module.exports = isDev 
  ? require('./config.dev.js') 
  : require('./config.prod.js');
```

---

## 常见问题

### 1. 域名校验失败

**原因**: 域名未配置或配置错误

**解决**:
1. 检查 `utils/config.js` 中的 baseUrl
2. 在微信公众平台配置服务器域名
3. 确保域名使用 HTTPS

---

### 2. 请求超时

**原因**: 网络问题或服务器响应慢

**解决**:
1. 增加 `timeout` 配置
2. 检查网络连接
3. 检查服务器状态

---

### 3. 支付失败

**原因**: 支付配置错误或参数错误

**解决**:
1. 检查微信支付配置
2. 检查后端返回的支付参数
3. 查看微信支付文档

---

### 4. 登录失败

**原因**: Token 过期或接口错误

**解决**:
1. 检查 API 地址配置
2. 检查登录接口返回
3. 清除 storage 重新登录

---

## 配置检查清单

- [ ] 修改 `utils/config.js` 中的 baseUrl
- [ ] 修改 `utils/config.js` 中的 appId
- [ ] 修改 `project.config.json` 中的 appid
- [ ] 在微信公众平台配置服务器域名
- [ ] 补充用户协议和隐私政策内容
- [ ] 配置微信支付（如果需要）
- [ ] 配置地图服务（如果需要）
- [ ] 测试所有接口是否正常
- [ ] 测试登录流程
- [ ] 测试支付流程
- [ ] 测试权限获取
- [ ] 测试页面跳转
- [ ] 测试错误处理

---

## 联系方式

如有配置问题，请联系：
- 技术支持: support@example.com
- 文档地址: https://docs.example.com