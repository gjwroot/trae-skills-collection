const { get, post } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const historyManager = require('../../utils/history.js');
const recommendManager = require('../../utils/recommend.js');
const wishlistManager = require('../../utils/wishlist.js');
const compareManager = require('../../utils/compare-manager.js');
const qnaManager = require('../../utils/qna.js');

Page({
  data: {
    goodsId: '',
    goodsInfo: {},
    goodsImages: [],
    specList: [],
    selectedSpecs: {},
    selectedSpecsText: '',
    quantity: 1,
    quickQuantities: [1, 2, 3, 5, 10],
    shopInfo: {},
    reviews: [],
    reviewCount: 0,
    qnaCount: 0,
    isFavorite: false,
    isInWishlist: false,
    isInCompare: false,
    showSpecs: false,
    isFollowedShop: false,
    recommendGoods: [],
    browseCount: 0
  },

  onLoad(options) {
    this.setData({ goodsId: options.id });
    this.loadGoodsDetail();
    this.loadReviews();
    this.loadQnACount();
    this.checkFavorite();
    this.checkWishlist();
    this.checkCompare();
    this.checkFollowShop();
  },

  async loadGoodsDetail() {
    try {
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
      
      const price = (Math.random() * 100 + 20).toFixed(2);
      const originalPrice = (parseFloat(price) * 1.3).toFixed(2);
      const index = parseInt(this.data.goodsId) % productImages.length;
      
      const mockGoodsInfo = {
        id: this.data.goodsId,
        name: productNames[index],
        image: productImages[index],
        images: productImages,
        price: price,
        originalPrice: originalPrice,
        sales: Math.floor(Math.random() * 2000) + 100,
        stock: Math.floor(Math.random() * 500) + 50,
        description: 'High quality product with excellent performance. Perfect for daily use. Buy with confidence!'
      };
      
      const mockSpecList = [
        {
          id: 1,
          name: 'Color',
          options: [
            { id: 101, name: 'Black' },
            { id: 102, name: 'White' },
            { id: 103, name: 'Blue' }
          ]
        },
        {
          id: 2,
          name: 'Size',
          options: [
            { id: 201, name: 'S' },
            { id: 202, name: 'M' },
            { id: 203, name: 'L' },
            { id: 204, name: 'XL' }
          ]
        }
      ];
      
      const mockShopInfo = {
        id: 1,
        name: 'Premium Store',
        logo: '/assets/images/product-1.jpg',
        goodsCount: 156,
        followers: 12580
      };

      this.setData({
        goodsInfo: mockGoodsInfo,
        goodsImages: mockGoodsInfo.images,
        specList: mockSpecList,
        shopInfo: mockShopInfo
      });
      
      historyManager.addView(parseInt(this.data.goodsId), {
        name: mockGoodsInfo.name,
        image: mockGoodsInfo.image,
        price: mockGoodsInfo.price
      });
      
      recommendManager.recordBrowse(parseInt(this.data.goodsId), 'electronics');
      
      this.incrementBrowseCount();
      this.loadRecommendGoods();
      this.checkFollowShop();

      wx.setNavigationBarTitle({
        title: mockGoodsInfo.name || 'Product Detail'
      });
    } catch (error) {
      console.error('Load goods detail failed:', error);
    }
  },

  async loadReviews() {
    try {
      const savedReviews = wx.getStorageSync('mockReviews') || [];
      const goodsReviews = savedReviews.filter(item => item.goodsId == this.data.goodsId);
      
      const mockReviews = [
        {
          id: 1,
          userId: 1,
          userName: 'John D.',
          avatar: '/assets/images/product-1.jpg',
          rating: 5,
          content: 'Excellent product! Very happy with my purchase.',
          images: ['/assets/images/product-1.jpg'],
          time: '2024-01-15'
        },
        {
          id: 2,
          userId: 2,
          userName: 'Sarah M.',
          avatar: '/assets/images/product-2.jpg',
          rating: 4,
          content: 'Good quality, shipping was fast.',
          images: [],
          time: '2024-01-10'
        },
        {
          id: 3,
          userId: 3,
          userName: 'Mike R.',
          avatar: '/assets/images/product-3.jpg',
          rating: 5,
          content: 'Best purchase I made this year! Highly recommend.',
          images: ['/assets/images/product-3.jpg', '/assets/images/product-4.jpg'],
          time: '2024-01-05'
        }
      ];

      const userReviews = goodsReviews.map(item => ({
        id: item.id,
        userId: item.userId || 0,
        userName: item.isAnonymous ? 'Anonymous' : 'User',
        avatar: '/assets/images/product-1.jpg',
        rating: item.rating,
        content: item.content,
        images: item.images || [],
        time: new Date(item.createTime).toLocaleDateString()
      }));

      const allReviews = [...userReviews, ...mockReviews].slice(0, 5);

      this.setData({
        reviews: allReviews,
        reviewCount: allReviews.length + 123
      });
    } catch (error) {
      console.error('Load reviews failed:', error);
    }
  },

  async checkFavorite() {
    try {
      const favorites = wx.getStorageSync('mockFavorites') || [];
      const isFavorite = favorites.includes(parseInt(this.data.goodsId));
      this.setData({ isFavorite });
    } catch (error) {
      console.error('Check favorite failed:', error);
    }
  },

  checkWishlist() {
    try {
      const isInWishlist = wishlistManager.isInWishlist(parseInt(this.data.goodsId));
      this.setData({ isInWishlist });
    } catch (error) {
      console.error('Check wishlist failed:', error);
    }
  },

  checkCompare() {
    try {
      const isInCompare = compareManager.isInCompare(parseInt(this.data.goodsId));
      this.setData({ isInCompare });
    } catch (error) {
      console.error('Check compare failed:', error);
    }
  },

  toggleCompare() {
    try {
      if (this.data.isInCompare) {
        const result = compareManager.removeFromCompare(parseInt(this.data.goodsId));
        if (result.success) {
          util.showSuccess(result.message);
        }
      } else {
        const result = compareManager.addToCompare({
          ...this.data.goodsInfo,
          id: parseInt(this.data.goodsId)
        });
        if (result.success) {
          util.showSuccess(result.message);
        } else {
          util.showToast(result.message);
          return;
        }
      }
      this.setData({ isInCompare: !this.data.isInCompare });
    } catch (error) {
      console.error('Toggle compare failed:', error);
    }
  },

  toggleWishlist() {
    try {
      const result = wishlistManager.toggleWishlist(this.data.goodsInfo);
      if (result.success) {
        util.showSuccess(result.message);
      } else {
        util.showToast(result.message);
      }
      this.setData({ isInWishlist: !this.data.isInWishlist });
    } catch (error) {
      console.error('Toggle wishlist failed:', error);
    }
  },

  checkFollowShop() {
    const followedShops = wx.getStorageSync('followedShops') || [];
    const shopId = this.data.shopInfo.id;
    if (shopId) {
      this.setData({ isFollowedShop: followedShops.includes(shopId) });
    }
  },

  showSpecsPopup() {
    this.setData({ showSpecs: true });
  },

  hideSpecsPopup() {
    this.setData({ showSpecs: false });
  },

  preventBubble() {
    // Prevent event bubbling
  },

  selectSpec(e) {
    const { specId, optionId } = e.currentTarget.dataset;
    const selectedSpecs = { ...this.data.selectedSpecs };
    selectedSpecs[specId] = optionId;

    this.setData({ selectedSpecs });
    this.updateSpecsText();
  },

  updateSpecsText() {
    const { selectedSpecs, specList } = this.data;
    const texts = [];

    specList.forEach(spec => {
      if (selectedSpecs[spec.id]) {
        const option = spec.options.find(o => o.id === selectedSpecs[spec.id]);
        if (option) {
          texts.push(option.name);
        }
      }
    });

    this.setData({
      selectedSpecsText: texts.join(', ')
    });
  },

  decreaseQuantity() {
    if (this.data.quantity <= 1) return;
    this.setData({ quantity: this.data.quantity - 1 });
  },

  increaseQuantity() {
    if (this.data.quantity >= this.data.goodsInfo.stock) return;
    this.setData({ quantity: this.data.quantity + 1 });
  },

  selectQuantity(e) {
    const quantity = e.currentTarget.dataset.quantity;
    if (quantity > this.data.goodsInfo.stock) {
      util.showToast(`Only ${this.data.goodsInfo.stock} left in stock`);
      return;
    }
    this.setData({ quantity });
  },

  confirmSpecs() {
    const { specList, selectedSpecs } = this.data;

    if (specList.length > 0) {
      const allSelected = specList.every(spec => selectedSpecs[spec.id]);
      if (!allSelected) {
        util.showToast('Please select all specifications');
        return;
      }
    }

    this.hideSpecsPopup();
  },

  addToCart() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }

    if (this.data.specList.length > 0) {
      const allSelected = this.data.specList.every(
        spec => this.data.selectedSpecs[spec.id]
      );
      if (!allSelected) {
        this.showSpecsPopup();
        return;
      }
    }
    
    this.doAddToCart();
  },

  async confirmAddToCart() {
    const { specList, selectedSpecs } = this.data;

    if (specList.length > 0) {
      const allSelected = specList.every(spec => selectedSpecs[spec.id]);
      if (!allSelected) {
        util.showToast('Please select all specifications');
        return;
      }
    }

    this.doAddToCart();
  },

  async doAddToCart() {
    try {
      wx.showLoading({ title: 'Adding...' });
      
      setTimeout(() => {
        wx.hideLoading();
        
        let cartList = wx.getStorageSync('mockCartList') || [];
        const specId = Object.values(this.data.selectedSpecs).join(',');
        
        const existingItem = cartList.find(item => 
          item.goodsId == this.data.goodsId && item.specId === specId
        );
        
        if (existingItem) {
          existingItem.quantity += this.data.quantity;
        } else {
          const newItem = {
            id: Date.now(),
            goodsId: this.data.goodsId,
            specId: specId,
            name: this.data.goodsInfo.name,
            image: this.data.goodsInfo.image,
            price: this.data.goodsInfo.price,
            quantity: this.data.quantity,
            spec: this.data.selectedSpecsText || 'Default',
            selected: false
          };
          cartList.unshift(newItem);
        }
        
        wx.setStorageSync('mockCartList', cartList);
        
        util.showSuccess('Added to cart');
        
        this.completeTask('addcart');
        
        this.hideSpecsPopup();
        
        this.updateCartCount();
      }, 500);
    } catch (error) {
      wx.hideLoading();
      console.error('Add to cart failed:', error);
      util.showToast('Add to cart failed');
    }
  },
  
  async updateCartCount() {
    try {
      const app = getApp();
      await app.loadCartCount();
      
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().updateCartBadge();
      }
    } catch (error) {
      console.error('Update cart count failed:', error);
    }
  },

  buyNow() {
    if (this.data.specList.length > 0) {
      const allSelected = this.data.specList.every(
        spec => this.data.selectedSpecs[spec.id]
      );
      if (!allSelected) {
        this.showSpecsPopup();
        return;
      }
    }

    const orderData = {
      items: [{
        id: Date.now(),
        goodsId: this.data.goodsId,
        specId: Object.values(this.data.selectedSpecs).join(','),
        quantity: this.data.quantity,
        name: this.data.goodsInfo.name,
        image: this.data.goodsInfo.image,
        price: this.data.goodsInfo.price,
        spec: this.data.selectedSpecsText || 'Default'
      }]
    };

    wx.setStorageSync('checkoutData', orderData);
    wx.navigateTo({ url: '/pages/checkout/checkout' });
  },

  async toggleFavorite() {
    try {
      let favorites = wx.getStorageSync('mockFavorites') || [];
      const goodsId = parseInt(this.data.goodsId);
      const index = favorites.indexOf(goodsId);
      
      if (index > -1) {
        favorites.splice(index, 1);
        util.showSuccess('Removed from favorites');
      } else {
        favorites.push(goodsId);
        util.showSuccess('Added to favorites');
      }
      
      wx.setStorageSync('mockFavorites', favorites);
      this.setData({ isFavorite: !this.data.isFavorite });
    } catch (error) {
      console.error('Toggle favorite failed:', error);
    }
  },

  navigateToShop() {
    const app = getApp();
    app.globalData.selectedCategoryId = null;
    wx.switchTab({ url: '/pages/category/category' });
  },

  navigateToChat() {
    wx.navigateTo({ url: '/pages/customer-service/customer-service' });
  },

  viewAllReviews() {
    wx.navigateTo({
      url: `/pages/reviews/reviews?goodsId=${this.data.goodsId}`
    });
  },

  loadQnACount() {
    try {
      const qnaList = qnaManager.getQnAList(parseInt(this.data.goodsId));
      this.setData({ qnaCount: qnaList.length });
    } catch (error) {
      console.error('Load Q&A count failed:', error);
    }
  },

  navigateToQnA() {
    wx.navigateTo({
      url: `/pages/qna/qna?id=${this.data.goodsId}&name=${encodeURIComponent(this.data.goodsInfo.name)}`
    });
  },

  navigateToCouponCenter() {
    wx.navigateTo({ url: '/pages/coupon-center/coupon-center' });
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
  },

  followShop() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    
    const followedShops = wx.getStorageSync('followedShops') || [];
    const shopId = this.data.shopInfo.id;
    const isFollowed = followedShops.includes(shopId);
    
    if (isFollowed) {
      const newFollowedShops = followedShops.filter(id => id !== shopId);
      wx.setStorageSync('followedShops', newFollowedShops);
      this.setData({ isFollowedShop: false });
      util.showSuccess('Unfollowed');
    } else {
      followedShops.push(shopId);
      wx.setStorageSync('followedShops', followedShops);
      this.setData({ isFollowedShop: true });
      util.showSuccess('Followed');
    }
  },

  onShareAppMessage() {
    this.completeTask('share');
    return {
      title: this.data.goodsInfo.name || 'Check out this product!',
      path: `/pages/goods-detail/goods-detail?id=${this.data.goodsId}`,
      imageUrl: this.data.goodsInfo.image || '/assets/images/product-1.jpg'
    };
  },

  previewImage(e) {
    const { current } = e.currentTarget.dataset;
    const urls = this.data.goodsImages.map(url => url || '/assets/images/product-1.jpg');
    
    wx.previewImage({
      current: urls[current],
      urls: urls
    });
  },

  onShareTimeline() {
    this.completeTask('share');
    return {
      title: this.data.goodsInfo.name || 'Check out this product!',
      imageUrl: this.data.goodsInfo.image || '/assets/images/product-1.jpg'
    };
  },

  loadRecommendGoods() {
    try {
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
        'Mechanical Keyboard',
        'Wireless Mouse',
        'USB-C Hub',
        'Portable Charger',
        'Noise Cancelling Earbuds',
        'Smart Home Hub'
      ];
      const categories = ['electronics', 'fashion', 'home', 'sports'];

      let productList = [];
      for (let i = 1; i <= 20; i++) {
        const price = (Math.random() * 100 + 20).toFixed(2);
        productList.push({
          id: i,
          name: productNames[(i - 1) % productNames.length],
          image: productImages[(i - 1) % productImages.length],
          price: price,
          originalPrice: (parseFloat(price) * 1.3).toFixed(2),
          sales: Math.floor(Math.random() * 1000) + 50,
          category: categories[(i - 1) % categories.length],
          tags: [categories[(i - 1) % categories.length]]
        });
      }

      const excludeIds = [parseInt(this.data.goodsId)];
      const recommendations = recommendManager.getRecommendations(productList, {
        limit: 10,
        excludeProductIds: excludeIds,
        strategy: 'hybrid'
      });

      const similarProducts = recommendManager.getSimilarProducts(
        parseInt(this.data.goodsId),
        productList,
        4
      );

      const displayRecommendations = similarProducts.length > 0 ? similarProducts : recommendations.slice(0, 4);

      this.setData({ 
        recommendGoods: displayRecommendations.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price
        }))
      });
    } catch (error) {
      console.error('Load recommend goods failed:', error);
      const recommendGoods = historyManager.getRecommendations([parseInt(this.data.goodsId)]);
      this.setData({ recommendGoods });
    }
  },

  navigateToRecommendDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods-detail/goods-detail?id=${id}`
    });
  },

  incrementBrowseCount() {
    const today = new Date().toDateString();
    let browseData = wx.getStorageSync('browseData') || { date: '', count: 0 };
    
    if (browseData.date !== today) {
      browseData = { date: today, count: 0 };
    }
    
    browseData.count++;
    
    wx.setStorageSync('browseData', browseData);
    
    if (browseData.count >= 5) {
      this.completeTask('browse');
    }
    
    this.setData({ browseCount: browseData.count });
  },

  completeTask(taskId) {
    const completedTasks = wx.getStorageSync('completedTasks') || { date: new Date().toDateString(), tasks: {} };
    
    if (completedTasks.date !== new Date().toDateString()) {
      completedTasks.date = new Date().toDateString();
      completedTasks.tasks = {};
    }
    
    if (completedTasks.tasks[taskId]) {
      return;
    }
    
    completedTasks.tasks = completedTasks.tasks || {};
    completedTasks.tasks[taskId] = true;
    wx.setStorageSync('completedTasks', completedTasks);
    
    const tasks = {
      checkin: { points: 10, name: 'Daily Check-in' },
      browse: { points: 15, name: 'Browse 5 products' },
      addcart: { points: 20, name: 'Add to cart' },
      share: { points: 25, name: 'Share a product' }
    };
    
    const task = tasks[taskId];
    if (task) {
      this.addPoints(task.points, task.name);
    }
  },

  addPoints(points, reason) {
    let userInfo = wx.getStorageSync('userInfo') || {};
    userInfo.points = (userInfo.points || 0) + points;
    wx.setStorageSync('userInfo', userInfo);
    
    let historyList = wx.getStorageSync('pointsHistory') || [];
    historyList.unshift({
      id: Date.now(),
      title: reason,
      time: new Date().toLocaleString(),
      points: points,
      type: 'earn'
    });
    
    if (historyList.length > 50) {
      historyList = historyList.slice(0, 50);
    }
    
    wx.setStorageSync('pointsHistory', historyList);
  }
});
