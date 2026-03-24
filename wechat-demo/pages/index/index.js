const store = require('../../utils/store.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    recommendItems: [],
    cart: [],
    icons: icons
  },

  onLoad() {
    this.initRecommendItems();
    this.loadCart();
  },

  onShow() {
    this.loadCart();
  },

  initRecommendItems() {
    const items = store.menuItems;
    const shuffled = items.sort(() => Math.random() - 0.5);
    const recommendItems = shuffled.slice(0, 3).map(item => ({
      ...item,
      quantity: 0
    }));
    this.setData({ recommendItems });
    this.updateItemQuantities();
  },

  loadCart() {
    const cart = store.getCart();
    this.setData({ cart });
    this.updateItemQuantities();
  },

  updateItemQuantities() {
    const recommendItems = this.data.recommendItems.map(item => {
      const cartItem = this.data.cart.find(c => c.id === item.id);
      return {
        ...item,
        quantity: cartItem ? cartItem.quantity : 0
      };
    });
    this.setData({ recommendItems });
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  goToMenu() {
    wx.switchTab({
      url: '/pages/menu/menu'
    });
  },

  goToCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },

  goToFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  },

  goToAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    });
  },

  goToService(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/${type}/${type}`
    });
  },

  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${item.id}`
    });
  },

  addRecommend(e) {
    const item = e.currentTarget.dataset.item;
    store.addToCart(item);
    this.loadCart();
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1000
    });
  },

  decreaseQuantity(e) {
    const item = e.currentTarget.dataset.item;
    store.updateCartItemQuantity(item.id, item.quantity - 1);
    this.loadCart();
  },

  preventBubble() {
    // 阻止事件冒泡
  }
});
