const { get } = require('../../utils/request.js');
const api = require('../../utils/api.js');

Page({
  data: {
    promotionInfo: null,
    goodsList: [],
    page: 1,
    pageSize: 20,
    loading: false,
    noMore: false
  },

  onLoad(options) {
    const id = options.id;
    const title = options.title;
    
    if (title) {
      wx.setNavigationBarTitle({ title });
    }
    
    this.setData({ promotionId: id });
    this.loadPromotionInfo();
    this.loadGoodsList();
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadPromotionInfo(),
      this.loadGoodsList(true)
    ]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (!this.data.loading && !this.data.noMore) {
      this.loadGoodsList();
    }
  },

  async loadPromotionInfo() {
    try {
      const mockPromotions = [
        {
          id: 1,
          title: 'Summer Sale',
          subtitle: 'Up to 50% OFF',
          image: '/assets/images/banner-1.jpg',
          description: 'Get ready for summer with amazing discounts on all your favorite products!'
        },
        {
          id: 2,
          title: 'Flash Deals',
          subtitle: 'Limited Time Only',
          image: '/assets/images/banner-2.jpg',
          description: 'Don\'t miss out on these incredible flash deals!'
        },
        {
          id: 3,
          title: 'New Arrivals',
          subtitle: 'Check out our latest products',
          image: '/assets/images/banner-3.jpg',
          description: 'Discover the newest additions to our collection!'
        }
      ];
      
      const id = this.data.promotionId;
      const promotion = mockPromotions.find(p => p.id == id) || mockPromotions[0];
      
      this.setData({ promotionInfo: promotion });
      
      if (promotion.title) {
        wx.setNavigationBarTitle({ title: promotion.title });
      }
    } catch (error) {
      console.error('Load promotion info failed:', error);
    }
  },

  async loadGoodsList(isRefresh = false) {
    if (this.data.loading) return;
    
    const page = isRefresh ? 1 : this.data.page;
    
    this.setData({ loading: true });
    
    try {
      const res = await get(api.goods.list, {
        page,
        pageSize: this.data.pageSize,
        sort: 'sales'
      });
      
      const newList = res.list || [];
      const goodsList = isRefresh ? newList : [...this.data.goodsList, ...newList];
      
      this.setData({
        goodsList,
        page: page + 1,
        noMore: newList.length < this.data.pageSize,
        loading: false
      });
    } catch (error) {
      console.error('Load goods list failed:', error);
      this.setData({ loading: false });
    }
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${id}` });
  }
});
