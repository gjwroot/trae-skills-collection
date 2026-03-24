const { get, post } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    orderId: '',
    goodsList: [],
    rating: 5,
    content: '',
    images: [],
    isAnonymous: false,
    ratingTexts: ['', 'Terrible', 'Bad', 'Average', 'Good', 'Excellent']
  },

  onLoad(options) {
    this.setData({ orderId: options.orderId });
    this.loadOrderGoods();
  },

  generateMockOrderGoods() {
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
    
    const goodsCount = Math.floor(Math.random() * 2) + 1;
    const goodsList = [];
    
    for (let i = 0; i < goodsCount; i++) {
      goodsList.push({
        id: i + 1,
        name: productNames[i % productNames.length],
        image: productImages[i % productImages.length],
        price: (Math.random() * 100 + 20).toFixed(2),
        quantity: 1,
        spec: 'Color: Black, Size: M'
      });
    }
    
    return goodsList;
  },

  async loadOrderGoods() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const goodsList = this.generateMockOrderGoods();
      this.setData({ goodsList });
    } catch (error) {
      console.error('Load order goods failed:', error);
    }
  },

  get ratingText() {
    return this.data.ratingTexts[this.data.rating];
  },

  setRating(e) {
    const rating = e.currentTarget.dataset.rating;
    this.setData({ rating });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  addImage() {
    wx.chooseMedia({
      count: 9 - this.data.images.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          images: [...this.data.images, ...newImages]
        });
      }
    });
  },

  removeImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ images });
  },

  toggleAnonymous() {
    this.setData({ isAnonymous: !this.data.isAnonymous });
  },

  async submitReview() {
    if (!this.data.content.trim()) {
      util.showToast('Please enter review content');
      return;
    }

    try {
      wx.showLoading({ title: 'Submitting...' });

      await new Promise(resolve => setTimeout(resolve, 800));

      wx.hideLoading();
      util.showSuccess('Review submitted');

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      console.error('Submit review failed:', error);
      util.showToast('Submit failed');
    }
  },

  uploadImages() {
    return new Promise((resolve) => {
      const uploadPromises = this.data.images.map(image => {
        return new Promise((res, rej) => {
          wx.uploadFile({
            url: api.upload.image,
            filePath: image,
            name: 'file',
            success: (response) => {
              const data = JSON.parse(response.data);
              if (data.code === 0) {
                res(data.url);
              } else {
                rej(new Error('Upload failed'));
              }
            },
            fail: rej
          });
        });
      });

      Promise.all(uploadPromises).then(resolve).catch(() => resolve([]));
    });
  }
});
