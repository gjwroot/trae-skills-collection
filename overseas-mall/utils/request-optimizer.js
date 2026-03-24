class RequestOptimizer {
  constructor() {
    this.pendingRequests = new Map();
    this.requestCache = new Map();
    this.defaultCacheTTL = 60 * 1000;
    this.batchingEnabled = true;
    this.batchWindow = 50;
  }

  async request(key, fetchFn, options = {}) {
    const { 
      cache = true, 
      cacheTTL = this.defaultCacheTTL,
      batch = false 
    } = options;

    if (cache && this.requestCache.has(key)) {
      const cached = this.requestCache.get(key);
      if (Date.now() < cached.expires) {
        return cached.data;
      }
      this.requestCache.delete(key);
    }

    if (batch && this.batchingEnabled) {
      return this.batchRequest(key, fetchFn);
    }

    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const requestPromise = fetchFn()
      .then(data => {
        if (cache) {
          this.requestCache.set(key, {
            data,
            expires: Date.now() + cacheTTL
          });
        }
        this.pendingRequests.delete(key);
        return data;
      })
      .catch(error => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  async batchRequest(key, fetchFn) {
    if (!this.batchQueue) {
      this.batchQueue = [];
      this.batchTimer = null;
    }

    return new Promise((resolve, reject) => {
      this.batchQueue.push({
        key,
        fetchFn,
        resolve,
        reject
      });

      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this.processBatchQueue();
        }, this.batchWindow);
      }
    });
  }

  async processBatchQueue() {
    const queue = this.batchQueue;
    this.batchQueue = [];
    this.batchTimer = null;

    for (const item of queue) {
      try {
        const data = await this.request(item.key, item.fetchFn, { batch: false });
        item.resolve(data);
      } catch (error) {
        item.reject(error);
      }
    }
  }

  invalidateCache(key) {
    if (key) {
      this.requestCache.delete(key);
    } else {
      this.requestCache.clear();
    }
  }

  invalidateCachePattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.requestCache.keys()) {
      if (regex.test(key)) {
        this.requestCache.delete(key);
      }
    }
  }

  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.requestCache.entries()) {
      if (now > value.expires) {
        this.requestCache.delete(key);
      }
    }
  }

  getCacheStats() {
    return {
      pending: this.pendingRequests.size,
      cached: this.requestCache.size,
      batchQueueLength: this.batchQueue ? this.batchQueue.length : 0
    };
  }
}

const requestOptimizer = new RequestOptimizer();

module.exports = requestOptimizer;
