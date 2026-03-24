const util = require('../../utils/util.js');

Page({
  data: {
    goodsId: '',
    orderId: '',
    goodsInfo: {},
    rating: 0,
    ratingText: 'Please rate',
    ratingTexts: ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    reviewTags: [
      'High quality',
      'Great value',
      'Fast delivery',
      'Good packaging',
      'As described',
      'Recommend'
    ],
    selectedTags: [],
    reviewContent: '',
    uploadImages: [],
    isAnonymous: false,
    canSubmit: false
  },

  onLoad(options) {
    this.setData({ 
      goodsId: options.id,
      orderId: options.orderId || ''
    });
    this.loadGoodsInfo();
  },

  async loadGoodsInfo() {
    try {
      const productImages = [
        '/assets/images/product-1.jpg',
        '/assets/images/product-2.jpg',
        '/assets/images/product-3.jpg'
      ];
      const productNames = [
        'Wireless Bluetooth Headphones',
        'Smart Watch Series 5',
        'Cotton Casual T-Shirt'
      ];
      
      const index = parseInt(this.data.goodsId) % productImages.length;
      const price = (Math.random() * 100 + 20).toFixed(2);
      
      this.setData({
        goodsInfo: {
          id: this.data.goodsId,
          name: productNames[index],
          image: productImages[index],
          price: price
        }
      });
    } catch (error) {
      console.error('Load goods info failed:', error);
    }
  },

  selectRating(e) {
    const rating = e.currentTarget.dataset.rating;
    this.setData({
      rating,
      ratingText: this.data.ratingTexts[rating]
    });
    this.checkCanSubmit();
  },

  toggleTag(e) {
    const index = e.currentTarget.dataset.index;
    let selectedTags = [...this.data.selectedTags];
    
    const tagIndex = selectedTags.indexOf(index);
    if (tagIndex > -1) {
      selectedTags.splice(tagIndex, 1);
    } else {
      if (selectedTags.length < 3) {
        selectedTags.push(index);
      } else {
        util.showToast('Maximum 3 tags');
      }
    }
    
    this.setData({ selectedTags });
  },

  onContentInput(e) {
    this.setData({ reviewContent: e.detail.value });
    this.checkCanSubmit();
  },

  chooseImage() {
    const remainingCount = 6 - this.data.uploadImages.length;
    
    wx.chooseImage({
      count: remainingCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = [...this.data.uploadImages, ...res.tempFilePaths];
        this.setData({ uploadImages: newImages });
      }
    });
  },

  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.uploadImages[index],
      urls: this.data.uploadImages
    });
  },

  deleteImage(e) {
    e.stopPropagation();
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.uploadImages];
    images.splice(index, 1);
    this.setData({ uploadImages: images });
  },

  toggleAnonymous() {
    this.setData({ isAnonymous: !this.data.isAnonymous });
  },

  checkCanSubmit() {
    const { rating, reviewContent } = this.data;
    const canSubmit = rating > 0 && reviewContent.trim().length >= 10;
    this.setData({ canSubmit });
  },

  async submitReview() {
    if (!this.data.canSubmit) return;

    try {
      wx.showLoading({ title: 'Submitting...' });

      setTimeout(() => {
        wx.hideLoading();

        const reviewData = {
          id: Date.now(),
          goodsId: this.data.goodsId,
          orderId: this.data.orderId,
          goodsInfo: this.data.goodsInfo,
          rating: this.data.rating,
          tags: this.data.selectedTags.map(i => this.data.reviewTags[i]),
          content: this.data.reviewContent,
          images: this.data.uploadImages,
          isAnonymous: this.data.isAnonymous,
          status: 'pending',
          createTime: new Date().toISOString()
        };

        let reviews = wx.getStorageSync('mockReviews') || [];
        reviews.unshift(reviewData);
        wx.setStorageSync('mockReviews', reviews);

        if (this.data.orderId) {
          let orders = wx.getStorageSync('mockOrders') || [];
          orders = orders.map(item => {
            if (item.id == this.data.orderId) {
              return { ...item, isReviewed: true };
            }
            return item;
          });
          wx.setStorageSync('mockOrders', orders);
        }

        util.showSuccess('Review submitted');
        
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }, 1000);
    } catch (error) {
      wx.hideLoading();
      console.error('Submit review failed:', error);
      util.showToast('Submit failed');
    }
  }
});
