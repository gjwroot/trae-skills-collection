class ShareManager {
  constructor() {
    this.shareHistory = [];
    this.loadShareHistory();
  }

  loadShareHistory() {
    try {
      this.shareHistory = wx.getStorageSync('shareHistory') || [];
    } catch (error) {
      console.error('Load share history failed:', error);
    }
  }

  saveShareHistory(shareInfo) {
    try {
      this.shareHistory.unshift({
        ...shareInfo,
        id: Date.now(),
        timestamp: Date.now()
      });

      if (this.shareHistory.length > 50) {
        this.shareHistory = this.shareHistory.slice(0, 50);
      }

      wx.setStorageSync('shareHistory', this.shareHistory);
    } catch (error) {
      console.error('Save share history failed:', error);
    }
  }

  getShareHistory() {
    return this.shareHistory;
  }

  generateShareContent(goodsInfo, options = {}) {
    const { 
      type = 'product',
      customTitle = '',
      customImage = ''
    } = options;

    let title = customTitle || goodsInfo.name || 'Check out this product!';
    let imageUrl = customImage || goodsInfo.image || '/assets/images/product-1.jpg';
    let path = `/pages/goods-detail/goods-detail?id=${goodsInfo.id}`;

    switch (type) {
      case 'product':
        title = `🎉 ${goodsInfo.name || 'Great product'} - Only $${goodsInfo.price || 'XX.XX'}!`;
        break;
      case 'deal':
        title = `🔥 Hot Deal! ${goodsInfo.name || 'Product'} at a great price!`;
        break;
      case 'recommend':
        title = `💝 I recommend ${goodsInfo.name || 'this product'}!`;
        break;
      default:
        break;
    }

    return {
      title,
      path,
      imageUrl
    };
  }

  getShareOptions() {
    return [
      { id: 'wechat', name: 'WeChat Friends', icon: '💬' },
      { id: 'moments', name: 'Moments', icon: '📸' },
      { id: 'qrcode', name: 'QR Code', icon: '📱' },
      { id: 'copy', name: 'Copy Link', icon: '📋' }
    ];
  }

  async handleShareOption(optionId, goodsInfo) {
    switch (optionId) {
      case 'copy':
        return this.copyShareLink(goodsInfo);
      case 'qrcode':
        return this.showQRCode(goodsInfo);
      default:
        return Promise.resolve();
    }
  }

  copyShareLink(goodsInfo) {
    return new Promise((resolve, reject) => {
      try {
        const shareContent = this.generateShareContent(goodsInfo);
        const link = `Check out this product: ${shareContent.title}\n${shareContent.path}`;
        
        wx.setClipboardData({
          data: link,
          success: () => {
            this.saveShareHistory({
              type: 'copy',
              goodsId: goodsInfo.id,
              goodsName: goodsInfo.name
            });
            wx.showToast({
              title: 'Link copied!',
              icon: 'success'
            });
            resolve();
          },
          fail: (error) => {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  showQRCode(goodsInfo) {
    wx.showToast({
      title: 'QR Code feature coming soon',
      icon: 'none'
    });
    return Promise.resolve();
  }

  showShareMenu(goodsInfo) {
    return new Promise((resolve, reject) => {
      const options = this.getShareOptions();
      
      wx.showActionSheet({
        itemList: options.map(opt => `${opt.icon} ${opt.name}`),
        success: (res) => {
          const selectedOption = options[res.tapIndex];
          this.handleShareOption(selectedOption.id, goodsInfo)
            .then(resolve)
            .catch(reject);
        },
        fail: (error) => {
          if (error.errMsg !== 'showActionSheet:fail cancel') {
            reject(error);
          }
        }
      });
    });
  }

  getShareStats() {
    const totalShares = this.shareHistory.length;
    const today = new Date().toDateString();
    const todayShares = this.shareHistory.filter(
      item => new Date(item.timestamp).toDateString() === today
    ).length;

    const shareTypes = {};
    this.shareHistory.forEach(item => {
      shareTypes[item.type] = (shareTypes[item.type] || 0) + 1;
    });

    return {
      total: totalShares,
      today: todayShares,
      byType: shareTypes
    };
  }
}

const shareManager = new ShareManager();

module.exports = shareManager;
