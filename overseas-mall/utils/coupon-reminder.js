class CouponReminder {
  constructor() {
    this.storageKey = 'couponReminders';
  }

  checkAndRemind() {
    try {
      const coupons = wx.getStorageSync('mockCoupons') || [];
      const reminders = this.getReminders();
      const now = new Date();
      const threeDays = 3 * 24 * 60 * 60 * 1000;

      coupons.forEach(coupon => {
        if (!coupon.endTime) return;
        
        const endDate = new Date(coupon.endTime);
        const daysLeft = Math.ceil((endDate - now) / (24 * 60 * 60 * 1000));

        if (daysLeft > 0 && daysLeft <= 3) {
          const existing = reminders.find(item => item.couponId === coupon.id);
          if (!existing) {
            this.addReminder(coupon, daysLeft);
          }
        }
      });
    } catch (error) {
      console.error('Check coupon reminders failed:', error);
    }
  }

  addReminder(coupon, daysLeft) {
    try {
      const reminders = this.getReminders();
      
      const reminder = {
        id: Date.now(),
        couponId: coupon.id,
        couponName: coupon.name,
        discount: coupon.discount,
        minAmount: coupon.minAmount,
        endTime: coupon.endTime,
        daysLeft,
        createdAt: new Date().toISOString(),
        reminded: false
      };

      reminders.push(reminder);
      wx.setStorageSync(this.storageKey, reminders);

      this.addNotification(reminder);
    } catch (error) {
      console.error('Add coupon reminder failed:', error);
    }
  }

  addNotification(reminder) {
    try {
      const notifications = wx.getStorageSync('mockNotifications') || [];
      
      const dayText = reminder.daysLeft === 1 ? 'tomorrow' : `in ${reminder.daysLeft} days`;
      
      const notification = {
        id: Date.now(),
        type: 'promotion',
        title: 'Coupon Expiring Soon!',
        content: `Your "${reminder.couponName}" coupon expires ${dayText}! Don't miss out!`,
        time: 'Just now',
        read: false,
        tag: `${reminder.daysLeft}d left`,
        link: '/pages/coupons/coupons'
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
}

module.exports = new CouponReminder();
