const store = require('../../utils/store.js');

Page({
  data: {
    item: {},
    quantity: 1,
    isFavorite: false,
    nutrition: {
      calories: 280,
      protein: 18,
      fat: 12,
      carbs: 25
    },
    ingredients: ['新鲜食材', '优质调料', '精选配料']
  },

  onLoad(options) {
    // 从options获取菜品ID，这里使用模拟数据
    const itemId = parseInt(options.id) || 1;
    const item = store.menuItems.find(i => i.id === itemId) || store.menuItems[0];
    
    // 检查是否已收藏
    const favorites = store.getFavorites();
    const isFavorite = favorites.some(f => f.id === item.id);
    
    this.setData({ 
      item,
      isFavorite,
      totalPrice: item.price
    });
  },

  goBack() {
    wx.navigateBack();
  },

  toggleFavorite() {
    const { item, isFavorite } = this.data;
    
    const result = store.toggleFavorite(item);
    if (result) {
      wx.showToast({ title: '已收藏', icon: 'success' });
    } else {
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    }
    
    this.setData({ isFavorite: !isFavorite });
  },

  decreaseQuantity() {
    if (this.data.quantity > 1) {
      const quantity = this.data.quantity - 1;
      this.setData({
        quantity,
        totalPrice: (quantity * this.data.item.price).toFixed(2)
      });
    }
  },

  increaseQuantity() {
    const quantity = this.data.quantity + 1;
    this.setData({
      quantity,
      totalPrice: (quantity * this.data.item.price).toFixed(2)
    });
  },

  addToCart() {
    const { item, quantity } = this.data;
    
    // 添加指定数量到购物车
    for (let i = 0; i < quantity; i++) {
      store.addToCart(item);
    }
    
    wx.showToast({
      title: `已添加${quantity}份`,
      icon: 'success'
    });
  }
});
