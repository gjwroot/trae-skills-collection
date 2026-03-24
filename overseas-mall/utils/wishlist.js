class WishlistManager {
  constructor() {
    this.wishlistKey = 'wishlist';
    this.priceAlertsKey = 'price_alerts';
    this.maxWishlistSize = 100;
  }

  getWishlist() {
    try {
      return wx.getStorageSync(this.wishlistKey) || [];
    } catch (error) {
      console.error('Get wishlist failed:', error);
      return [];
    }
  }

  saveWishlist(wishlist) {
    try {
      wx.setStorageSync(this.wishlistKey, wishlist);
      return true;
    } catch (error) {
      console.error('Save wishlist failed:', error);
      return false;
    }
  }

  addToWishlist(goods) {
    try {
      let wishlist = this.getWishlist();
      
      const existingIndex = wishlist.findIndex(item => item.id === goods.id);
      if (existingIndex !== -1) {
        return { success: false, message: '商品已在心愿单中' };
      }

      if (wishlist.length >= this.maxWishlistSize) {
        return { success: false, message: '心愿单已满，请先删除一些商品' };
      }

      const wishlistItem = {
        id: goods.id,
        name: goods.name,
        image: goods.image,
        price: goods.price,
        originalPrice: goods.originalPrice,
        addedAt: Date.now(),
        category: goods.category || '',
        tags: goods.tags || []
      };

      wishlist.unshift(wishlistItem);
      this.saveWishlist(wishlist);

      return { success: true, message: '已添加到心愿单' };
    } catch (error) {
      console.error('Add to wishlist failed:', error);
      return { success: false, message: '添加失败' };
    }
  }

  removeFromWishlist(goodsId) {
    try {
      let wishlist = this.getWishlist();
      const initialLength = wishlist.length;
      wishlist = wishlist.filter(item => item.id !== goodsId);
      
      if (wishlist.length < initialLength) {
        this.saveWishlist(wishlist);
        return { success: true, message: '已从心愿单移除' };
      }
      
      return { success: false, message: '商品不在心愿单中' };
    } catch (error) {
      console.error('Remove from wishlist failed:', error);
      return { success: false, message: '移除失败' };
    }
  }

  isInWishlist(goodsId) {
    try {
      const wishlist = this.getWishlist();
      return wishlist.some(item => item.id === goodsId);
    } catch (error) {
      console.error('Check wishlist failed:', error);
      return false;
    }
  }

  clearWishlist() {
    try {
      wx.removeStorageSync(this.wishlistKey);
      return { success: true, message: '心愿单已清空' };
    } catch (error) {
      console.error('Clear wishlist failed:', error);
      return { success: false, message: '清空失败' };
    }
  }

  getWishlistCount() {
    try {
      return this.getWishlist().length;
    } catch (error) {
      console.error('Get wishlist count failed:', error);
      return 0;
    }
  }

  toggleWishlist(goods) {
    if (this.isInWishlist(goods.id)) {
      return this.removeFromWishlist(goods.id);
    } else {
      return this.addToWishlist(goods);
    }
  }

  getPriceAlerts() {
    try {
      return wx.getStorageSync(this.priceAlertsKey) || [];
    } catch (error) {
      console.error('Get price alerts failed:', error);
      return [];
    }
  }

  savePriceAlerts(alerts) {
    try {
      wx.setStorageSync(this.priceAlertsKey, alerts);
      return true;
    } catch (error) {
      console.error('Save price alerts failed:', error);
      return false;
    }
  }

  addPriceAlert(goods, targetPrice) {
    try {
      let alerts = this.getPriceAlerts();
      
      const existingIndex = alerts.findIndex(item => item.goodsId === goods.id);
      if (existingIndex !== -1) {
        alerts[existingIndex].targetPrice = targetPrice;
        alerts[existingIndex].updatedAt = Date.now();
        this.savePriceAlerts(alerts);
        return { success: true, message: '价格提醒已更新' };
      }

      const alert = {
        id: 'alert_' + Date.now(),
        goodsId: goods.id,
        goodsName: goods.name,
        goodsImage: goods.image,
        currentPrice: goods.price,
        targetPrice: targetPrice,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        active: true
      };

      alerts.unshift(alert);
      this.savePriceAlerts(alerts);

      return { success: true, message: '价格提醒已设置' };
    } catch (error) {
      console.error('Add price alert failed:', error);
      return { success: false, message: '设置失败' };
    }
  }

  removePriceAlert(alertId) {
    try {
      let alerts = this.getPriceAlerts();
      const initialLength = alerts.length;
      alerts = alerts.filter(item => item.id !== alertId);
      
      if (alerts.length < initialLength) {
        this.savePriceAlerts(alerts);
        return { success: true, message: '价格提醒已取消' };
      }
      
      return { success: false, message: '提醒不存在' };
    } catch (error) {
      console.error('Remove price alert failed:', error);
      return { success: false, message: '取消失败' };
    }
  }

  checkPriceAlerts(currentPrices) {
    try {
      const alerts = this.getPriceAlerts();
      const triggeredAlerts = [];

      alerts.forEach(alert => {
        if (!alert.active) return;
        
        const currentPrice = currentPrices[alert.goodsId];
        if (currentPrice && currentPrice <= alert.targetPrice) {
          triggeredAlerts.push({
            ...alert,
            currentPrice
          });
        }
      });

      return triggeredAlerts;
    } catch (error) {
      console.error('Check price alerts failed:', error);
      return [];
    }
  }
}

module.exports = new WishlistManager();
