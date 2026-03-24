const store = require('../../utils/store.js');

Page({
  data: {
    menuItems: [],
    categories: ['全部'],
    currentCategory: '全部',
    filteredItems: [],
    cartCount: 0,
    cartTotal: 0,
    itemQuantities: {},
    isFavorites: {}
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    this.updateCartInfo();
  },

  initData() {
    const items = store.menuItems;
    const categories = ['全部', ...new Set(items.map(item => item.category))];
    
    this.setData({
      menuItems: items,
      categories: categories,
      filteredItems: items
    });
    
    this.updateCartInfo();
    this.updateFavoritesInfo();
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category
    });
    this.filterItems(category);
  },

  filterItems(category) {
    let filtered = this.data.menuItems;
    if (category !== '全部') {
      filtered = this.data.menuItems.filter(item => item.category === category);
    }
    this.setData({
      filteredItems: filtered
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

  getItemQuantity(id) {
    const cart = store.getCart();
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  },

  updateCartInfo() {
    const cart = store.getCart();
    const itemQuantities = {};
    cart.forEach(item => {
      itemQuantities[item.id] = item.quantity;
    });
    this.setData({
      cartCount: store.getCartCount(),
      cartTotal: store.getCartTotal(),
      itemQuantities
    });
  },

  goToCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
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