const util = require('../../utils/util.js');

Page({
  data: {
    activeTab: 'current',
    productList: [],
    loading: false,
    countdown: {
      hours: '00',
      minutes: '00',
      seconds: '00'
    },
    timer: null
  },

  onLoad() {
    this.startCountdown();
    this.loadProducts();
  },

  onPullDownRefresh() {
    this.loadProducts().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  startCountdown() {
    const endTime = new Date().getTime() + 2 * 60 * 60 * 1000;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = endTime - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        this.setData({
          countdown: { hours: '00', minutes: '00', seconds: '00' }
        });
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      this.setData({
        countdown: {
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0')
        }
      });
    }, 1000);
    
    this.setData({ timer });
  },

  generateMockProducts() {
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
      'Premium Coffee Maker'
    ];
    
    const products = [];
    const count = Math.floor(Math.random() * 4) + 3;
    
    for (let i = 0; i < count; i++) {
      const originalPrice = Math.floor(Math.random() * 100) + 50;
      const salePrice = Math.floor(originalPrice * 0.4 + 10);
      const sold = Math.floor(Math.random() * 60) + 30;
      
      products.push({
        id: i + 1,
        name: productNames[i % productNames.length],
        image: productImages[i % productImages.length],
        originalPrice: originalPrice.toFixed(2),
        salePrice: salePrice.toFixed(2),
        sold: sold,
        progress: sold
      });
    }
    
    return products;
  },

  async loadProducts() {
    return new Promise((resolve) => {
      this.setData({ loading: true });

      try {
        setTimeout(() => {
          const products = this.generateMockProducts();
          
          this.setData({
            productList: products,
            loading: false
          });
          resolve();
        }, 500);
      } catch (error) {
        console.error('Load products failed:', error);
        this.setData({ loading: false });
        resolve();
      }
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.loadProducts();
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods-detail/goods-detail?id=${id}`
    });
  },

  quickBuy(e) {
    const id = e.currentTarget.dataset.id;
    const token = wx.getStorageSync('token');
    
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    
    wx.showToast({
      title: 'Adding to cart...',
      icon: 'loading'
    });
    
    setTimeout(() => {
      wx.hideToast();
      util.showSuccess('Added to cart!');
    }, 800);
  }
});
