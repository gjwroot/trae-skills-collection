const util = require('../../utils/util.js');
const store = require('../../utils/store.js');

Page({
  data: {
    activeTab: 'all',
    notifications: [],
    unreadCount: {
      all: 0,
      order: 0,
      promotion: 0,
      system: 0
    },
    loading: true,
    refreshing: false
  },

  onLoad() {
    this.loadNotifications();
  },

  onShow() {
    this.loadNotifications();
  },

  async loadNotifications() {
    try {
      this.setData({ loading: true });
      
      setTimeout(() => {
        const mockNotifications = [
          {
            id: 1,
            type: 'order',
            title: 'Order Shipped',
            content: 'Your order #ORD123456 has been shipped and is on its way!',
            time: '2 min ago',
            read: false,
            tag: 'Order #123456',
            link: '/pages/order-detail/order-detail?id=123456'
          },
          {
            id: 2,
            type: 'promotion',
            title: 'Flash Sale',
            content: 'Limited time offer! Up to 70% off on selected items!',
            time: '1 hour ago',
            read: false,
            tag: 'Ends in 24h'
          },
          {
            id: 3,
            type: 'order',
            title: 'Order Delivered',
            content: 'Your order has been delivered. Enjoy your purchase!',
            time: 'Yesterday',
            read: true,
            tag: 'Order #123400'
          },
          {
            id: 4,
            type: 'system',
            title: 'Account Security',
            content: 'Your password has been changed successfully.',
            time: '2 days ago',
            read: true
          },
          {
            id: 5,
            type: 'promotion',
            title: 'New Coupon',
            content: 'You have received a $10 coupon! Use it before it expires.',
            time: '3 days ago',
            read: true,
            tag: '$10 OFF'
          }
        ];

        const filtered = this.filterNotifications(mockNotifications, this.data.activeTab);
        const unreadCount = this.calculateUnreadCount(mockNotifications);

        this.setData({
          notifications: filtered,
          allNotifications: mockNotifications,
          unreadCount,
          loading: false
        });
      }, 800);
    } catch (error) {
      console.error('Load notifications failed:', error);
      this.setData({ loading: false });
      util.showToast('Load failed');
    }
  },

  filterNotifications(notifications, type) {
    if (type === 'all') {
      return notifications;
    }
    return notifications.filter(item => item.type === type);
  },

  calculateUnreadCount(notifications) {
    const count = { all: 0, order: 0, promotion: 0, system: 0 };
    
    notifications.forEach(item => {
      if (!item.read) {
        count.all++;
        count[item.type]++;
      }
    });
    
    return count;
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    const filtered = this.filterNotifications(this.data.allNotifications || [], tab);
    
    this.setData({
      activeTab: tab,
      notifications: filtered
    });
  },

  viewNotification(e) {
    const item = e.currentTarget.dataset.item;
    
    if (!item.read) {
      this.markAsRead(item.id);
    }
    
    if (item.link) {
      wx.navigateTo({ url: item.link });
    }
  },

  markAsRead(id) {
    const notifications = this.data.allNotifications.map(item => {
      if (item.id === id) {
        return { ...item, read: true };
      }
      return item;
    });
    
    const filtered = this.filterNotifications(notifications, this.data.activeTab);
    const unreadCount = this.calculateUnreadCount(notifications);
    
    this.setData({
      allNotifications: notifications,
      notifications: filtered,
      unreadCount
    });
    
    wx.setStorageSync('mockNotifications', notifications);
  },

  markAllAsRead() {
    const notifications = this.data.allNotifications.map(item => ({
      ...item,
      read: true
    }));
    
    const filtered = this.filterNotifications(notifications, this.data.activeTab);
    const unreadCount = { all: 0, order: 0, promotion: 0, system: 0 };
    
    this.setData({
      allNotifications: notifications,
      notifications: filtered,
      unreadCount
    });
    
    wx.setStorageSync('mockNotifications', notifications);
    util.showSuccess('Marked all as read');
  },

  clearAll() {
    wx.showModal({
      title: 'Clear All',
      content: 'Are you sure you want to clear all notifications?',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            allNotifications: [],
            notifications: [],
            unreadCount: { all: 0, order: 0, promotion: 0, system: 0 }
          });
          
          wx.setStorageSync('mockNotifications', []);
          util.showSuccess('Cleared');
        }
      }
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    setTimeout(() => {
      this.loadNotifications();
      this.setData({ refreshing: false });
    }, 1000);
  },

  getIconName(type) {
    const icons = {
      order: 'order',
      promotion: 'coupon',
      system: 'setting'
    };
    return icons[type] || 'bell-o';
  },

  getIconColor(type) {
    const colors = {
      order: '#4CAF50',
      promotion: '#FF6B4A',
      system: '#2196F3'
    };
    return colors[type] || '#999';
  }
});
