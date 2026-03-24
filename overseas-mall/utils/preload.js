class PreloadManager {
  constructor() {
    this.preloadedImages = new Map();
    this.preloadedPages = new Set();
    this.preloadQueue = [];
    this.isPreloading = false;
    this.maxConcurrentPreloads = 3;
    this.activePreloads = 0;
    this.networkType = 'wifi';
    this.initNetworkMonitor();
  }

  initNetworkMonitor() {
    try {
      wx.getNetworkType({
        success: (res) => {
          this.networkType = res.networkType;
        }
      });

      wx.onNetworkStatusChange((res) => {
        this.networkType = res.networkType;
        this.adjustPreloadStrategy();
      });
    } catch (error) {
      console.error('Init network monitor failed:', error);
    }
  }

  adjustPreloadStrategy() {
    if (this.networkType === 'wifi') {
      this.maxConcurrentPreloads = 5;
    } else if (this.networkType === '4g') {
      this.maxConcurrentPreloads = 3;
    } else {
      this.maxConcurrentPreloads = 1;
    }
  }

  preloadImage(url, priority = 'normal') {
    if (!url || this.preloadedImages.has(url)) {
      return Promise.resolve();
    }

    if (this.networkType === '2g' || this.networkType === 'none') {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const preloadTask = {
        url,
        priority,
        timestamp: Date.now(),
        resolve
      };

      const priorityOrder = { high: 0, normal: 1, low: 2 };
      const insertIndex = this.preloadQueue.findIndex(
        task => priorityOrder[task.priority] > priorityOrder[priority]
      );

      if (insertIndex === -1) {
        this.preloadQueue.push(preloadTask);
      } else {
        this.preloadQueue.splice(insertIndex, 0, preloadTask);
      }

      this.processQueue();
    });
  }

  preloadImages(urls, priority = 'normal') {
    const promises = urls.map(url => this.preloadImage(url, priority));
    return Promise.all(promises);
  }

  processQueue() {
    if (this.activePreloads >= this.maxConcurrentPreloads || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;
    const task = this.preloadQueue.shift();

    if (!task) {
      this.isPreloading = false;
      return;
    }

    if (task.type === 'page') {
      this.preloadedPages.add(task.path);
      this.processQueue();
      return;
    }

    if (!task.resolve) {
      this.processQueue();
      return;
    }

    this.activePreloads++;

    wx.getImageInfo({
      src: task.url,
      success: () => {
        this.preloadedImages.set(task.url, {
          timestamp: Date.now(),
          size: 0
        });
        task.resolve();
      },
      fail: () => {
        task.resolve();
      },
      complete: () => {
        this.activePreloads--;
        this.processQueue();
      }
    });
  }

  preloadPage(pagePath, params = {}) {
    if (this.preloadedPages.has(pagePath)) {
      return;
    }

    this.preloadQueue.push({
      type: 'page',
      path: pagePath,
      params,
      timestamp: Date.now()
    });

    this.processQueue();
  }

  preloadGoodsDetail(goodsId) {
    this.preloadPage('/pages/goods-detail/goods-detail', { id: goodsId });
  }

  preloadHotGoods(goodsList) {
    const imageUrls = goodsList
      .slice(0, 8)
      .map(item => item.image)
      .filter(url => url);
    
    this.preloadImages(imageUrls, 'high');
  }

  preloadVisibleImages(goodsList, visibleCount = 10) {
    const imageUrls = goodsList
      .slice(0, visibleCount)
      .map(item => item.image)
      .filter(url => url);
    
    this.preloadImages(imageUrls, 'high');
  }

  preloadNextImages(goodsList, startIndex = 10, count = 10) {
    const imageUrls = goodsList
      .slice(startIndex, startIndex + count)
      .map(item => item.image)
      .filter(url => url);
    
    this.preloadImages(imageUrls, 'normal');
  }

  clearCache() {
    this.preloadedImages.clear();
    this.preloadedPages.clear();
    this.preloadQueue = [];
    this.activePreloads = 0;
  }

  clearOldCache(maxAge = 30 * 60 * 1000) {
    const now = Date.now();
    for (const [url, info] of this.preloadedImages.entries()) {
      if (now - info.timestamp > maxAge) {
        this.preloadedImages.delete(url);
      }
    }
  }

  getPreloadStats() {
    return {
      images: this.preloadedImages.size,
      pages: this.preloadedPages.size,
      queueLength: this.preloadQueue.length,
      activePreloads: this.activePreloads,
      networkType: this.networkType,
      maxConcurrentPreloads: this.maxConcurrentPreloads
    };
  }

  isImagePreloaded(url) {
    return this.preloadedImages.has(url);
  }
}

const preloadManager = new PreloadManager();

module.exports = preloadManager;
