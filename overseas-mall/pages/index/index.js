const { get } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const preloadManager = require('../../utils/preload.js');
const imageCacheManager = require('../../utils/image-cache.js');

Page({
  data: {
    banners: [],
    categories: [],
    flashGoods: [],
    hotGoods: [],
    newGoods: [],
    countdownHours: '00',
    countdownMinutes: '00',
    countdownSeconds: '00',
    loading: false,
    noMore: false,
    autoplay: true,
    bannerInterval: 3000,
    bannerDuration: 500,
    currentBanner: 0,
    bannerTimer: null,
    hotGoodsLoading: true,
    newGoodsLoading: true
  },

  onLoad() {
    this.loadCriticalData();
    this.startCountdown();
    
    setTimeout(() => {
      this.loadNonCriticalData();
    }, 500);
  },

  loadCriticalData() {
    this.loadBanners();
    this.loadCategories();
    this.loadHotGoods();
  },

  loadNonCriticalData() {
    this.loadFlashGoods();
    this.loadNewGoods();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
      this.getTabBar().updateCartBadge();
    }
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadBanners(),
      this.loadCategories(),
      this.loadFlashGoods(),
      this.loadHotGoods(),
      this.loadNewGoods()
    ]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadBanners() {
    try {
      const mockBanners = [
        {
          id: 1,
          title: 'Summer Sale',
          subtitle: 'Up to 50% OFF',
          image: '/assets/images/banner-1.jpg'
        },
        {
          id: 2,
          title: 'Flash Deals',
          subtitle: 'Limited Time Only',
          image: '/assets/images/banner-2.jpg'
        },
        {
          id: 3,
          title: 'New Arrivals',
          subtitle: 'Check out our latest',
          image: '/assets/images/banner-3.jpg'
        }
      ];
      
      this.setData({ banners: mockBanners });
    } catch (error) {
      console.error('Load banners failed:', error);
    }
  },

  async loadCategories() {
    try {
      const mockCategories = [
        { id: 1, name: 'Electronics', icon: 'phone-o', color: '#FF6B4A' },
        { id: 2, name: 'Fashion', icon: 'shirt-o', color: '#FF8E6B' },
        { id: 3, name: 'Home', icon: 'home-o', color: '#4A90FF' },
        { id: 4, name: 'Beauty', icon: 'star-o', color: '#FF4A8D' },
        { id: 5, name: 'Sports', icon: 'fire', color: '#4AFF6B' },
        { id: 6, name: 'Books', icon: 'book-o', color: '#8B4AFF' }
      ];
      this.setData({ categories: mockCategories });
    } catch (error) {
      console.error('Load categories failed:', error);
    }
  },

  generateMockGoods(count, prefix) {
    const goods = [];
    const productImages = [
      '/assets/images/product-1.jpg',
      '/assets/images/product-2.jpg',
      '/assets/images/product-3.jpg',
      '/assets/images/product-4.jpg',
      '/assets/images/product-5.jpg',
      '/assets/images/product-6.jpg'
    ];
    const productNames = [
      'Wireless Bluetooth Headphones',
      'Smart Watch Series 5',
      'Cotton Casual T-Shirt',
      'Leather Wallet for Men',
      'Yoga Mat Non-Slip',
      'Premium Coffee Maker',
      'Wireless Charger',
      'Portable Power Bank',
      'Noise Cancelling Earbuds',
      'Fitness Tracker'
    ];

    for (let i = 0; i < count; i++) {
      const price = (Math.random() * 100 + 10).toFixed(2);
      const originalPrice = (parseFloat(price) * (1 + Math.random() * 0.5)).toFixed(2);
      goods.push({
        id: i + 1,
        name: productNames[i % productNames.length],
        image: productImages[i % productImages.length],
        price: price,
        originalPrice: originalPrice,
        sales: Math.floor(Math.random() * 1000) + 50,
        stock: Math.floor(Math.random() * 500) + 10,
        salesPercent: Math.min(Math.floor(Math.random() * 100), 100)
      });
    }
    return goods;
  },

  async loadFlashGoods() {
    try {
      const flashGoods = this.generateMockGoods(10, 'flash').map(item => ({
        ...item,
        salesPercent: Math.min(Math.round((item.sales / (item.stock || 1)) * 100), 100)
      }));
      this.setData({ flashGoods });
    } catch (error) {
      console.error('Load flash goods failed:', error);
    }
  },

  async loadHotGoods() {
    try {
      this.setData({ hotGoodsLoading: true });
      const hotGoods = this.generateMockGoods(8, 'hot');
      this.setData({ hotGoods, hotGoodsLoading: false });
      
      preloadManager.preloadHotGoods(hotGoods);
      
      if (hotGoods.length > 0) {
        preloadManager.preloadGoodsDetail(hotGoods[0].id);
      }
    } catch (error) {
      console.error('Load hot goods failed:', error);
      this.setData({ hotGoodsLoading: false });
    }
  },

  async loadNewGoods() {
    try {
      this.setData({ newGoodsLoading: true });
      const newGoods = this.generateMockGoods(8, 'new');
      this.setData({ newGoods, newGoodsLoading: false });
      
      preloadManager.preloadNextImages(newGoods, 0, 5);
    } catch (error) {
      console.error('Load new goods failed:', error);
      this.setData({ newGoodsLoading: false });
    }
  },

  startCountdown() {
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = endTime - now;
      
      if (diff <= 0) {
        this.setData({
          countdownHours: '00',
          countdownMinutes: '00',
          countdownSeconds: '00'
        });
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      this.setData({
        countdownHours: hours.toString().padStart(2, '0'),
        countdownMinutes: minutes.toString().padStart(2, '0'),
        countdownSeconds: seconds.toString().padStart(2, '0')
      });
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  },

  navigateToSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  },

  navigateToCategory(e) {
    const id = e.currentTarget.dataset.id;
    const app = getApp();
    app.globalData.selectedCategoryId = id;
    wx.switchTab({ url: '/pages/category/category' });
  },

  onGoodsCardLongPress(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      preloadManager.preloadGoodsDetail(id);
      util.showToast('Preloading...');
    }
  },

  onGoodsCardTapStart(e) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    
    if (id && index !== undefined) {
      const goodsList = this.data.hotGoods.concat(this.data.newGoods);
      if (index < goodsList.length - 1) {
        const nextId = goodsList[index + 1]?.id;
        if (nextId) {
          preloadManager.preloadGoodsDetail(nextId);
        }
      }
    }
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${id}` });
  },

  navigateToHotGoods() {
    const app = getApp();
    app.globalData.selectedCategoryId = null;
    app.globalData.showHotGoods = true;
    wx.switchTab({ url: '/pages/category/category' });
  },

  navigateToNewGoods() {
    const app = getApp();
    app.globalData.selectedCategoryId = null;
    app.globalData.showNewGoods = true;
    wx.switchTab({ url: '/pages/category/category' });
  },

  navigateToFlashSale() {
    wx.navigateTo({ url: '/pages/flash-sale/flash-sale' });
  },

  onBannerTap(e) {
    const item = e.currentTarget.dataset.item;
    if (item && item.id) {
      wx.navigateTo({
        url: `/pages/promotion/promotion?id=${item.id}&title=${encodeURIComponent(item.title || 'Promotion')}`
      });
    }
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onBannerChange(e) {
    this.setData({ currentBanner: e.detail.current });
  },

  onBannerTouchStart() {
    this.setData({ autoplay: false });
  },

  onBannerTouchEnd() {
    this.setData({ autoplay: true });
  }
});
