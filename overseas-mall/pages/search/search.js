const { get, post } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    keyword: '',
    hotKeywords: [],
    searchHistory: [],
    hasSearched: false,
    goodsList: [],
    totalResults: 0,
    sortType: 'default',
    sortOrder: 'asc',
    page: 1,
    pageSize: 20,
    loading: false,
    noMore: false,
    showSuggestions: false,
    suggestions: [],
    allProducts: [],
    showFilter: false,
    filters: {
      priceRange: null,
      isNew: false,
      isHot: false,
      hasDiscount: false
    }
  },

  onLoad(options) {
    this.loadHotKeywords();
    this.loadSearchHistory();
    this.loadAllProducts();

    if (options.keyword) {
      this.setData({ keyword: options.keyword });
      this.onSearch();
    }

    if (options.type === 'hot') {
      this.setData({ sortType: 'sales' });
    } else if (options.type === 'new') {
      this.setData({ sortType: 'new' });
    }
  },

  loadAllProducts() {
    const allProducts = this.getMockProductList();
    this.setData({ allProducts });
  },

  async loadHotKeywords() {
    try {
      const mockHotKeywords = [
        'Wireless Headphones',
        'Smart Watch',
        'Bluetooth Speaker',
        'Phone Case',
        'Laptop Stand',
        'Yoga Mat',
        'Coffee Maker',
        'Air Purifier'
      ];
      this.setData({ hotKeywords: mockHotKeywords });
    } catch (error) {
      console.error('Load hot keywords failed:', error);
    }
  },

  getMockProductList() {
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
      'Smartphone Case',
      'Bluetooth Speaker',
      'Laptop Stand',
      'Desk Lamp',
      'Water Bottle'
    ];

    return productNames.map((name, i) => ({
      id: i + 1,
      name: name,
      image: productImages[i % productImages.length],
      price: (Math.random() * 100 + 10).toFixed(2),
      originalPrice: ((Math.random() * 100 + 10) * (1 + Math.random() * 0.5)).toFixed(2),
      sales: Math.floor(Math.random() * 1000) + 50,
      isNew: Math.random() > 0.7,
      isHot: Math.random() > 0.6
    }));
  },

  filterGoodsByKeyword(goodsList, keyword) {
    if (!keyword || !keyword.trim()) {
      return goodsList;
    }
    
    const lowerKeyword = keyword.toLowerCase();
    return goodsList.filter(item => 
      item.name.toLowerCase().includes(lowerKeyword)
    );
  },

  applyFilters(goodsList) {
    const { filters } = this.data;
    let filteredList = [...goodsList];

    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      filteredList = filteredList.filter(item => {
        const price = parseFloat(item.price);
        return price >= minPrice && price <= maxPrice;
      });
    }

    if (filters.isNew) {
      filteredList = filteredList.filter(item => item.isNew);
    }

    if (filters.isHot) {
      filteredList = filteredList.filter(item => item.isHot);
    }

    if (filters.hasDiscount) {
      filteredList = filteredList.filter(item => {
        const originalPrice = parseFloat(item.originalPrice);
        const price = parseFloat(item.price);
        return originalPrice > price;
      });
    }

    return filteredList;
  },

  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  resetFilters() {
    this.setData({
      filters: {
        priceRange: null,
        isNew: false,
        isHot: false,
        hasDiscount: false
      },
      showFilter: false,
      goodsList: [],
      page: 1,
      noMore: false
    });
    this.loadGoods();
  },

  selectPriceRange(e) {
    const range = e.currentTarget.dataset.range;
    const priceRange = range ? JSON.parse(range) : null;
    this.setData({
      'filters.priceRange': priceRange
    });
  },

  toggleFilterOption(e) {
    const key = e.currentTarget.dataset.key;
    const currentValue = this.data.filters[key];
    this.setData({
      [`filters.${key}`]: !currentValue
    });
  },

  applyFilterAndSearch() {
    this.setData({
      showFilter: false,
      goodsList: [],
      page: 1,
      noMore: false
    });
    this.loadGoods();
  },

  sortGoods(goodsList, sortType, sortOrder) {
    const sortedList = [...goodsList];
    
    switch (sortType) {
      case 'sales':
        sortedList.sort((a, b) => b.sales - a.sales);
        break;
      case 'price':
        sortedList.sort((a, b) => {
          const priceA = parseFloat(a.price);
          const priceB = parseFloat(b.price);
          return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
        break;
      case 'new':
        sortedList.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        sortedList.sort((a, b) => {
          const scoreA = (a.isHot ? 1000 : 0) + a.sales;
          const scoreB = (b.isHot ? 1000 : 0) + b.sales;
          return scoreB - scoreA;
        });
    }
    
    return sortedList;
  },

  loadSearchHistory() {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({ searchHistory: history });
  },

  onKeywordChange(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    
    if (keyword && keyword.trim().length > 0) {
      this.showSearchSuggestions(keyword);
    } else {
      this.setData({ 
        showSuggestions: false, 
        suggestions: [],
        hasSearched: false,
        goodsList: []
      });
    }
  },

  showSearchSuggestions(keyword) {
    const allProducts = this.data.allProducts;
    const filtered = this.filterGoodsByKeyword(allProducts, keyword);
    const suggestions = filtered.slice(0, 5).map(item => item.name);
    
    this.setData({ 
      suggestions, 
      showSuggestions: suggestions.length > 0 
    });
  },

  selectSuggestion(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ 
      keyword, 
      showSuggestions: false 
    });
    this.onSearch();
  },

  onClear() {
    this.setData({
      keyword: '',
      hasSearched: false,
      goodsList: [],
      showSuggestions: false,
      suggestions: []
    });
  },

  async onSearch() {
    if (!this.data.keyword.trim()) {
      util.showToast('Please enter keywords');
      return;
    }

    this.saveSearchHistory(this.data.keyword);

    this.setData({
      hasSearched: true,
      showSuggestions: false,
      goodsList: [],
      page: 1,
      noMore: false
    });

    await this.loadGoods();
  },

  saveSearchHistory(keyword) {
    let history = wx.getStorageSync('searchHistory') || [];
    history = history.filter(item => item !== keyword);
    history.unshift(keyword);
    history = history.slice(0, 10);

    wx.setStorageSync('searchHistory', history);
    this.setData({ searchHistory: history });
  },

  searchByTag(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.onSearch();
  },

  clearHistory() {
    wx.removeStorageSync('searchHistory');
    this.setData({ searchHistory: [] });
    util.showSuccess('Cleared');
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
        const allProducts = this.data.allProducts;
        let filteredGoods = this.filterGoodsByKeyword(allProducts, this.data.keyword);
        filteredGoods = this.applyFilters(filteredGoods);
        filteredGoods = this.sortGoods(filteredGoods, this.data.sortType, this.data.sortOrder);
        
        const startIndex = (this.data.page - 1) * this.data.pageSize;
        const endIndex = startIndex + this.data.pageSize;
        const pageGoods = filteredGoods.slice(startIndex, endIndex);
        
        const goodsList = this.data.page === 1 
          ? pageGoods
          : [...this.data.goodsList, ...pageGoods];

        this.setData({
          goodsList,
          totalResults: filteredGoods.length,
          loading: false,
          noMore: endIndex >= filteredGoods.length
        });
        resolve();
      } catch (error) {
        console.error('Search goods failed:', error);
        this.setData({ 
          loading: false,
          goodsList: [],
          totalResults: 0,
          noMore: true
        });
        resolve();
      }
    });
  },

  async loadMore() {
    if (this.data.noMore || this.data.loading) return;

    this.setData({ page: this.data.page + 1 });
    await this.loadGoods();
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${id}` });
  },

  onPullDownRefresh() {
    if (this.data.hasSearched) {
      this.setData({ 
        goodsList: [],
        page: 1,
        noMore: false
      });
      this.loadGoods().then(() => {
        wx.stopPullDownRefresh();
      });
    } else {
      wx.stopPullDownRefresh();
    }
  }
});
