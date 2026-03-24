class AnalyticsManager {
  constructor() {
    this.enabled = true;
    this.debug = true;
    this.eventsKey = 'analytics_events';
    this.sessionKey = 'analytics_session';
    this.maxEvents = 100;
    this.session = null;
    this.init();
  }

  init() {
    this.createSession();
  }

  createSession() {
    const now = Date.now();
    this.session = {
      sessionId: this.generateSessionId(),
      startTime: now,
      startTimeISO: new Date(now).toISOString(),
      pageViews: 0,
      events: []
    };
    wx.setStorageSync(this.sessionKey, this.session);
  }

  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getSession() {
    if (!this.session) {
      const saved = wx.getStorageSync(this.sessionKey);
      if (saved) {
        this.session = saved;
      } else {
        this.createSession();
      }
    }
    return this.session;
  }

  track(eventName, properties = {}) {
    if (!this.enabled) return;

    const event = {
      eventId: this.generateEventId(),
      eventName,
      timestamp: Date.now(),
      timestampISO: new Date().toISOString(),
      sessionId: this.getSession().sessionId,
      properties: {
        ...properties,
        pagePath: this.getCurrentPage()
      }
    };

    if (this.debug) {
      console.log(`📊 [Analytics] ${eventName}`, event);
    }

    this.saveEvent(event);
    this.updateSession(event);
  }

  generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getCurrentPage() {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      return currentPage.route || '';
    }
    return '';
  }

  saveEvent(event) {
    try {
      let events = wx.getStorageSync(this.eventsKey) || [];
      events.push(event);
      
      if (events.length > this.maxEvents) {
        events = events.slice(-this.maxEvents);
      }
      
      wx.setStorageSync(this.eventsKey, events);
    } catch (error) {
      console.error('Save event failed:', error);
    }
  }

  updateSession(event) {
    try {
      const session = this.getSession();
      session.events.push(event.eventId);
      
      if (event.eventName === 'page_view') {
        session.pageViews++;
      }
      
      this.session = session;
      wx.setStorageSync(this.sessionKey, session);
    } catch (error) {
      console.error('Update session failed:', error);
    }
  }

  pageView(pageName, properties = {}) {
    this.track('page_view', {
      pageName,
      ...properties
    });
  }

  click(elementName, properties = {}) {
    this.track('click', {
      elementName,
      ...properties
    });
  }

  addToCart(productId, productName, properties = {}) {
    this.track('add_to_cart', {
      productId,
      productName,
      ...properties
    });
  }

  purchase(orderId, totalAmount, properties = {}) {
    this.track('purchase', {
      orderId,
      totalAmount,
      ...properties
    });
  }

  search(keyword, properties = {}) {
    this.track('search', {
      keyword,
      ...properties
    });
  }

  getEvents(limit = 50) {
    try {
      const events = wx.getStorageSync(this.eventsKey) || [];
      return events.slice(-limit);
    } catch (error) {
      console.error('Get events failed:', error);
      return [];
    }
  }

  getStatistics() {
    try {
      const events = wx.getStorageSync(this.eventsKey) || [];
      const session = this.getSession();
      
      const stats = {
        totalEvents: events.length,
        sessionDuration: session ? Date.now() - session.startTime : 0,
        pageViews: session ? session.pageViews : 0,
        eventCounts: {},
        topEvents: []
      };

      events.forEach(event => {
        stats.eventCounts[event.eventName] = (stats.eventCounts[event.eventName] || 0) + 1;
      });

      stats.topEvents = Object.entries(stats.eventCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      return stats;
    } catch (error) {
      console.error('Get statistics failed:', error);
      return null;
    }
  }

  clearEvents() {
    try {
      wx.removeStorageSync(this.eventsKey);
      this.createSession();
      return true;
    } catch (error) {
      console.error('Clear events failed:', error);
      return false;
    }
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  setDebug(debug) {
    this.debug = debug;
  }
}

module.exports = new AnalyticsManager();