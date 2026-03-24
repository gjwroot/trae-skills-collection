class Store {
  constructor() {
    this.state = {
      cartCount: 0,
      userInfo: null,
      token: null,
      unreadCount: 0
    };
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  async loadCartCount() {
    const cartList = wx.getStorageSync('mockCartList') || [];
    const count = cartList.reduce((sum, item) => sum + item.quantity, 0);
    this.setState({ cartCount: count });
    return count;
  }

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || null;
    const token = wx.getStorageSync('token') || null;
    this.setState({ userInfo, token });
  }

  clearUserInfo() {
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
    this.setState({ userInfo: null, token: null });
  }
}

module.exports = new Store();
