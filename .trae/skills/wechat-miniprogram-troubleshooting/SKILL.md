---
name: "wechat-miniprogram-troubleshooting"
description: "微信小程序开发排障技能，系统解决导航、视觉、布局、功能、图片、评论、交互、样式、编译等9大类常见问题。Invoke when encountering WeChat mini-program development issues or user asks for troubleshooting."
---

# 微信小程序开发排障技能

## 概述

本技能专门用于解决微信小程序开发过程中遇到的各类常见问题，基于实际项目经验总结了9大类问题及其解决方案。

## 问题分类与解决方案

### 1. 导航功能问题

#### 常见问题
- 首页分类按钮（Electronics、Fashion、Home、Beauty、Sports、Books）点击无响应
- 详情页面图标显示错误状态（灰色）
- 页面跳转逻辑错误

#### 解决方案
```javascript
// 检查按钮绑定
bindtap="handleClick"

// 检查页面路径
wx.navigateTo({ url: '/pages/category/category' })
wx.switchTab({ url: '/pages/category/category' })

// 检查图标状态
<custom-icon name="{{isActive ? 'home-active' : 'home'}}" />
```

### 2. 视觉设计问题

#### 常见问题
- 菜单栏小红点位置异常
- 菜单栏小红点与按钮之间大片空白
- 菜单栏文字大小和位置不对
- 最上边左侧按钮颜色不对
- 整体布局错位

#### 解决方案
```css
/* 小红点定位 */
.badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
}

/* 菜单栏布局 */
.tab-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

/* 按钮颜色 */
.nav-btn {
  color: #FF6B4A;
}
```

### 3. 页面布局问题

#### 常见问题
- 购物车页面商品加减框排版不一致
- 结账页面图片和信息异常
- 分类价格按钮文字排版问题，按钮上方大片空白
- 搜索价格按钮图标导致排版异常
- Select Specifications页面太丑
- 价格升序降序箭头不显示

#### 解决方案
```css
/* 统一加减框样式 */
.quantity-control {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 8rpx;
  overflow: hidden;
  height: 60rpx;
  width: 180rpx;
}

/* 按钮排版 */
.price-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
}

/* 排序箭头 */
.sort-arrow {
  display: inline-block;
  margin-left: 4rpx;
}
```

### 4. 功能缺失问题

#### 常见问题
- 缺少refund列
- 很多功能点不动
- 很多"page coming soon"提示

#### 解决方案
```javascript
// 替代coming soon功能
// Shop按钮跳转到分类页
navigateToShop() {
  wx.switchTab({ url: '/pages/category/category' });
}

// Chat按钮跳转到帮助页
navigateToChat() {
  wx.navigateTo({ url: '/pages/help/help' });
}

// 实现店铺关注功能
followShop() {
  const followedShops = wx.getStorageSync('followedShops') || [];
  // 实现关注逻辑
}
```

### 5. 图片显示问题

#### 常见问题
- 页面刚进来是丑陋的绿色底图
- placeholder.png图片问题
- 图片加载失败

#### 解决方案
```javascript
// 使用项目已有产品图片作为占位符
if (!goodsInfo.image) {
  goodsInfo.image = '/assets/images/product-1.jpg';
}

// WXML中
<image src="{{item.image || '/assets/images/product-1.jpg'}}" />

// 批量替换placeholder.png
find . -name "*.wxml" -exec sed -i '' 's/placeholder\.png/product-1\.jpg/g' {} +
```

### 6. 评论功能问题

#### 常见问题
- 商品详情页view all进的是写评论页面
- 写评论功能找不到

#### 解决方案
```javascript
// 创建商品评论页面 pages/goods-review/
// 包含：评分、文字内容、图片上传、匿名提交

// 在多个页面添加入口
// 1. 商品详情页
writeReview() {
  wx.navigateTo({
    url: `/pages/goods-review/goods-review?goodsId=${goodsId}`
  });
}

// 2. 评论列表页
// 3. 订单详情页（仅完成状态显示）
```

### 7. 交互流程问题

#### 常见问题
- 首页搜索框下面功能区流程不对
- add to cart交互流程有问题

#### 解决方案
```javascript
// 规格选择弹窗应该有明确的按钮
// 弹窗中有 Cancel 和 Add to Cart 两个按钮

// 重构addToCart流程
addToCart() {
  // 检查登录
  // 检查规格选择
  // 如果规格未选全，只显示弹窗
  // 如果规格已选全，直接添加
}

confirmAddToCart() {
  // 从弹窗按钮调用
  // 检查规格
  // 执行添加
}

doAddToCart() {
  // 实际添加逻辑
  // 显示loading
  // 调用API
  // 显示成功/失败
  // 关闭弹窗
}
```

### 8. 按钮样式问题

#### 常见问题
- 购物车页面checkout按钮比较丑
- 登录页面去首页按钮是灰色
- 按钮没有渐变色和阴影

#### 解决方案
```css
/* 美化按钮 */
.checkout-btn {
  background: linear-gradient(135deg, #FF6B4A 0%, #FF8E6B 100%);
  color: #fff;
  border-radius: 40rpx;
  font-weight: 600;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 74, 0.3);
}

.checkout-btn::after {
  border: none;
}

.checkout-btn.disabled {
  background: #ccc;
  box-shadow: none;
}
```

### 9. 编译错误问题

#### 常见问题
- WXML文件编译错误
- 语法错误提示

#### 解决方案
```xml
<!-- 检查模板语法 -->
<!-- 错误示例 -->
<text>{{reviewCount > 0 ? '4.5' : '0'}</text>

<!-- 正确示例 -->
<text>{{reviewCount > 0 ? '4.5' : '0'}}</text>

<!-- 确保所有大括号都正确闭合 -->
```

### 10. 自定义 tabBar 问题

#### 常见问题
- 菜单栏小红点位置异常
- 菜单栏小红点与按钮之间大片空白
- 菜单栏文字大小和位置不对
- 选中状态不更新
- 内容被 tabBar 遮挡
- 底部安全区域不适配

#### 解决方案
```javascript
// app.json 配置
{
  "tabBar": {
    "custom": true,
    "color": "#999999",
    "selectedColor": "#FF6B4A",
    "backgroundColor": "#ffffff"
  }
}

// 创建 custom-tab-bar 目录
// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    cartCount: 0,
    list: [
      { pagePath: '/pages/index/index', text: 'Home', iconPath: '/assets/icons/home.png', selectedIconPath: '/assets/icons/home-active.png' },
      { pagePath: '/pages/category/category', text: 'Category', iconPath: '/assets/icons/category.png', selectedIconPath: '/assets/icons/category-active.png' },
      { pagePath: '/pages/cart/cart', text: 'Cart', iconPath: '/assets/icons/cart.png', selectedIconPath: '/assets/icons/cart-active.png' },
      { pagePath: '/pages/mine/mine', text: 'Mine', iconPath: '/assets/icons/mine.png', selectedIconPath: '/assets/icons/mine-active.png' }
    ]
  },
  
  lifetimes: {
    attached() {
      this.updateCartCount();
    }
  },
  
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
    },
    
    updateCartCount() {
      const cartCount = wx.getStorageSync('cartCount') || 0;
      this.setData({ cartCount });
    }
  }
});
```

```css
/* custom-tab-bar/index.wxss */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  display: flex;
  border-top: 1rpx solid #eee;
  z-index: 999;
}

.tab-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.icon {
  width: 44rpx;
  height: 44rpx;
}

.text-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.tab-text {
  font-size: 20rpx;
  margin-top: 4rpx;
}

/* 小红点在文字右上角 */
.badge {
  position: absolute;
  top: -20rpx;
  right: -36rpx;
  min-width: 32rpx;
  height: 32rpx;
  background: #FF6B4A;
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
  line-height: 1;
}
```

```javascript
// 在各 tabBar 页面更新选中状态
Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0  // 根据页面索引设置
      });
    }
  }
});

// app.js 全局管理购物车数量
App({
  globalData: {
    cartCount: 0
  },
  
  onLaunch() {
    this.updateCartCount();
  },
  
  updateCartCount() {
    // 计算购物车数量
    const cartItems = wx.getStorageSync('cart') || [];
    this.globalData.cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // 更新 custom-tab-bar
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage && typeof currentPage.getTabBar === 'function' && currentPage.getTabBar()) {
      currentPage.getTabBar().updateCartCount();
    }
  }
});
```

### 11. 轮播图和促销活动问题

#### 常见问题
- Banner 是静态的，不会轮播
- 点击 Banner 没有反应
- 没有专门的促销活动页面
- Swiper 指示点不显示
- 自动播放不生效

#### 解决方案
```xml
<!-- 首页轮播图 -->
<swiper class="banner-swiper" indicator-dots="{{true}}" autoplay="{{true}}" interval="{{3000}}" duration="{{500}}" circular="{{true}}">
  <swiper-item wx:for="{{banners}}" wx:key="id" bindtap="onBannerTap" data-item="{{item}}">
    <view class="banner-item" style="background: linear-gradient(135deg, #FF6B4A 0%, #FF8E6B 100%);">
      <image class="banner-image" src="{{item.image || '/assets/images/banner-1.jpg'}}" mode="aspectFill" />
      <view class="banner-content">
        <text class="banner-title">{{item.title || 'Summer Sale'}}</text>
        <text class="banner-subtitle">{{item.subtitle || 'Up to 50% OFF'}}</text>
        <text class="banner-btn">Shop Now</text>
      </view>
    </view>
  </swiper-item>
</swiper>
```

```css
/* 轮播图样式 */
.banner-swiper {
  width: 100%;
  height: 340rpx;
}

.banner-item {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.banner-image {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.banner-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 60rpx;
}
```

```javascript
// 首页 banner 数据和点击逻辑
Page({
  data: {
    banners: []
  },
  
  onLoad() {
    this.loadBanners();
  },
  
  async loadBanners() {
    const mockBanners = [
      { id: 1, title: 'Summer Sale', subtitle: 'Up to 50% OFF', image: '/assets/images/banner-1.jpg' },
      { id: 2, title: 'Flash Deals', subtitle: 'Limited Time Only', image: '/assets/images/banner-2.jpg' },
      { id: 3, title: 'New Arrivals', subtitle: 'Check out our latest', image: '/assets/images/banner-3.jpg' }
    ];
    this.setData({ banners: mockBanners });
  },
  
  onBannerTap(e) {
    const item = e.currentTarget.dataset.item;
    if (item && item.id) {
      wx.navigateTo({
        url: `/pages/promotion/promotion?id=${item.id}&title=${encodeURIComponent(item.title || 'Promotion')}`
      });
    }
  }
});
```

### 12. 促销活动页面问题

#### 常见问题
- 点击 banner 后没有专门的促销活动页面
- 促销活动页面布局混乱
- 没有活动详情和商品展示

#### 解决方案
```javascript
// pages/promotion/promotion.js
Page({
  data: {
    promotionId: null,
    promotionInfo: {},
    goodsList: [],
    loading: false
  },
  
  onLoad(options) {
    const id = options.id;
    const title = options.title;
    
    if (title) {
      wx.setNavigationBarTitle({ title });
    }
    
    this.setData({ promotionId: id });
    this.loadPromotionInfo();
    this.loadGoodsList();
  },
  
  async loadPromotionInfo() {
    const mockPromotions = [
      { id: 1, title: 'Summer Sale', subtitle: 'Up to 50% OFF', image: '/assets/images/banner-1.jpg', description: 'Get ready for summer with amazing discounts!' },
      { id: 2, title: 'Flash Deals', subtitle: 'Limited Time Only', image: '/assets/images/banner-2.jpg', description: 'Hurry up! These deals won\'t last long!' },
      { id: 3, title: 'New Arrivals', subtitle: 'Check out our latest', image: '/assets/images/banner-3.jpg', description: 'Discover our newest products!' }
    ];
    
    const id = this.data.promotionId;
    const promotion = mockPromotions.find(p => p.id == id) || mockPromotions[0];
    this.setData({ promotionInfo: promotion });
  },
  
  async loadGoodsList() {
    this.setData({ loading: true });
    
    const mockGoods = [
      { id: 1, name: 'Product 1', price: '99.00', image: '/assets/images/product-1.jpg' },
      { id: 2, name: 'Product 2', price: '199.00', image: '/assets/images/product-2.jpg' }
    ];
    
    this.setData({ goodsList: mockGoods, loading: false });
  },
  
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${id}` });
  }
});
```

```xml
<!-- pages/promotion/promotion.wxml -->
<view class="promotion-page">
  <!-- 活动头图 -->
  <view class="promotion-header" style="background: linear-gradient(135deg, #FF6B4A 0%, #FF8E6B 100%);">
    <image class="promotion-image" src="{{promotionInfo.image}}" mode="aspectFill" />
    <view class="promotion-info">
      <text class="promotion-title">{{promotionInfo.title}}</text>
      <text class="promotion-subtitle">{{promotionInfo.subtitle}}</text>
    </view>
  </view>
  
  <!-- 活动描述 -->
  <view class="promotion-description">
    <text>{{promotionInfo.description}}</text>
  </view>
  
  <!-- 商品列表 -->
  <view class="goods-section">
    <text class="section-title">Featured Products</text>
    <view class="goods-grid">
      <view wx:for="{{goodsList}}" wx:key="id" class="goods-item" bindtap="navigateToDetail" data-id="{{item.id}}">
        <image class="goods-image" src="{{item.image}}" mode="aspectFill" />
        <text class="goods-name">{{item.name}}</text>
        <text class="goods-price">${{item.price}}</text>
      </view>
    </view>
  </view>
</view>
```

## 排检清单

### 导航功能检查
- [ ] 按钮是否正确绑定 bindtap
- [ ] 跳转路径是否正确
- [ ] switchTab 和 navigateTo 使用是否正确
- [ ] 图标状态是否正确更新

### 视觉设计检查
- [ ] 元素定位是否使用 position
- [ ] 间距是否合理
- [ ] 颜色是否符合设计规范
- [ ] 字体大小是否统一

### 页面布局检查
- [ ] flex布局是否正确使用
- [ ] 间距是否统一
- [ ] 元素对齐是否正确
- [ ] 响应式是否正常

### 功能实现检查
- [ ] 是否有token检查
- [ ] 数据加载是否有loading
- [ ] 错误处理是否完善
- [ ] coming soon是否已替换

### 图片显示检查
- [ ] 是否使用正确的占位图
- [ ] 图片路径是否正确
- [ ] mode属性是否正确设置
- [ ] 图片是否有备用方案

### 评论功能检查
- [ ] 是否有多个入口
- [ ] 权限检查是否完善
- [ ] 表单验证是否完整
- [ ] 提交流程是否清晰

### 交互流程检查
- [ ] 用户操作是否有反馈
- [ ] loading状态是否正确
- [ ] 成功/失败提示是否清晰
- [ ] 流程是否符合用户预期

### 按钮样式检查
- [ ] 是否有渐变色
- [ ] 是否有阴影效果
- [ ] 禁用状态是否明显
- [ ] 点击反馈是否正常

### 编译错误检查
- [ ] WXML语法是否正确
- [ ] 大括号是否正确闭合
- [ ] 标签是否正确配对
- [ ] 属性值是否正确

### 自定义 tabBar 检查
- [ ] app.json 中是否配置了 "custom": true
- [ ] custom-tab-bar 目录是否存在
- [ ] 小红点位置是否正确（文字右上角）
- [ ] 选中状态是否在各页面正确更新
- [ ] 底部安全区域是否适配（env(safe-area-inset-bottom)）
- [ ] 购物车数量是否全局管理
- [ ] 页面内容是否被 tabBar 遮挡

### 轮播图检查
- [ ] 是否使用 swiper 组件
- [ ] indicator-dots 是否开启
- [ ] autoplay 是否开启
- [ ] circular 是否开启
- [ ] 点击事件是否正确绑定
- [ ] 跳转逻辑是否正确

### 促销活动页面检查
- [ ] 页面是否已创建
- [ ] 活动头图是否显示
- [ ] 活动描述是否展示
- [ ] 商品列表是否加载
- [ ] 点击商品是否跳转到详情页
- [ ] 页面标题是否正确设置

## 快速修复命令

### 批量替换占位图
```bash
find . -name "*.wxml" -exec sed -i '' 's/placeholder\.png/product-1\.jpg/g' {} +
```

### 搜索特定问题
```bash
# 搜索coming soon
grep -r "coming soon" --include="*.js" .

# 搜索占位图
grep -r "placeholder\.png" --include="*.wxml" .
```

## 最佳实践

1. **优先使用本地资源**：使用项目已有的图片资源，避免外部依赖
2. **错误处理**：所有API调用都要有try-catch和错误提示
3. **用户反馈**：所有操作都要有loading、成功、失败提示
4. **权限检查**：需要登录的功能先检查token
5. **样式统一**：按钮、间距、字体大小保持统一
6. **语法检查**：确保WXML语法正确，大括号正确闭合
7. **多入口设计**：重要功能提供多个访问入口
8. **流程清晰**：用户操作流程符合预期，有明确的确认和取消

## 相关技能

- [wechat-mini-program-development](../wechat-mini-program-development/SKILL.md) - 微信小程序开发技能
- [wechat-miniprogram-image-icon-diagnosis](../wechat-miniprogram-image-icon-diagnosis/SKILL.md) - 图片图标诊断技能
- [ui-ux-pro-max-skills](../ui-ux-pro-max-skills/SKILL.md) - UI/UX设计技能
