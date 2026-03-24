const store = require('../../utils/store.js');

Page({
  data: {
    currentTab: 'cart',
    cart: [],
    orders: [],
    total: 0
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    this.setData({
      cart: store.getCart(),
      orders: store.getOrders(),
      total: store.getCartTotal()
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
    if (tab === 'orders') {
      this.setData({
        orders: store.getOrders()
      });
    }
  },

  increaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const cart = store.getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      store.updateQuantity(id, item.quantity + 1);
      this.loadData();
    }
  },

  decreaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const cart = store.getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      store.updateQuantity(id, item.quantity - 1);
      this.loadData();
    }
  },

  placeOrder() {
    wx.showModal({
      title: '确认下单',
      content: `合计 ¥${this.data.total}，确认下单吗？`,
      success: (res) => {
        if (res.confirm) {
          const order = store.placeOrder();
          if (order) {
            wx.showToast({
              title: '下单成功',
              icon: 'success'
            });
            this.loadData();
            this.setData({
              currentTab: 'orders'
            });
          }
        }
      }
    });
  },

  goToMenu() {
    wx.switchTab({
      url: '/pages/menu/menu'
    });
  }
});