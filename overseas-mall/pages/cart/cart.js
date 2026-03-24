const { get, post, del } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    cartList: [],
    allSelected: false,
    selectedCount: 0,
    totalPrice: '0.00',
    isEditing: false,
    animatingItemId: null,
    animationType: null,
    showMergeTip: false
  },

  onShow() {
    this.loadCartList();
    this.updateTabBarBadge();
    
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
      this.getTabBar().updateCartBadge();
    }
  },

  generateMockCartList() {
    const productImages = [
      '/assets/images/product-1.jpg',
      '/assets/images/product-2.jpg',
      '/assets/images/product-3.jpg',
      '/assets/images/product-4.jpg',
      '/assets/images/product-5.jpg',
      '/assets/images/product-6.jpg'
    ];
    const productNames = [
      'Wireless Bluetooth Headphones',
      'Smart Watch Series 5',
      'Cotton Casual T-Shirt',
      'Leather Wallet for Men',
      'Yoga Mat Non-Slip',
      'Premium Coffee Maker'
    ];
    
    const mockCartList = [];
    const itemCount = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < itemCount; i++) {
      const price = (Math.random() * 80 + 20).toFixed(2);
      const stock = Math.floor(Math.random() * 20);
      mockCartList.push({
        id: i + 1,
        goodsId: i + 1,
        specId: '101,202',
        name: productNames[i % productNames.length],
        image: productImages[i % productImages.length],
        price: price,
        quantity: Math.floor(Math.random() * 3) + 1,
        spec: 'Black, M',
        selected: false,
        stock: stock
      });
    }
    
    return mockCartList;
  },

  async loadCartList() {
    return new Promise((resolve) => {
      try {
        let cartList = wx.getStorageSync('mockCartList');
        
        if (!cartList || cartList.length === 0) {
          cartList = this.generateMockCartList();
          wx.setStorageSync('mockCartList', cartList);
        }
        
        this.setData({ cartList });
        this.calculateTotal();
        
        const hasMergeable = this.checkMergeable();
        this.setData({ showMergeTip: hasMergeable });
        
        resolve();
      } catch (error) {
        console.error('Load cart failed:', error);
        resolve();
      }
    });
  },

  saveCartList() {
    wx.setStorageSync('mockCartList', this.data.cartList);
  },

  async updateTabBarBadge() {
    try {
      const count = this.data.cartList.reduce((sum, item) => sum + item.quantity, 0);
      const app = getApp();
      app.globalData.cartCount = count;
      
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          cartCount: count
        });
      }
    } catch (error) {
      console.error('Update badge failed:', error);
    }
  },

  toggleSelectAll() {
    const allSelected = !this.data.allSelected;
    const cartList = this.data.cartList.map(item => ({
      ...item,
      selected: allSelected
    }));
    
    this.setData({ allSelected, cartList });
    this.saveCartList();
    this.calculateTotal();
  },

  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    const cartList = this.data.cartList.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    
    const allSelected = cartList.every(item => item.selected);
    
    this.setData({ cartList, allSelected });
    this.saveCartList();
    this.calculateTotal();
  },

  calculateTotal() {
    const selectedItems = this.data.cartList.filter(item => item.selected);
    const selectedCount = selectedItems.length;
    
    const total = selectedItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    
    this.setData({
      selectedCount,
      totalPrice: total.toFixed(2)
    });
  },

  async decreaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const currentQuantity = parseInt(e.currentTarget.dataset.quantity);
    
    if (currentQuantity <= 1) return;
    
    this.setData({
      animatingItemId: id,
      animationType: 'decrease'
    });
    
    const newQuantity = currentQuantity - 1;
    await this.updateQuantity(id, newQuantity);
    
    setTimeout(() => {
      this.setData({
        animatingItemId: null,
        animationType: null
      });
    }, 300);
  },

  async increaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const currentQuantity = parseInt(e.currentTarget.dataset.quantity);
    const item = this.data.cartList.find(item => item.id === id);
    
    if (currentQuantity >= 99) return;
    
    if (item && item.stock !== undefined && currentQuantity >= item.stock) {
      util.showToast(`Only ${item.stock} left in stock`);
      return;
    }
    
    this.setData({
      animatingItemId: id,
      animationType: 'increase'
    });
    
    const newQuantity = currentQuantity + 1;
    await this.updateQuantity(id, newQuantity);
    
    setTimeout(() => {
      this.setData({
        animatingItemId: null,
        animationType: null
      });
    }, 300);
  },

  async updateQuantity(id, quantity) {
    try {
      const cartList = this.data.cartList.map(item => {
        if (item.id === id) {
          return { ...item, quantity };
        }
        return item;
      });
      
      this.setData({ cartList });
      this.saveCartList();
      this.calculateTotal();
      this.updateTabBarBadge();
    } catch (error) {
      console.error('Update quantity failed:', error);
    }
  },

  toggleEdit() {
    this.setData({ isEditing: !this.data.isEditing });
  },

  async onDelete(e) {
    const id = e.currentTarget.dataset.id;
    
    const confirm = await util.showConfirm('Delete this item?', 'Confirm');
    if (!confirm) return;
    
    try {
      const cartList = this.data.cartList.filter(item => item.id !== id);
      
      this.setData({ cartList });
      this.saveCartList();
      this.calculateTotal();
      this.updateTabBarBadge();
      
      util.showSuccess('Deleted');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  },

  checkout() {
    if (this.data.selectedCount === 0) {
      util.showToast('Please select items');
      return;
    }
    
    const selectedItems = this.data.cartList.filter(item => item.selected);
    const orderData = {
      items: selectedItems.map(item => ({
        goodsId: item.goodsId,
        specId: item.specId,
        quantity: item.quantity,
        name: item.name,
        image: item.image,
        price: item.price,
        spec: item.spec
      }))
    };
    
    wx.setStorageSync('checkoutData', orderData);
    wx.navigateTo({ url: '/pages/checkout/checkout' });
  },

  goShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  checkMergeable() {
    const cartList = this.data.cartList;
    const itemMap = new Map();
    
    for (const item of cartList) {
      const key = `${item.goodsId}_${item.specId}`;
      if (itemMap.has(key)) {
        return true;
      }
      itemMap.set(key, item);
    }
    
    return false;
  },

  mergeCart() {
    const cartList = this.data.cartList;
    const itemMap = new Map();
    
    for (const item of cartList) {
      const key = `${item.goodsId}_${item.specId}`;
      if (itemMap.has(key)) {
        const existingItem = itemMap.get(key);
        existingItem.quantity += item.quantity;
      } else {
        itemMap.set(key, { ...item });
      }
    }
    
    const mergedCartList = Array.from(itemMap.values());
    
    if (mergedCartList.length < cartList.length) {
      this.setData({ 
        cartList: mergedCartList, 
        showMergeTip: false 
      });
      this.saveCartList();
      this.calculateTotal();
      this.updateTabBarBadge();
      util.showSuccess('购物车已合并');
    } else {
      util.showToast('没有可合并的商品');
    }
  },

  batchSetQuantity(quantity) {
    const selectedItems = this.data.cartList.filter(item => item.selected);
    if (selectedItems.length === 0) {
      util.showToast('请先选择商品');
      return;
    }
    
    const cartList = this.data.cartList.map(item => {
      if (item.selected) {
        return { ...item, quantity: Math.max(1, Math.min(99, quantity)) };
      }
      return item;
    });
    
    this.setData({ cartList });
    this.saveCartList();
    this.calculateTotal();
    this.updateTabBarBadge();
    util.showSuccess('批量设置成功');
  },

  showBatchQuantityDialog() {
    const selectedItems = this.data.cartList.filter(item => item.selected);
    if (selectedItems.length === 0) {
      util.showToast('请先选择商品');
      return;
    }
    
    wx.showActionSheet({
      itemList: ['设为1件', '设为2件', '设为3件', '设为5件', '设为10件'],
      success: (res) => {
        const quantities = [1, 2, 3, 5, 10];
        this.batchSetQuantity(quantities[res.tapIndex]);
      }
    });
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${id}` });
  },

  dismissMergeTip() {
    this.setData({ showMergeTip: false });
  },

  onPullDownRefresh() {
    this.loadCartList().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
