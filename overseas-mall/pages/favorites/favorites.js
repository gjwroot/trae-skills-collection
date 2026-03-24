const { get, post, del } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    activeTab: 'goods',
    goodsList: [],
    shopList: [],
    page: 1,
    pageSize: 20,
    loading: false,
    noMore: false,
    isEditMode: false,
    selectedIds: [],
    selectAll: false
  },

  onLoad() {
    this.loadFavorites();
  },

  onShow() {
    this.loadFavorites();
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    
    if (tab === 'shops' && this.data.shopList.length === 0) {
      this.loadShops();
    }
  },

  generateMockFavorites() {
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
    
    const goods = [];
    const count = Math.floor(Math.random() * 6) + 4;
    
    for (let i = 0; i < count; i++) {
      const price = (Math.random() * 100 + 20).toFixed(2);
      const originalPrice = (parseFloat(price) * 1.3).toFixed(2);
      goods.push({
        id: i + 1,
        name: productNames[i % productNames.length],
        image: productImages[i % productImages.length],
        price: price,
        originalPrice: originalPrice,
        sales: Math.floor(Math.random() * 1000) + 50
      });
    }
    
    return goods;
  },

  async loadFavorites() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const favoriteIds = wx.getStorageSync('mockFavorites') || [];
      
      let goodsList = [];
      if (favoriteIds.length > 0) {
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
        
        favoriteIds.forEach((id, index) => {
          const price = (Math.random() * 100 + 20).toFixed(2);
          const originalPrice = (parseFloat(price) * 1.3).toFixed(2);
          goodsList.push({
            id: id,
            name: productNames[index % productNames.length],
            image: productImages[index % productImages.length],
            price: price,
            originalPrice: originalPrice,
            sales: Math.floor(Math.random() * 1000) + 50
          });
        });
      }
      
      if (goodsList.length === 0) {
        goodsList = this.generateMockFavorites();
        const defaultIds = goodsList.map(item => item.id);
        wx.setStorageSync('mockFavorites', defaultIds);
      }
      
      const pageSize = this.data.pageSize;
      const startIndex = (this.data.page - 1) * pageSize;
      const paginatedList = goodsList.slice(startIndex, startIndex + pageSize);
      
      const displayList = this.data.page === 1 
        ? paginatedList
        : [...this.data.goodsList, ...paginatedList];
      
      this.setData({
        goodsList: displayList,
        loading: false,
        noMore: startIndex + pageSize >= goodsList.length
      });
    } catch (error) {
      console.error('Load favorites failed:', error);
      this.setData({ loading: false });
    }
  },

  saveFavorites() {
    wx.setStorageSync('mockFavorites', this.data.goodsList);
  },

  async loadShops() {
    try {
      const res = await get(api.shop.followedList);
      this.setData({ shopList: res.list || [] });
    } catch (error) {
      console.error('Load shops failed:', error);
    }
  },

  async loadMore() {
    if (this.data.noMore || this.data.loading) return;
    
    this.setData({ page: this.data.page + 1 });
    await this.loadFavorites();
  },

  async removeFavorite(e) {
    const id = e.currentTarget.dataset.id;
    
    try {
      const goodsList = this.data.goodsList.filter(item => item.id !== id);
      this.setData({ goodsList });
      
      let allFavorites = wx.getStorageSync('mockFavorites') || [];
      allFavorites = allFavorites.filter(favId => favId !== id);
      wx.setStorageSync('mockFavorites', allFavorites);
      
      util.showSuccess('Removed');
    } catch (error) {
      console.error('Remove favorite failed:', error);
    }
  },

  async unfollowShop(e) {
    const id = e.currentTarget.dataset.id;
    
    try {
      await post(api.shop.unfollow, { shopId: id });
      
      const shopList = this.data.shopList.filter(item => item.id !== id);
      this.setData({ shopList });
      
      util.showSuccess('Unfollowed');
    } catch (error) {
      console.error('Unfollow shop failed:', error);
    }
  },

  navigateToDetail(e) {
    if (this.data.isEditMode) {
      this.toggleSelect(e);
      return;
    }
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${id}` });
  },

  navigateToShop(e) {
    const id = e.currentTarget.dataset.id;
    wx.switchTab({ url: '/pages/category/category' });
  },

  toggleEditMode() {
    this.setData({
      isEditMode: !this.data.isEditMode,
      selectedIds: [],
      selectAll: false
    });
  },

  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    let selectedIds = [...this.data.selectedIds];
    const index = selectedIds.indexOf(id);
    
    if (index > -1) {
      selectedIds.splice(index, 1);
    } else {
      selectedIds.push(id);
    }
    
    const selectAll = selectedIds.length === this.data.goodsList.length;
    
    this.setData({
      selectedIds,
      selectAll
    });
  },

  toggleSelectAll() {
    if (this.data.selectAll) {
      this.setData({
        selectedIds: [],
        selectAll: false
      });
    } else {
      const allIds = this.data.goodsList.map(item => item.id);
      this.setData({
        selectedIds: allIds,
        selectAll: true
      });
    }
  },

  batchDelete() {
    if (this.data.selectedIds.length === 0) {
      util.showToast('Please select items first');
      return;
    }

    wx.showModal({
      title: 'Confirm Delete',
      content: `Delete ${this.data.selectedIds.length} selected items?`,
      confirmColor: '#FF6B4A',
      success: (res) => {
        if (res.confirm) {
          this.doBatchDelete();
        }
      }
    });
  },

  doBatchDelete() {
    const selectedIds = this.data.selectedIds;
    
    try {
      const goodsList = this.data.goodsList.filter(item => !selectedIds.includes(item.id));
      
      let allFavorites = wx.getStorageSync('mockFavorites') || [];
      allFavorites = allFavorites.filter(id => !selectedIds.includes(id));
      wx.setStorageSync('mockFavorites', allFavorites);
      
      this.setData({
        goodsList,
        selectedIds: [],
        selectAll: false,
        isEditMode: false
      });
      
      util.showSuccess('Deleted successfully');
    } catch (error) {
      console.error('Batch delete failed:', error);
      util.showToast('Delete failed');
    }
  },

  goShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  onPullDownRefresh() {
    this.setData({
      goodsList: [],
      page: 1,
      noMore: false
    });
    
    this.loadFavorites().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
