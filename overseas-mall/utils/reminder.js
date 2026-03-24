const util = require('./util.js');

class ReminderManager {
  constructor() {
    this.reminderKey = 'reminders';
    this.reminders = this.loadReminders();
  }

  loadReminders() {
    try {
      return wx.getStorageSync(this.reminderKey) || [];
    } catch (error) {
      console.error('Load reminders failed:', error);
      return [];
    }
  }

  saveReminders() {
    try {
      wx.setStorageSync(this.reminderKey, this.reminders);
      return true;
    } catch (error) {
      console.error('Save reminders failed:', error);
      return false;
    }
  }

  addReminder(type, data, remindAt) {
    const reminder = {
      id: Date.now(),
      type,
      data,
      remindAt,
      createdAt: new Date().toISOString(),
      read: false,
      triggered: false
    };
    
    this.reminders.unshift(reminder);
    this.saveReminders();
    
    return reminder;
  }

  addOrderReviewReminder(orderId, orderNo, goodsName, days = 7) {
    const remindAt = Date.now() + days * 24 * 60 * 60 * 1000;
    return this.addReminder('order_review', {
      orderId,
      orderNo,
      goodsName
    }, remindAt);
  }

  addCouponExpireReminder(couponId, couponName, expireDate) {
    const remindAt = new Date(expireDate).getTime() - 24 * 60 * 60 * 1000;
    return this.addReminder('coupon_expire', {
      couponId,
      couponName,
      expireDate
    }, remindAt);
  }

  addPriceDropReminder(goodsId, goodsName, currentPrice, targetPrice) {
    return this.addReminder('price_drop', {
      goodsId,
      goodsName,
      currentPrice,
      targetPrice
    }, 0);
  }

  getReminders(type = null) {
    if (type) {
      return this.reminders.filter(r => r.type === type);
    }
    return this.reminders;
  }

  getUnreadReminders() {
    return this.reminders.filter(r => !r.read);
  }

  getUnreadCount() {
    return this.getUnreadReminders().length;
  }

  markAsRead(id) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.read = true;
      this.saveReminders();
    }
  }

  markAllAsRead() {
    this.reminders.forEach(r => r.read = true);
    this.saveReminders();
  }

  deleteReminder(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.saveReminders();
  }

  clearAll() {
    this.reminders = [];
    this.saveReminders();
  }

  checkDueReminders() {
    const now = Date.now();
    const dueReminders = this.reminders.filter(r => 
      !r.triggered && r.remindAt > 0 && now >= r.remindAt
    );
    
    dueReminders.forEach(reminder => {
      reminder.triggered = true;
      this.showNotification(reminder);
    });
    
    this.saveReminders();
    return dueReminders;
  }

  showNotification(reminder) {
    let title = '';
    let content = '';
    
    switch (reminder.type) {
      case 'order_review':
        title = 'Review Reminder';
        content = `Please review your order ${reminder.data.orderNo}`;
        break;
      case 'coupon_expire':
        title = 'Coupon Expiring';
        content = `Your coupon "${reminder.data.couponName}" is expiring soon!`;
        break;
      case 'price_drop':
        title = 'Price Dropped!';
        content = `${reminder.data.goodsName} price has dropped!`;
        break;
    }
    
    if (title && content) {
      util.showToast(content);
    }
  }
}

module.exports = new ReminderManager();
