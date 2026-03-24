const util = require('../../utils/util.js');

Page({
  data: {
    activeTab: 'available',
    couponList: [],
    loading: false,
    tabCounts: {
      available: 0,
      expiring: 0,
      claimed: 0
    }
  },

  onLoad() {
    this.loadCoupons();
  },

  onShow() {
    this.loadCoupons();
  },

  onPullDownRefresh() {
    this.loadCoupons().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  generateMockCoupons() {
    const couponNames = [
      'New User Welcome',
      'Weekend Special',
      'First Order Discount',
      'VIP Exclusive',
      'Flash Sale',
      'Free Shipping'
    ];
    
    const coupons = [];
    const today = new Date();
    
    for (let i = 0; i < 8; i++) {
      const amount = [5, 10, 15, 20, 25][Math.floor(Math.random() * 5)];
      const minAmount = amount * 3 + Math.floor(Math.random() * 20);
      
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - Math.floor(Math.random() * 7));
      
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 3);
      
      const isExpiring = (endDate - today) < 3 * 24 * 60 * 60 * 1000;
      
      coupons.push({
        id: i + 1,
        name: couponNames[i % couponNames.length],
        amount: amount,
        minAmount: minAmount,
        startTime: this.formatDate(startDate),
        endTime: this.formatDate(endDate),
        isExpiring: isExpiring,
        claimed: false,
        type: 'available'
      });
    }
    
    return coupons;
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  },

  async loadCoupons() {
    return new Promise((resolve) => {
      this.setData({ loading: true });

      try {
        setTimeout(() => {
          let allCoupons = wx.getStorageSync('mockCoupons');
          
          if (!allCoupons || allCoupons.length === 0) {
            allCoupons = this.generateMockCoupons();
            wx.setStorageSync('mockCoupons', allCoupons);
          }

          const activeTab = this.data.activeTab;
          let filteredCoupons = allCoupons;

          if (activeTab === 'available') {
            filteredCoupons = allCoupons.filter(c => !c.claimed);
          } else if (activeTab === 'expiring') {
            filteredCoupons = allCoupons.filter(c => c.isExpiring && !c.claimed);
          } else if (activeTab === 'claimed') {
            filteredCoupons = allCoupons.filter(c => c.claimed);
          }

          const counts = {
            available: allCoupons.filter(c => !c.claimed).length,
            expiring: allCoupons.filter(c => c.isExpiring && !c.claimed).length,
            claimed: allCoupons.filter(c => c.claimed).length
          };

          this.setData({
            couponList: filteredCoupons,
            tabCounts: counts,
            loading: false
          });
          resolve();
        }, 500);
      } catch (error) {
        console.error('Load coupons failed:', error);
        this.setData({ loading: false });
        resolve();
      }
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.loadCoupons();
  },

  async claimCoupon(e) {
    const id = e.currentTarget.dataset.id;
    
    try {
      wx.showLoading({ title: 'Claiming...' });

      await new Promise(resolve => setTimeout(resolve, 600));

      let allCoupons = wx.getStorageSync('mockCoupons') || [];
      allCoupons = allCoupons.map(coupon => {
        if (coupon.id === id) {
          return { ...coupon, claimed: true };
        }
        return coupon;
      });

      wx.setStorageSync('mockCoupons', allCoupons);

      wx.hideLoading();
      util.showSuccess('Coupon claimed!');

      this.loadCoupons();
    } catch (error) {
      wx.hideLoading();
      console.error('Claim coupon failed:', error);
      util.showToast('Claim failed');
    }
  }
});
