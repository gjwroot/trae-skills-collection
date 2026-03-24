class LazyLoadManager {
  constructor() {
    this.observedImages = new Map();
    this.loadedImages = new Set();
    this.loadingImages = new Set();
  }

  shouldLazyLoad(url) {
    if (!url) return false;
    if (this.loadedImages.has(url)) return false;
    if (this.loadingImages.has(url)) return false;
    return true;
  }

  loadImage(url, options = {}) {
    const { onSuccess, onError, priority = 'normal' } = options;

    if (!this.shouldLazyLoad(url)) {
      if (onSuccess && this.loadedImages.has(url)) {
        onSuccess();
      }
      return;
    }

    this.loadingImages.add(url);

    wx.getImageInfo({
      src: url,
      success: () => {
        this.loadedImages.add(url);
        this.loadingImages.delete(url);
        if (onSuccess) {
          onSuccess();
        }
      },
      fail: (error) => {
        this.loadingImages.delete(url);
        console.error('Lazy load image failed:', url, error);
        if (onError) {
          onError(error);
        }
      }
    });
  }

  loadImages(urls, options = {}) {
    const { onProgress, onComplete, priority = 'normal' } = options;
    let loadedCount = 0;
    const totalCount = urls.length;

    urls.forEach((url, index) => {
      setTimeout(() => {
        this.loadImage(url, {
          priority,
          onSuccess: () => {
            loadedCount++;
            if (onProgress) {
              onProgress(loadedCount, totalCount);
            }
            if (loadedCount === totalCount && onComplete) {
              onComplete();
            }
          },
          onError: () => {
            loadedCount++;
            if (onProgress) {
              onProgress(loadedCount, totalCount);
            }
            if (loadedCount === totalCount && onComplete) {
              onComplete();
            }
          }
        });
      }, index * 100);
    });
  }

  loadVisibleImages(goodsList, visibleCount = 10) {
    const visibleUrls = goodsList
      .slice(0, visibleCount)
      .map(item => item.image)
      .filter(url => url);

    this.loadImages(visibleUrls, { priority: 'high' });
  }

  preloadNextImages(goodsList, startIndex = 10, count = 10) {
    const nextUrls = goodsList
      .slice(startIndex, startIndex + count)
      .map(item => item.image)
      .filter(url => url);

    this.loadImages(nextUrls, { priority: 'normal' });
  }

  clearLoadedImages() {
    this.loadedImages.clear();
    this.loadingImages.clear();
  }

  isImageLoaded(url) {
    return this.loadedImages.has(url);
  }

  getStats() {
    return {
      loaded: this.loadedImages.size,
      loading: this.loadingImages.size,
      observed: this.observedImages.size
    };
  }
}

const lazyLoadManager = new LazyLoadManager();

module.exports = lazyLoadManager;
