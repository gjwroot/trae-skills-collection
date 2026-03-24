const { get } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    activeTab: 'available',
    couponList: [],
    loading: false,
    selectMode: false,
    checkoutSubtotal: 0
  },

  onLoad(options) {
    if (options.select === '1') {
      this.setData({ selectMode: true });
    }
    if (options.subtotal) {
      this.setData({ checkoutSubtotal: parseFloat(options.subtotal) || 0 });
    }
    this.loadCoupons();
  },

  onShow() {
    this.loadCoupons();
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.loadCoupons();
  },

  async loadCoupons() {
    return new Promise((resolve) => {
      try {
        const couponNames = [
          'New User Discount',
          'Summer Sale',
          'Flash Deal',
          'Member Exclusive',
          'Weekend Special',
          'Holiday Promo'
        ];
        
        let mockCoupons = [];
        
        if (this.data.activeTab === 'available') {
          const count = Math.floor(Math.random() * 4) + 2;
          for (let i = 0; i < count; i++) {
            const discount = Math.floor(Math.random() * 30) + 5;
            const minAmount = Math.floor(Math.random() * 50) + 20;
            const needMore = Math.max(0, minAmount - this.data.checkoutSubtotal);
            mockCoupons.push({
              id: i + 1,
              name: couponNames[i % couponNames.length],
              discount: discount,
              minAmount: minAmount,
              needMore: needMore.toFixed(2),
              startTime: '2024-01-01',
              endTime: '2024-12-31'
            });
          }
        } else if (this.data.activeTab === 'used') {
          for (let i = 0; i < 3; i++) {
            const discount = Math.floor(Math.random() * 20) + 5;
            const minAmount = Math.floor(Math.random() * 50) + 20;
            mockCoupons.push({
              id: i + 100,
              name: couponNames[i % couponNames.length],
              discount: discount,
              minAmount: minAmount,
              needMore: '0.00',
              startTime: '2023-01-01',
              endTime: '2023-12-31'
            });
          }
        } else {
          for (let i = 0; i < 2; i++) {
            const discount = Math.floor(Math.random() * 25) + 5;
            const minAmount = Math.floor(Math.random() * 50) + 20;
            mockCoupons.push({
              id: i + 200,
              name: couponNames[i % couponNames.length],
              discount: discount,
              minAmount: minAmount,
              needMore: '0.00',
              startTime: '2023-01-01',
              endTime: '2023-06-30'
            });
          }
        }
        
        this.setData({ 
          couponList: mockCoupons, 
          loading: false 
        });
        resolve();
      } catch (error) {
        console.error('Load coupons failed:', error);
        this.setData({ loading: false });
        resolve();
      }
    });
  },

  selectCoupon(e) {
    const item = e.currentTarget.dataset.item;
    
    if (this.data.selectMode) {
      if (this.data.checkoutSubtotal > 0 && this.data.checkoutSubtotal < item.minAmount) {
        util.showToast(`Min. order $${item.minAmount} required`);
        return;
      }
      
      wx.setStorageSync('selectedCoupon', item);
      util.showSuccess('Coupon selected');
      setTimeout(() => {
        wx.navigateBack();
      }, 800);
    } else {
      this.useCoupon(e);
    }
  },

  useCoupon(e) {
    const id = e.currentTarget.dataset.id;
    wx.setStorageSync('selectedCouponId', id);
    wx.switchTab({ url: '/pages/index/index' });
  },

  onPullDownRefresh() {
    this.loadCoupons().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
