class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.marks = new Map();
    this.measures = new Map();
    this.enabled = true;
    this.maxMetrics = 100;
  }

  mark(name) {
    if (!this.enabled) return;

    let systemInfo = {};
    try {
      const windowInfo = wx.getWindowInfo();
      systemInfo = windowInfo;
    } catch (error) {
      try {
        systemInfo = wx.getSystemInfoSync();
      } catch (e) {
        systemInfo = {};
      }
    }

    this.marks.set(name, {
      timestamp: Date.now(),
      performance: systemInfo
    });
  }

  measure(name, startMark, endMark) {
    if (!this.enabled) return;

    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (start && end) {
      const duration = end.timestamp - start.timestamp;
      this.measures.set(name, {
        duration,
        start: start.timestamp,
        end: end.timestamp
      });

      this.recordMetric(name, duration);
      return duration;
    }

    return 0;
  }

  recordMetric(name, value, tags = {}) {
    if (!this.enabled) return;

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricList = this.metrics.get(name);
    metricList.push({
      value,
      timestamp: Date.now(),
      tags
    });

    if (metricList.length > this.maxMetrics) {
      metricList.shift();
    }
  }

  getMetric(name) {
    const metricList = this.metrics.get(name);
    if (!metricList || metricList.length === 0) {
      return null;
    }

    const values = metricList.map(m => m.value);
    return {
      name,
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: values[values.length - 1]
    };
  }

  getAllMetrics() {
    const result = {};
    for (const name of this.metrics.keys()) {
      result[name] = this.getMetric(name);
    }
    return result;
  }

  startTiming(name) {
    this.mark(`${name}-start`);
  }

  endTiming(name) {
    this.mark(`${name}-end`);
    return this.measure(name, `${name}-start`, `${name}-end`);
  }

  wrapAsync(name, fn) {
    return async (...args) => {
      this.startTiming(name);
      try {
        const result = await fn(...args);
        this.endTiming(name);
        return result;
      } catch (error) {
        this.endTiming(name);
        this.recordMetric(`${name}-error`, 1);
        throw error;
      }
    };
  }

  wrapSync(name, fn) {
    return (...args) => {
      this.startTiming(name);
      try {
        const result = fn(...args);
        this.endTiming(name);
        return result;
      } catch (error) {
        this.endTiming(name);
        this.recordMetric(`${name}-error`, 1);
        throw error;
      }
    };
  }

  clear() {
    this.metrics.clear();
    this.marks.clear();
    this.measures.clear();
  }

  logReport() {
    console.log('=== Performance Report ===');
    const allMetrics = this.getAllMetrics();
    
    for (const [name, metric] of Object.entries(allMetrics)) {
      console.log(`${name}:`);
      console.log(`  Count: ${metric.count}`);
      console.log(`  Avg: ${metric.avg.toFixed(2)}ms`);
      console.log(`  Min: ${metric.min.toFixed(2)}ms`);
      console.log(`  Max: ${metric.max.toFixed(2)}ms`);
      console.log(`  Latest: ${metric.latest.toFixed(2)}ms`);
    }
  }

  getReport() {
    let systemInfo = {};
    try {
      const windowInfo = wx.getWindowInfo();
      systemInfo = windowInfo;
    } catch (error) {
      try {
        systemInfo = wx.getSystemInfoSync();
      } catch (e) {
        systemInfo = {};
      }
    }

    return {
      timestamp: Date.now(),
      metrics: this.getAllMetrics(),
      systemInfo: systemInfo
    };
  }
}

const performanceMonitor = new PerformanceMonitor();

module.exports = performanceMonitor;
