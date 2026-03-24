class ImageCacheManager {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 50;
    this.cacheExpiry = 24 * 60 * 60 * 1000;
  }

  set(key, value) {
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  clearExpired() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.cacheExpiry) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize
    };
  }
}

const imageCacheManager = new ImageCacheManager();

module.exports = imageCacheManager;
