const store = require('../../utils/store.js');

Page({
  data: {
    searchText: '',
    searchResults: [],
    hotTags: ['红烧肉', '宫保鸡丁', '蛋炒饭', '糖醋排骨', '麻婆豆腐'],
    itemQuantities: {},
    isFavorites: {}
  },

  onLoad() {
    this.updateCartInfo();
    this.updateFavoritesInfo();
  },

  onShow() {
    this.updateCartInfo();
    this.updateFavoritesInfo();
  },

  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value
    });
    this.search(e.detail.value);
  },

  onSearch() {
    this.search(this.data.searchText);
  },

  searchTag(e) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({
      searchText: tag
    });
    this.search(tag);
  },

  clearSearch() {
    this.setData({
      searchText: '',
      searchResults: []
    });
  },

  search(text) {
    if (!text || text.trim() === '') {
      this.setData({
        searchResults: []
      });
      return;
    }

    const results = store.menuItems.filter(item => 
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      item.description.toLowerCase().includes(text.toLowerCase())
    );

    this.setData({
      searchResults: results
    });
  },

  addToCart(e) {
    const item = e.currentTarget.dataset.item;
    store.addToCart(item);
    this.updateCartInfo();
    wx.showToast({
      title: '已添加',
      icon: 'success',
      duration: 1000
    });
  },

  increaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const cart = store.getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      store.updateQuantity(id, item.quantity + 1);
      this.updateCartInfo();
    }
  },

  decreaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const cart = store.getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      store.updateQuantity(id, item.quantity - 1);
      this.updateCartInfo();
    }
  },

  updateCartInfo() {
    const cart = store.getCart();
    const itemQuantities = {};
    cart.forEach(item => {
      itemQuantities[item.id] = item.quantity;
    });
    this.setData({
      itemQuantities
    });
  },

  toggleFavorite(e) {
    const item = e.currentTarget.dataset.item;
    const isAdded = store.toggleFavorite(item);
    this.updateFavoritesInfo();
    wx.showToast({
      title: isAdded ? '已收藏' : '已取消收藏',
      icon: 'success',
      duration: 1000
    });
  },

  updateFavoritesInfo() {
    const isFavorites = {};
    store.menuItems.forEach(item => {
      isFavorites[item.id] = store.isFavorite(item.id);
    });
    this.setData({
      isFavorites
    });
  }
});
