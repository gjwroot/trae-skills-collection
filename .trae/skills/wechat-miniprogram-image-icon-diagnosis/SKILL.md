---
name: "wechat-miniprogram-image-icon-diagnosis"
description: "Diagnoses and fixes image and icon issues in WeChat mini-programs. Invoke when user reports image display problems, icon rendering issues, or 404 errors in mini-programs."
---

# 微信小程序图片图标问题诊断技能

基于实际项目经验总结的专业诊断工具，快速识别和解决微信小程序中的图片和图标相关问题。

## 🎯 技能功能

### 1. 图片问题诊断
- 检查图片URL稳定性
- 识别404错误和图片加载失败
- 推荐可靠的图片服务提供商
- 验证图片尺寸和格式兼容性

### 2. 图标问题诊断  
- 检查图标组件注册状态
- 验证图标名称存在性
- 确保图标语义与文案匹配
- 修复图标渲染和显示问题

### 3. 最佳实践指导
- 提供图片和图标选择的最佳实践
- 给出具体的修复建议和代码示例
- 预防类似问题的重复发生

## 🚀 使用场景

### 触发条件
当用户遇到以下问题时立即调用此技能：
- "图片显示有问题"
- "图标不显示或显示异常"
- "图片404错误"
- "图标和文案不匹配"
- "商品图片无法加载"

### 诊断流程

#### 第一步：问题识别
```javascript
// 检查用户报告的具体问题类型
1. 图片显示问题 → 检查图片URL和加载状态
2. 图标显示问题 → 检查图标组件和注册状态
3. 混合问题 → 综合诊断
```

#### 第二步：快速检查清单

**图片问题检查清单：**
- [ ] 图片URL是否稳定可访问
- [ ] 是否有404错误
- [ ] 图片尺寸是否合适
- [ ] 是否使用可靠的图片服务

**图标问题检查清单：**
- [ ] 图标组件是否在页面JSON中注册
- [ ] 使用的图标名称是否在组件中定义
- [ ] 图标语义是否与文案匹配
- [ ] 图标颜色和大小是否一致

#### 第三步：具体修复方案

## 📸 图片问题解决方案

### 图片源选择优先级
```
1️⃣ 项目自有图片 → 项目已有图片资源 (最优先)
2️⃣ 本地图片资源 → /assets/images/ (最稳定)
3️⃣ 稳定图片服务 → picsum.photos (稳定可靠)
4️⃣ 专业图片服务 → unsplash.com (质量高但需注意404)
```

### 本地图片占位符最佳实践
```javascript
// 优先使用项目已有产品图片作为占位符
if (!goodsInfo.image) {
  goodsInfo.image = '/assets/images/product-1.jpg';
}

// WXML中使用默认值
<image src="{{item.image || '/assets/images/product-1.jpg'}}" mode="aspectFill" />

// 批量替换placeholder.png
find . -name "*.wxml" -exec sed -i '' 's/placeholder\.png/product-1\.jpg/g' {} +
```

### Banner 图片处理
```xml
<!-- 半透明背景图片效果 -->
<view class="banner-item">
  <image class="banner-image" src="{{item.image}}" mode="aspectFill" />
  <view class="banner-overlay"></view>
  <view class="banner-content">
    <text>{{item.title}}</text>
  </view>
</view>
```

```css
/* 半透明背景 + 渐变叠加层 */
.banner-image {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 107, 74, 0.9) 0%, rgba(255, 142, 107, 0.9) 100%);
}

.banner-content {
  position: relative;
  z-index: 1;
}
```

### 可靠图片URL示例
```javascript
// 使用picsum.photos的稳定图片
const productImages = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3'
];
```

## 🎨 图标问题解决方案

### 图标实现方式选择
```
1️⃣ 组件化图标系统 (推荐) → 统一管理，易于维护
2️⃣ SVG Data URI → 动态生成，颜色可控  
3️⃣ 图片图标 → 简单直接，但灵活性差
4️⃣ 字体图标 → 需要额外依赖
```

### 图标组件最佳实践
```javascript
// 1. 确保图标组件正确注册
"usingComponents": {
  "custom-icon": "/components/icon/icon"
}

// 2. 完整的图标映射定义
const iconMap = {
  'search': 'M15.5 14h-.79l...',
  'arrow': 'M8.59 16.59L13.17...',
  'success': 'M9 16.17L4.83...'
  // 确保所有使用的图标都有定义
}

// 3. 动态图标生成
methods: {
  generateIcon: function(name, color) {
    const pathData = iconMap[name] || iconMap['circle'];
    const svgContent = `<svg><path fill="${color}" d="${pathData}"/></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
  }
}
```

### 图标语义匹配指南
| 功能场景 | 推荐图标 | 说明 |
|---------|----------|------|
| 搜索功能 | `search` | 放大镜图标 |
| 导航箭头 | `arrow` | 右箭头 |
| 成功状态 | `success` | 对勾图标 |
| 分类浏览 | `apps-o` | 网格应用图标 |
| 订单相关 | `orders-o` | 文档列表图标 |
| 支付功能 | `paid` | 货币支付图标 |

## 🔧 快速修复模板

### 图片问题修复模板
```javascript
// 替换不稳定的图片URL
const stableImages = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3'
];
```

### 图标问题修复模板
```javascript
// 扩展图标组件
const iconMap = {
  // 现有图标...
  'arrow-up': 'M7.41 15.41L12 10.83...',
  'arrow-down': 'M7.41 8.59L12 13.17...',
  'apps-o': 'M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6-6h4V4h-4v4zm6 6h4v-4h-4v4zm3-10v-1h-1V4h-1v1h-1v1h1v1h1V5h1V4z'
};
```

## 📋 沟通最佳实践

### 高效问题描述模板
**图片问题：**
> "检查当前图片URL的稳定性，将所有商品图片替换为picsum.photos的400x400图片，确保无404错误"

**图标问题：**
> "检查图标组件是否包含所有页面使用的图标名称，修复缺失的图标定义，确保图标语义与文案匹配"

### 避免的模糊描述
- ❌ "图片有问题"（太模糊）
- ❌ "图标不对"（不具体）
- ❌ "显示异常"（需要具体描述）

## 🚨 常见错误及解决方案

### 图片相关错误
1. **404错误** → 替换为稳定图片服务
2. **图片加载慢** → 优化图片尺寸和格式
3. **图片变形** → 设置正确的mode属性

### 图标相关错误
1. **图标不显示** → 检查组件注册和图标定义
2. **图标颜色异常** → 检查color属性编码
3. **图标大小不一致** → 统一size属性

## ✅ 验证标准

修复完成后必须验证：
- [ ] 所有图片正常显示，无404错误
- [ ] 所有图标正确渲染，语义匹配
- [ ] 页面JSON中正确注册图标组件
- [ ] 图标组件包含所有使用的图标定义

通过使用此技能，可以快速诊断和解决微信小程序中的图片图标问题，确保应用视觉效果的稳定性和一致性。