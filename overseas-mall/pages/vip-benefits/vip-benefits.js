const util = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    vipLevels: [
      { level: 1, desc: 'New Member', pointsRequired: 0, color: '#999' },
      { level: 2, desc: 'Silver Member', pointsRequired: 1000, color: '#C0C0C0' },
      { level: 3, desc: 'Gold Member', pointsRequired: 3000, color: '#FFD700' },
      { level: 4, desc: 'Platinum Member', pointsRequired: 6000, color: '#E5E4E2' },
      { level: 5, desc: 'Diamond Member', pointsRequired: 10000, color: '#B9F2FF' }
    ],
    benefits: [
      { icon: 'gift-o', title: 'Birthday Gift', desc: 'Exclusive birthday gift' },
      { icon: 'logistics', title: 'Free Shipping', desc: 'Free shipping for orders' },
      { icon: 'coupon', title: 'Exclusive Coupons', desc: 'VIP only discounts' },
      { icon: 'service-o', title: 'Priority Service', desc: '24/7 customer support' },
      { icon: 'star-o', title: 'Early Access', desc: 'New products first' },
      { icon: 'gem-o', title: 'Double Points', desc: 'Earn points faster' }
    ],
    rules: [
      { title: 'Sign in daily', points: 10 },
      { title: 'Complete an order', points: 50 },
      { title: 'Write a review', points: 30 },
      { title: 'Share products', points: 20 },
      { title: 'Invite friends', points: 100 }
    ],
    currentLevel: {},
    nextLevel: {},
    progressPercent: 0,
    pointsToNextLevel: 0
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    let userInfo = wx.getStorageSync('userInfo') || {};
    
    if (userInfo.id && !userInfo.vipLevel) {
      userInfo = {
        ...userInfo,
        vipLevel: Math.floor(Math.random() * 3) + 1,
        points: Math.floor(Math.random() * 5000) + 1000
      };
      wx.setStorageSync('userInfo', userInfo);
    }
    
    this.setData({ userInfo });
    this.calculateVipProgress();
  },

  calculateVipProgress() {
    const { userInfo, vipLevels } = this.data;
    const currentPoints = userInfo.points || 0;
    const currentVipLevel = userInfo.vipLevel || 1;
    
    let currentLevel = vipLevels.find(level => level.level === currentVipLevel) || vipLevels[0];
    let nextLevel = vipLevels.find(level => level.level === currentVipLevel + 1) || vipLevels[vipLevels.length - 1];
    
    let progressPercent = 100;
    let pointsToNextLevel = 0;
    
    if (currentVipLevel < vipLevels.length) {
      const currentLevelPoints = currentLevel.pointsRequired;
      const nextLevelPoints = nextLevel.pointsRequired;
      const pointsRange = nextLevelPoints - currentLevelPoints;
      const pointsEarned = currentPoints - currentLevelPoints;
      
      progressPercent = Math.min((pointsEarned / pointsRange) * 100, 100);
      pointsToNextLevel = Math.max(nextLevelPoints - currentPoints, 0);
    }
    
    this.setData({
      currentLevel,
      nextLevel,
      progressPercent,
      pointsToNextLevel
    });
  }
});
