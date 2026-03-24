const { get } = require('../../utils/request.js');
const api = require('../../utils/api.js');

Page({
  data: {
    goodsId: '',
    goodsInfo: {},
    reviews: [],
    reviewCount: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    noMore: false
  },

  onLoad(options) {
    this.setData({ goodsId: options.goodsId });
    this.loadGoodsInfo();
    this.loadReviews();
  },

  generateMockReviews() {
    const userNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const avatarImages = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
    ];
    const reviewContents = [
      'Great product! The quality is excellent and delivery was fast.',
      'Very satisfied with my purchase. Highly recommend!',
      'Good value for money. The product works as described.',
      'Excellent customer service and product quality.',
      'Awesome! Will definitely buy again.'
    ];
    
    const reviews = [];
    const count = Math.floor(Math.random() * 15) + 5;
    
    for (let i = 0; i < count; i++) {
      const rating = Math.floor(Math.random() * 2) + 4;
      const daysAgo = Math.floor(Math.random() * 30);
      
      reviews.push({
        id: i + 1,
        userId: i + 1,
        userName: userNames[i % userNames.length],
        userAvatar: avatarImages[i % avatarImages.length],
        rating: rating,
        content: reviewContents[i % reviewContents.length],
        images: [],
        isAnonymous: false,
        createTime: this.getRandomDate(daysAgo)
      });
    }
    
    return reviews;
  },

  getRandomDate(daysAgo) {
    const now = new Date();
    now.setDate(now.getDate() - daysAgo);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  async loadGoodsInfo() {
    try {
      const productImages = [
        '/assets/images/product-1.jpg',
        '/assets/images/product-2.jpg',
        '/assets/images/product-3.jpg',
        '/assets/images/product-4.jpg'
      ];
      const productNames = [
        'Wireless Bluetooth Headphones',
        'Smart Watch Series 5',
        'Cotton Casual T-Shirt',
        'Leather Wallet for Men'
      ];
      
      const index = Math.floor(Math.random() * 4);
      const goodsInfo = {
        id: this.data.goodsId,
        image: productImages[index],
        name: productNames[index],
        price: (Math.random() * 100 + 20).toFixed(2)
      };
      
      this.setData({ goodsInfo });
      
      wx.setNavigationBarTitle({
        title: 'Reviews'
      });
    } catch (error) {
      console.error('Load goods info failed:', error);
      this.setData({
        goodsInfo: {
          image: '/assets/images/product-1.jpg',
          name: 'Product',
          price: '0.00'
        }
      });
    }
  },

  async loadReviews() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const allReviews = this.generateMockReviews();
      const pageSize = this.data.pageSize;
      const startIndex = (this.data.page - 1) * pageSize;
      const list = allReviews.slice(startIndex, startIndex + pageSize);
      
      const reviews = this.data.page === 1 
        ? list
        : [...this.data.reviews, ...list];

      this.setData({
        reviews,
        reviewCount: allReviews.length,
        loading: false,
        noMore: startIndex + pageSize >= allReviews.length
      });
    } catch (error) {
      console.error('Load reviews failed:', error);
      this.setData({ 
        loading: false,
        noMore: true
      });
    }
  },

  async loadMoreReviews() {
    if (this.data.noMore || this.data.loading) return;

    this.setData({ page: this.data.page + 1 });
    await this.loadReviews();
  },

  navigateToDetail() {
    wx.navigateBack();
  },

  writeReview() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/goods-review/goods-review?goodsId=${this.data.goodsId}`
    });
  }
});
