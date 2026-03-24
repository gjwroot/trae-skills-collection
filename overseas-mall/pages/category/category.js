const { get } = require('../../utils/request.js');
const api = require('../../utils/api.js');

Page({
  data: {
    categories: [],
    subCategories: [],
    currentCategory: '',
    currentSubCategory: '',
    goodsList: [],
    totalGoods: 0,
    sortType: 'default',
    sortOrder: 'asc',
    page: 1,
    pageSize: 20,
    loading: false,
    noMore: false
  },

  onLoad(options) {
    this.options = options;
    this.loadCategories();
  },
  
  onShow() {
    const app = getApp();
    const categoryId = app.globalData.selectedCategoryId;
    const showHotGoods = app.globalData.showHotGoods;
    const showNewGoods = app.globalData.showNewGoods;
    
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
      this.getTabBar().updateCartBadge();
    }
    
    if (showHotGoods) {
      this.setData({
        sortType: 'sales',
        currentCategory: '',
        currentSubCategory: '',
        goodsList: [],
        page: 1,
        noMore: false
      });
      app.globalData.showHotGoods = false;
      this.loadGoods();
    } else if (showNewGoods) {
      this.setData({
        sortType: 'new',
        currentCategory: '',
        currentSubCategory: '',
        goodsList: [],
        page: 1,
        noMore: false
      });
      app.globalData.showNewGoods = false;
      this.loadGoods();
    } else if (categoryId) {
      setTimeout(() => {
        this.selectCategory({ currentTarget: { dataset: { id: categoryId } } });
        app.globalData.selectedCategoryId = null;
      }, 500);
    }
  },

  generateMockGoods(count) {
    const goods = [];
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
      'Premium Coffee Maker',
      'Wireless Charger',
      'Portable Power Bank',
      'Noise Cancelling Earbuds',
      'Fitness Tracker',
      'Smart Home Speaker',
      'Mechanical Keyboard',
      'Gaming Mouse',
      'USB-C Hub',
      'Laptop Stand',
      'Desk Lamp LED',
      'Air Purifier',
      'Humidifier',
      'Electric Toothbrush',
      'Water Bottle'
    ];

    for (let i = 0; i < count; i++) {
      const price = (Math.random() * 100 + 10).toFixed(2);
      const originalPrice = (parseFloat(price) * (1 + Math.random() * 0.5)).toFixed(2);
      goods.push({
        id: i + 1 + (this.data.page - 1) * this.data.pageSize,
        name: productNames[i % productNames.length],
        image: productImages[i % productImages.length],
        price: price,
        originalPrice: originalPrice,
        sales: Math.floor(Math.random() * 1000) + 50,
        stock: Math.floor(Math.random() * 500) + 10
      });
    }
    return goods;
  },

  async loadCategories() {
    try {
      const mockCategories = [
        { 
          id: 1, 
          name: 'Electronics', 
          children: [
            { id: 101, name: 'Phones' },
            { id: 102, name: 'Laptops' },
            { id: 103, name: 'Audio' },
            { id: 104, name: 'Wearables' }
          ]
        },
        { 
          id: 2, 
          name: 'Fashion', 
          children: [
            { id: 201, name: 'Men' },
            { id: 202, name: 'Women' },
            { id: 203, name: 'Accessories' }
          ]
        },
        { 
          id: 3, 
          name: 'Home', 
          children: [
            { id: 301, name: 'Furniture' },
            { id: 302, name: 'Decor' },
            { id: 303, name: 'Kitchen' }
          ]
        },
        { 
          id: 4, 
          name: 'Beauty', 
          children: [
            { id: 401, name: 'Skincare' },
            { id: 402, name: 'Makeup' },
            { id: 403, name: 'Fragrance' }
          ]
        },
        { 
          id: 5, 
          name: 'Sports', 
          children: [
            { id: 501, name: 'Fitness' },
            { id: 502, name: 'Outdoor' },
            { id: 503, name: 'Equipment' }
          ]
        },
        { 
          id: 6, 
          name: 'Books', 
          children: [
            { id: 601, name: 'Fiction' },
            { id: 602, name: 'Non-Fiction' },
            { id: 603, name: 'Education' }
          ]
        }
      ];
      
      const subCategoryIcons = ['phone-o', 'paid', 'logistics', 'star-o', 'clock-o', 'orders-o', 'gem-o', 'location-o'];
      const categoriesWithIcons = mockCategories.map(cat => ({
        ...cat,
        children: (cat.children || []).map((item, index) => ({
          ...item,
          icon: subCategoryIcons[index % subCategoryIcons.length]
        }))
      }));
      
      this.setData({ categories: categoriesWithIcons });
      
      const options = this.options || {};
      if (categoriesWithIcons.length > 0 && !options.categoryId) {
        this.selectCategory({ currentTarget: { dataset: { id: categoriesWithIcons[0].id } } });
      }
    } catch (error) {
      console.error('Load categories failed:', error);
    }
  },

  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    const category = this.data.categories.find(c => c.id === id);
    
    this.setData({
      currentCategory: id,
      subCategories: category?.children || [],
      currentSubCategory: '',
      goodsList: [],
      page: 1,
      noMore: false
    });
    
    this.loadGoods();
  },

  selectSubCategory(e) {
    const id = e.currentTarget.dataset.id;
    
    this.setData({
      currentSubCategory: id,
      goodsList: [],
      page: 1,
      noMore: false
    });
    
    this.loadGoods();
  },

  changeSort(e) {
    const sortType = e.currentTarget.dataset.sort;
    let sortOrder = this.data.sortOrder;
    
    if (sortType === this.data.sortType && sortType === 'price') {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortOrder = 'asc';
    }
    
    this.setData({
      sortType,
      sortOrder,
      goodsList: [],
      page: 1,
      noMore: false
    });
    
    this.loadGoods();
  },

  async loadGoods() {
    return new Promise((resolve) => {
      if (this.data.loading) {
        resolve();
        return;
      }
      
      this.setData({ loading: true });
      
      try {
        setTimeout(() => {
          const list = this.generateMockGoods(this.data.pageSize);
          const goodsList = this.data.page === 1 
            ? list
            : [...this.data.goodsList, ...list];
          
          this.setData({
            goodsList,
            totalGoods: 50,
            loading: false,
            noMore: this.data.page >= 3
          });
          resolve();
        }, 300);
      } catch (error) {
        console.error('Load goods failed:', error);
        this.setData({ 
          loading: false,
          goodsList: [],
          totalGoods: 0,
          noMore: true
        });
        resolve();
      }
    });
  },

  async loadMoreGoods() {
    if (this.data.noMore || this.data.loading) return;
    
    this.setData({ page: this.data.page + 1 });
    await this.loadGoods();
  },

  navigateToSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${id}` });
  },

  onPullDownRefresh() {
    this.setData({
      goodsList: [],
      page: 1,
      noMore: false
    });
    
    this.loadGoods().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
