const store = require('../../utils/store.js');

Page({
  data: {
    favorites: []
  },

  onLoad() {
    this.loadFavorites();
  },

  onShow() {
    this.loadFavorites();
  },

  loadFavorites() {
    this.setData({
      favorites: store.getFavorites()
    });
  },

  toggleFavorite(e) {
    const item = e.currentTarget.dataset.item;
    store.toggleFavorite(item);
    this.loadFavorites();
    wx.showToast({
      title: '已取消收藏',
      icon: 'success',
      duration: 1000
    });
  },

  addToCart(e) {
    const item = e.currentTarget.dataset.item;
    store.addToCart(item);
    wx.showToast({
      title: '已添加',
      icon: 'success',
      duration: 1000
    });
  },

  goToMenu() {
    wx.switchTab({
      url: '/pages/menu/menu'
    });
  }
});
