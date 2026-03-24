class CacheManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000;
    this.maxCacheSize = 100;
    this.init();
  }

  init() {
    try {
      const cachedData = wx.getStorageSync('appCache');
      if (cachedData) {
        const { data, timestamps } = cachedData;
        this.cache = new Map(Object.entries(data));
        this.cacheTimestamps = new Map(Object.entries(timestamps));
        this.cleanExpiredCache();
      }
    } catch (error) {
      console.error('Init cache failed:', error);
    }
  }

  set(key, value, ttl = this.defaultTTL) {
    try {
      if (this.cache.size >= this.maxCacheSize) {
        this.evictOldestCache();
      }

      this.cache.set(key, value);
      this.cacheTimestamps.set(key, Date.now() + ttl);
      this.persistToStorage();
    } catch (error) {
      console.error('Set cache failed:', error);
    }
  }

  get(key) {
    try {
      if (!this.has(key)) {
        return null;
      }

      return this.cache.get(key);
    } catch (error) {
      console.error('Get cache failed:', error);
      return null;
    }
  }

  has(key) {
    try {
      if (!this.cacheTimestamps.has(key)) {
        return false;
      }

      const timestamp = this.cacheTimestamps.get(key);
      if (Date.now() > timestamp) {
        this.delete(key);
        return false;
      }

      return this.cache.has(key);
    } catch (error) {
      console.error('Check cache failed:', error);
      return false;
    }
  }

  delete(key) {
    try {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
      this.persistToStorage();
    } catch (error) {
      console.error('Delete cache failed:', error);
    }
  }

  clear() {
    try {
      this.cache.clear();
      this.cacheTimestamps.clear();
      this.persistToStorage();
    } catch (error) {
      console.error('Clear cache failed:', error);
    }
  }

  cleanExpiredCache() {
    try {
      const now = Date.now();
      const keysToDelete = [];

      for (const [key, timestamp] of this.cacheTimestamps.entries()) {
        if (now > timestamp) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => {
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
      });

      if (keysToDelete.length > 0) {
        this.persistToStorage();
      }
    } catch (error) {
      console.error('Clean expired cache failed:', error);
    }
  }

  evictOldestCache() {
    try {
      const entries = Array.from(this.cacheTimestamps.entries());
      if (entries.length === 0) return;

      entries.sort((a, b) => a[1] - b[1]);
      const oldestKey = entries[0][0];
      this.delete(oldestKey);
    } catch (error) {
      console.error('Evict oldest cache failed:', error);
    }
  }

  persistToStorage() {
    try {
      const data = Object.fromEntries(this.cache);
      const timestamps = Object.fromEntries(this.cacheTimestamps);
      wx.setStorageSync('appCache', { data, timestamps });
    } catch (error) {
      console.error('Persist cache failed:', error);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      keys: Array.from(this.cache.keys())
    };
  }

  getOrSet(key, factory, ttl = this.defaultTTL) {
    if (this.has(key)) {
      return Promise.resolve(this.get(key));
    }

    return Promise.resolve(factory())
      .then(value => {
        this.set(key, value, ttl);
        return value;
      });
  }
}

const cacheManager = new CacheManager();

module.exports = cacheManager;
