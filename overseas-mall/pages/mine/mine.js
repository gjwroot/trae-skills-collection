const { get, post } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const memberManager = require('../../utils/member.js');
const checkInManager = require('../../utils/check-in.js');

Page({
  data: {
    userInfo: {},
    memberInfo: {
      levelName: '',
      levelIcon: '',
      levelColor: '',
      nextLevel: null,
      nextLevelName: '',
      progress: 0,
      remaining: 0
    },
    hasCheckedIn: false,
    orderCounts: {
      pending: 0,
      paid: 0,
      shipped: 0,
      completed: 0,
      refund: 0
    },
    refundCount: 0,
    unreadCount: 0,
    statsData: {
      totalSpent: 0,
      totalOrders: 0,
      totalFavorites: 0,
      totalCoupons: 0
    }
  },

  onShow() {
    this.checkLoginStatus();
    this.loadOrderCounts();
    this.loadRefundCount();
    this.loadUnreadCount();
    this.loadStatsData();
    this.checkInStatus();
    
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      });
      this.getTabBar().updateCartBadge();
    }
  },

  checkLoginStatus() {
    let userInfo = wx.getStorageSync('userInfo') || {};
    
    if (userInfo.id && !userInfo.vipLevel) {
      userInfo = {
        ...userInfo,
        vipLevel: Math.floor(Math.random() * 3) + 1,
        points: Math.floor(Math.random() * 5000) + 1000
      };
    }
    
    this.setData({ userInfo });
    this.loadMemberInfo(userInfo);
  },

  loadMemberInfo(userInfo) {
    if (!userInfo.id) {
      return;
    }

    const points = userInfo.points || 0;
    const level = memberManager.getLevelByPoints(points);
    const nextLevel = memberManager.getNextLevel(points);
    const progressInfo = memberManager.getProgressToNextLevel(points);

    this.setData({
      memberInfo: {
        levelName: level.name,
        levelIcon: level.icon,
        levelColor: level.color,
        nextLevel: nextLevel,
        nextLevelName: nextLevel ? nextLevel.name : '',
        progress: progressInfo.progress,
        remaining: progressInfo.remaining
      }
    });
  },

  checkInStatus() {
    const hasCheckedIn = checkInManager.hasCheckedInToday();
    this.setData({ hasCheckedIn });
  },

  navigateToSignIn() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/sign-in/sign-in' });
  },

  navigateToCouponCenter() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/coupon-center/coupon-center' });
  },

  navigateToFlashSale() {
    wx.navigateTo({ url: '/pages/flash-sale/flash-sale' });
  },

  async loadOrderCounts() {
    try {
      this.setData({
        orderCounts: {
          pending: Math.floor(Math.random() * 3),
          paid: Math.floor(Math.random() * 2),
          shipped: Math.floor(Math.random() * 2),
          completed: Math.floor(Math.random() * 5),
          refund: Math.floor(Math.random() * 1)
        }
      });
    } catch (error) {
      console.error('Load order counts failed:', error);
    }
  },

  loadUnreadCount() {
    try {
      const notifications = wx.getStorageSync('mockNotifications') || [];
      const unreadCount = notifications.filter(item => !item.read).length;
      this.setData({ unreadCount: unreadCount > 0 ? unreadCount : 0 });
    } catch (error) {
      this.setData({ unreadCount: 0 });
    }
  },

  loadRefundCount() {
    this.setData({ refundCount: Math.floor(Math.random() * 3) + 1 });
  },

  loadStatsData() {
    try {
      const mockOrders = wx.getStorageSync('mockOrders') || [];
      const mockFavorites = wx.getStorageSync('mockFavorites') || [];
      const mockCoupons = wx.getStorageSync('mockCoupons') || [];
      
      let totalSpent = 0;
      let totalOrders = 0;
      
      mockOrders.forEach(order => {
        if (order.status !== 'cancelled') {
          totalSpent += parseFloat(order.totalAmount || 0);
          totalOrders++;
        }
      });
      
      if (totalSpent === 0) {
        totalSpent = Math.floor(Math.random() * 2000) + 100;
      }
      if (totalOrders === 0) {
        totalOrders = Math.floor(Math.random() * 20) + 5;
      }
      
      this.setData({
        statsData: {
          totalSpent: totalSpent.toFixed(2),
          totalOrders: totalOrders,
          totalFavorites: mockFavorites.length || Math.floor(Math.random() * 20) + 5,
          totalCoupons: mockCoupons.length || Math.floor(Math.random() * 10) + 2
        }
      });
    } catch (error) {
      console.error('Load stats data failed:', error);
      this.setData({
        statsData: {
          totalSpent: (Math.random() * 2000 + 100).toFixed(2),
          totalOrders: Math.floor(Math.random() * 20) + 5,
          totalFavorites: Math.floor(Math.random() * 20) + 5,
          totalCoupons: Math.floor(Math.random() * 10) + 2
        }
      });
    }
  },

  navigateToRefundList() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/refund-list/refund-list' });
  },

  navigateToMessages() {
    wx.navigateTo({ url: '/pages/notifications/notifications' });
  },

  navigateToProfile() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  navigateToOrderList(e) {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    
    const status = e.currentTarget.dataset.status || 'all';
    wx.navigateTo({ url: `/pages/order-list/order-list?status=${status}` });
  },

  navigateToFavorites() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/favorites/favorites' });
  },

  navigateToWishlist() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/wishlist/wishlist' });
  },

  navigateToHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  },

  navigateToCoupons() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/coupons/coupons' });
  },

  navigateToVipBenefits() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/vip-benefits/vip-benefits' });
  },

  navigateToMemberActivity() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/member-activity/member-activity' });
  },

  navigateToPoints() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/points-rules/points-rules' });
  },

  navigateToAddress() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/address-list/address-list' });
  },

  navigateToPayment() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  navigateToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  navigateToHelp() {
    wx.navigateTo({ url: '/pages/help/help' });
  },

  handleLogout() {
    wx.showModal({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      success: (res) => {
        if (!res.confirm) return;
        
        wx.showLoading({ title: 'Logging out...', mask: true });
        
        post(api.auth.logout, {}, { showLoading: false })
          .then(() => {
            this.clearUserData();
            wx.hideLoading();
            util.showSuccess('Logged out');
          })
          .catch((error) => {
            console.error('Logout API failed:', error);
            this.clearUserData();
            wx.hideLoading();
            util.showSuccess('Logged out');
          });
      }
    });
  },

  clearUserData() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    
    const app = getApp();
    if (app) {
      app.globalData.userInfo = null;
      app.globalData.isLoggedIn = false;
    }
    
    this.setData({
      userInfo: {},
      orderCounts: {
        pending: 0,
        paid: 0,
        shipped: 0,
        completed: 0,
        refund: 0
      }
    });
  }
});
