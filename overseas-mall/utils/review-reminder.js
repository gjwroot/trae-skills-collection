class ReviewReminder {
  constructor() {
    this.storageKey = 'reviewReminders';
  }

  addReminder(orderId, goods, delayDays = 3) {
    try {
      const reminders = this.getReminders();
      const existing = reminders.find(item => item.orderId === orderId);
      
      if (existing) return false;

      const reminder = {
        id: Date.now(),
        orderId,
        goods,
        createdAt: new Date().toISOString(),
        remindAt: new Date(Date.now() + delayDays * 24 * 60 * 60 * 1000).toISOString(),
        reminded: false,
        reviewed: false
      };

      reminders.push(reminder);
      wx.setStorageSync(this.storageKey, reminders);

      this.addNotification(reminder);

      return true;
    } catch (error) {
      console.error('Add review reminder failed:', error);
      return false;
    }
  }

  addNotification(reminder) {
    try {
      const notifications = wx.getStorageSync('mockNotifications') || [];
      
      const notification = {
        id: Date.now(),
        type: 'order',
        title: 'Review Your Purchase',
        content: `How was your ${reminder.goods[0]?.name || 'purchase'}? Share your experience!`,
        time: 'Just now',
        read: false,
        tag: 'Earn Points',
        link: `/pages/goods-review/goods-review?id=${reminder.goods[0]?.id}&orderId=${reminder.orderId}`
      };

      notifications.unshift(notification);
      wx.setStorageSync('mockNotifications', notifications);
    } catch (error) {
      console.error('Add notification failed:', error);
    }
  }

  getReminders() {
    try {
      return wx.getStorageSync(this.storageKey) || [];
    } catch (error) {
      return [];
    }
  }

  getPendingReminders() {
    const reminders = this.getReminders();
    const now = new Date();
    return reminders.filter(item => {
      if (item.reviewed) return false;
      if (item.reminded) return false;
      return new Date(item.remindAt) <= now;
    });
  }

  markAsReminded(id) {
    const reminders = this.getReminders();
    const updated = reminders.map(item => {
      if (item.id === id) {
        return { ...item, reminded: true };
      }
      return item;
    });
    wx.setStorageSync(this.storageKey, updated);
  }

  markAsReviewed(orderId) {
    const reminders = this.getReminders();
    const updated = reminders.map(item => {
      if (item.orderId === orderId) {
        return { ...item, reviewed: true };
      }
      return item;
    });
    wx.setStorageSync(this.storageKey, updated);
  }

  checkAndRemind() {
    const pending = this.getPendingReminders();
    pending.forEach(reminder => {
      this.addNotification(reminder);
      this.markAsReminded(reminder.id);
    });
    return pending.length;
  }
}

module.exports = new ReviewReminder();
