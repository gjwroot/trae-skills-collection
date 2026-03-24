---
name: ui-ux-pro-max-skills
description: 快速复刻设计风格，创建玻璃拟态（Glassmorphism）效果。当用户需要现代、时尚、半透明毛玻璃效果时调用。
license: MIT
---

# UI UX Pro Max Skills

快速复刻设计风格，创建现代、时尚的玻璃拟态（Glassmorphism）效果。

## 核心特点

### 支持的UI风格（67种）
- **玻璃拟态** (Glassmorphism) - 半透明毛玻璃效果
- **粘土拟态** (Claymorphism) - 柔软的3D粘土效果
- **极简主义** (Minimalism) - 简洁留白设计
- **野兽派** (Brutalism) - 原始粗犷风格
- **新拟态** (Neumorphism) - 柔和的凸起效果
- **暗黑模式** (Dark Mode) - 深色主题设计
- **渐变风格** (Gradient) - 丰富的渐变效果
- **Bento Grid** - 网格布局设计

### 配色方案（95种）
- SaaS行业配色
- 电商行业配色
- 医疗行业配色
- 金融行业配色
- 美妆行业配色
- 科技行业配色

### 字体组合（56种）
- Google Fonts 精选搭配
- 展示字体 + 正文字体组合
- 中英文字体配对

## 玻璃拟态设计指南

### 核心要素
1. **背景模糊** (backdrop-filter: blur)
2. **半透明背景** (rgba背景色)
3. **细边框** (1px边框)
4. **柔和阴影** (多层阴影)

### CSS实现
```css
.glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### 背景设计
- 使用渐变背景
- 添加动态形状
- 多层叠加效果
- 模糊滤镜增强

## 组件设计系统

### 卡片组件
- 玻璃效果背景
- 柔和的边框
- 多层阴影
- 悬停效果

### 按钮组件
- 半透明背景
- 模糊效果
- 渐变边框
- 平滑过渡

### 输入框组件
- 玻璃效果
- 聚焦状态
- 错误提示
- 成功反馈

### 模态框组件
- 背景模糊
- 弹出动画
- 玻璃卡片
- 关闭效果

## 动效设计

### 页面加载
- 交错显示动画
- 渐入效果
- 缩放动画
- 旋转效果

### 悬停效果
- 上浮动画
- 发光效果
- 边框动画
- 背景变化

### 滚动效果
- 视差滚动
- 渐显动画
- 固定元素
- 平滑滚动

## 技术栈支持（13种）

- React
- Next.js
- Vue
- Svelte
- SwiftUI
- Flutter
- Angular
- Solid.js
- Qwik
- Astro
- HTML/CSS
- Tailwind CSS
- Styled Components

## UX指南（98条）

### 可访问性
- WCAG AA 标准
- 颜色对比度
- 键盘导航
- 屏幕阅读器支持

### 响应式设计
- 375px / 768px / 1024px / 1440px 断点
- 移动优先
- 触摸友好
- 自适应布局

### 交互反馈
- hover 状态
- focus 状态
- cursor-pointer
- 加载状态

### 动效节奏
- 200-300ms 平滑过渡
- 缓动函数
- 动画延迟
- 性能优化

## 最佳实践

### 性能优化
- 最小化重绘
- 使用 transform
- 避免过多模糊
- 优化阴影

### 浏览器兼容
- -webkit- 前缀
- 降级方案
- 特性检测
- Polyfill

### 设计一致性
- CSS 变量
- 设计系统
- 组件复用
- 样式指南

## 禁止事项

- ❌ 过度使用模糊效果（影响性能）
- ❌ 不考虑浏览器兼容性
- ❌ 忽视可访问性标准
- ❌ 使用 emoji 图标（强制使用 SVG）
- ❌ 过度复杂的动画
- ❌ 不一致的间距系统

## 适用场景

- ✅ 现代Web应用
- ✅ 移动应用
- ✅ 仪表盘设计
- ✅ 着陆页
- ✅ 作品集网站
- ✅ SaaS产品

## 记住

玻璃拟态设计的关键是平衡美观与性能，创造现代、时尚的视觉效果，同时保持良好的用户体验和可访问性。
