const images = require('./images.js');

const store = {
  cart: [],
  orders: [],
  favorites: [],
  addresses: [],
  menuItems: [
    {
      id: 1,
      name: '红烧肉',
      price: 38,
      image: images.dishes.hongshaorou,
      category: '热菜',
      description: '肥而不腻，入口即化'
    },
    {
      id: 2,
      name: '宫保鸡丁',
      price: 32,
      image: images.dishes.gongbaojiding,
      category: '热菜',
      description: '经典川菜，麻辣鲜香'
    },
    {
      id: 3,
      name: '清蒸鲈鱼',
      price: 58,
      image: images.dishes.qingzhengluyu,
      category: '海鲜',
      description: '肉质鲜嫩，营养丰富'
    },
    {
      id: 4,
      name: '蒜蓉西兰花',
      price: 18,
      image: images.dishes.suanrongxilanhua,
      category: '蔬菜',
      description: '清清爽爽，健康美味'
    },
    {
      id: 5,
      name: '麻婆豆腐',
      price: 22,
      image: images.dishes.mapodoufu,
      category: '热菜',
      description: '麻辣鲜香，豆腐嫩滑'
    },
    {
      id: 6,
      name: '蛋炒饭',
      price: 15,
      image: images.dishes.danjiaofan,
      category: '主食',
      description: '粒粒分明，蛋香四溢'
    },
    {
      id: 7,
      name: '酸辣汤',
      price: 12,
      image: images.dishes.suanlatang,
      category: '汤类',
      description: '开胃暖身，酸辣可口'
    },
    {
      id: 8,
      name: '糖醋排骨',
      price: 42,
      image: images.dishes.tangcupaigu,
      category: '热菜',
      description: '酸甜适口，外酥里嫩'
    },
    {
      id: 9,
      name: '过年的饺子',
      price: 28,
      image: images.dishes.jiaozi,
      category: '主食',
      description: '小时候的回忆'
    }
  ],
  
  getCart() {
    return this.cart;
  },
  
  addToCart(item) {
    const existingItem = this.cart.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
    this.saveToStorage();
  },
  
  removeFromCart(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.saveToStorage();
  },
  
  updateQuantity(itemId, quantity) {
    const item = this.cart.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(itemId);
      }
    }
    this.saveToStorage();
  },

  updateCartItemQuantity(itemId, quantity) {
    this.updateQuantity(itemId, quantity);
  },
  
  getCartTotal() {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  },
  
  clearCart() {
    this.cart = [];
    this.saveToStorage();
  },
  
  placeOrder() {
    if (this.cart.length === 0) return null;
    
    const order = {
      id: Date.now(),
      items: [...this.cart],
      total: this.getCartTotal(),
      status: '待制作',
      createTime: new Date().toLocaleString()
    };
    
    this.orders.unshift(order);
    this.clearCart();
    this.saveOrdersToStorage();
    return order;
  },
  
  getOrders() {
    return this.orders;
  },
  
  saveToStorage() {
    wx.setStorageSync('cart', this.cart);
  },
  
  loadFromStorage() {
    const savedCart = wx.getStorageSync('cart');
    if (savedCart) {
      this.cart = savedCart;
    }
  },
  
  saveOrdersToStorage() {
    wx.setStorageSync('orders', this.orders);
  },
  
  loadOrdersFromStorage() {
    const savedOrders = wx.getStorageSync('orders');
    if (savedOrders) {
      this.orders = savedOrders;
    }
  },

  getFavorites() {
    return this.favorites;
  },

  toggleFavorite(item) {
    const index = this.favorites.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(item);
    }
    this.saveFavoritesToStorage();
    return index === -1;
  },

  isFavorite(itemId) {
    return this.favorites.some(i => i.id === itemId);
  },

  getFavoriteCount() {
    return this.favorites.length;
  },

  saveFavoritesToStorage() {
    wx.setStorageSync('favorites', this.favorites);
  },

  loadFavoritesFromStorage() {
    const savedFavorites = wx.getStorageSync('favorites');
    if (savedFavorites) {
      this.favorites = savedFavorites;
    }
  },

  getAddresses() {
    return this.addresses;
  },

  addAddress(address) {
    address.id = Date.now();
    this.addresses.push(address);
    this.saveAddressesToStorage();
  },

  updateAddress(id, address) {
    const index = this.addresses.findIndex(a => a.id === id);
    if (index > -1) {
      this.addresses[index] = { ...this.addresses[index], ...address };
      this.saveAddressesToStorage();
    }
  },

  deleteAddress(id) {
    this.addresses = this.addresses.filter(a => a.id !== id);
    this.saveAddressesToStorage();
  },

  setDefaultAddress(id) {
    this.addresses.forEach(a => {
      a.isDefault = a.id === id;
    });
    this.saveAddressesToStorage();
  },

  getDefaultAddress() {
    return this.addresses.find(a => a.isDefault) || this.addresses[0];
  },

  saveAddressesToStorage() {
    wx.setStorageSync('addresses', this.addresses);
  },

  loadAddressesFromStorage() {
    const savedAddresses = wx.getStorageSync('addresses');
    if (savedAddresses) {
      this.addresses = savedAddresses;
    }
  }
};

store.loadFromStorage();
store.loadOrdersFromStorage();
store.loadFavoritesFromStorage();
store.loadAddressesFromStorage();

module.exports = store;
