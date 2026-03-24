const util = require('../../utils/util.js');
const wishlistManager = require('../../utils/wishlist.js');

Page({
  data: {
    activeTab: 'wishlist',
    wishlist: [],
    priceAlerts: [],
    loading: true,
    batchMode: false,
    selectedItems: new Set(),
    selectAll: false
  },

  onLoad() {
    this.loadWishlist();
  },

  onShow() {
    this.loadWishlist();
  },

  onPullDownRefresh() {
    this.loadWishlist();
    wx.stopPullDownRefresh();
  },

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  goToHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    if (tab === 'alerts') {
      this.loadPriceAlerts();
    } else {
      this.loadWishlist();
    }
  },

  loadWishlist() {
    this.setData({ loading: true });
    
    setTimeout(() => {
      const wishlist = wishlistManager.getWishlist();
      this.setData({
        wishlist,
        loading: false
      });
    }, 300);
  },

  loadPriceAlerts() {
    this.setData({ loading: true });
    
    setTimeout(() => {
      const priceAlerts = wishlistManager.getPriceAlerts();
      this.setData({
        priceAlerts,
        loading: false
      });
    }, 300);
  },

  toggleBatchMode() {
    this.setData({
      batchMode: !this.data.batchMode,
      selectedItems: new Set(),
      selectAll: false
    });
  },

  selectItem(e) {
    const id = e.currentTarget.dataset.id;
    const selectedItems = new Set(this.data.selectedItems);
    
    if (selectedItems.has(id)) {
      selectedItems.delete(id);
    } else {
      selectedItems.add(id);
    }
    
    this.setData({
      selectedItems,
      selectAll: selectedItems.size === this.data.wishlist.length
    });
  },

  toggleSelectAll() {
    if (this.data.selectAll) {
      this.setData({
        selectedItems: new Set(),
        selectAll: false
      });
    } else {
      const allIds = this.data.wishlist.map(item => item.id);
      this.setData({
        selectedItems: new Set(allIds),
        selectAll: true
      });
    }
  },

  deleteSelected() {
    if (this.data.selectedItems.size === 0) {
      util.showToast('请先选择商品');
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除选中的 ${this.data.selectedItems.size} 件商品吗？`,
      success: (res) => {
        if (res.confirm) {
          this.data.selectedItems.forEach(id => {
            wishlistManager.removeFromWishlist(id);
          });
          
          util.showSuccess('删除成功');
          this.loadWishlist();
          this.toggleBatchMode();
        }
      }
    });
  },

  removeFromWishlist(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认移除',
      content: '确定要从心愿单移除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          const result = wishlistManager.removeFromWishlist(id);
          if (result.success) {
            util.showSuccess(result.message);
            this.loadWishlist();
          } else {
            util.showToast(result.message);
          }
        }
      }
    });
  },

  addToCart(e) {
    const goods = e.currentTarget.dataset.goods;
    
    try {
      let cart = wx.getStorageSync('mockCart') || [];
      const existingItem = cart.find(item => item.id === goods.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: goods.id,
          name: goods.name,
          image: goods.image,
          price: goods.price,
          quantity: 1,
          selected: true
        });
      }
      
      wx.setStorageSync('mockCart', cart);
      util.showSuccess('已加入购物车');
    } catch (error) {
      console.error('Add to cart failed:', error);
      util.showToast('加入购物车失败');
    }
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods-detail/goods-detail?id=${id}`
    });
  },

  clearAll() {
    if (this.data.wishlist.length === 0) {
      return;
    }

    wx.showModal({
      title: '清空心愿单',
      content: '确定要清空心愿单吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          const result = wishlistManager.clearWishlist();
          if (result.success) {
            util.showSuccess(result.message);
            this.loadWishlist();
          }
        }
      }
    });
  },

  setPriceAlert(e) {
    const goods = e.currentTarget.dataset.goods;
    
    wx.showModal({
      title: '设置价格提醒',
      editable: true,
      placeholderText: '输入期望价格',
      content: `当前价格: $${goods.price}`,
      success: (res) => {
        if (res.confirm && res.content) {
          const targetPrice = parseFloat(res.content);
          if (isNaN(targetPrice) || targetPrice <= 0) {
            util.showToast('请输入有效的价格');
            return;
          }
          
          const result = wishlistManager.addPriceAlert(goods, targetPrice);
          util.showToast(result.message);
        }
      }
    });
  },

  removePriceAlert(e) {
    const alertId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '取消提醒',
      content: '确定要取消这个价格提醒吗？',
      success: (res) => {
        if (res.confirm) {
          const result = wishlistManager.removePriceAlert(alertId);
          if (result.success) {
            util.showSuccess(result.message);
            this.loadPriceAlerts();
          } else {
            util.showToast(result.message);
          }
        }
      }
    });
  }
});
