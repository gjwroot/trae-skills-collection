const util = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    historyList: [],
    hasCheckedIn: false,
    checkInStreak: 0,
    checkInCalendar: [],
    dailyTasks: []
  },

  onLoad() {
    this.loadUserInfo();
    this.loadCheckInData();
    this.loadDailyTasks();
    this.loadHistory();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    let userInfo = wx.getStorageSync('userInfo') || {};
    
    if (userInfo.id && !userInfo.vipLevel) {
      userInfo = {
        ...userInfo,
        vipLevel: Math.floor(Math.random() * 3) + 1,
        points: Math.floor(Math.random() * 5000) + 1000
      };
      wx.setStorageSync('userInfo', userInfo);
    }
    
    this.setData({ userInfo });
  },

  loadCheckInData() {
    const today = new Date().toDateString();
    const lastCheckIn = wx.getStorageSync('lastCheckIn');
    const checkInStreak = wx.getStorageSync('checkInStreak') || 0;
    const checkInDates = wx.getStorageSync('checkInDates') || [];
    
    const hasCheckedIn = lastCheckIn === today;
    
    const newStreak = this.calculateStreak(lastCheckIn, checkInStreak);
    
    const calendar = this.generateCheckInCalendar(checkInDates);
    
    this.setData({
      hasCheckedIn,
      checkInStreak: newStreak,
      checkInCalendar: calendar
    });
    
    wx.setStorageSync('checkInStreak', newStreak);
  },

  calculateStreak(lastCheckIn, currentStreak) {
    if (!lastCheckIn) return 0;
    
    const today = new Date();
    const lastDate = new Date(lastCheckIn);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate.toDateString() === today.toDateString()) {
      return currentStreak;
    } else if (lastDate.toDateString() === yesterday.toDateString()) {
      return currentStreak;
    } else {
      return 0;
    }
  },

  generateCheckInCalendar(checkedDates) {
    const today = new Date();
    const calendar = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const isChecked = checkedDates.includes(dateStr);
      const isToday = i === 0;
      
      calendar.unshift({
        date: date.getDate(),
        weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        isChecked,
        isToday,
        dateStr
      });
    }
    
    return calendar;
  },

  loadDailyTasks() {
    const completedTasks = wx.getStorageSync('completedTasks') || {};
    const today = new Date().toDateString();
    
    if (completedTasks.date !== today) {
      wx.setStorageSync('completedTasks', { date: today, tasks: {} });
    }
    
    const tasks = [
      { id: 'checkin', name: 'Daily Check-in', points: 10, icon: 'checkbox', completed: completedTasks.tasks?.checkin || false },
      { id: 'browse', name: 'Browse 5 products', points: 15, icon: 'shop-o', completed: completedTasks.tasks?.browse || false },
      { id: 'addcart', name: 'Add to cart', points: 20, icon: 'cart', completed: completedTasks.tasks?.addcart || false },
      { id: 'share', name: 'Share a product', points: 25, icon: 'share-o', completed: completedTasks.tasks?.share || false }
    ];
    
    this.setData({ dailyTasks: tasks });
  },

  doCheckIn() {
    if (this.data.hasCheckedIn) {
      util.showToast('Already checked in today');
      return;
    }
    
    wx.showLoading({ title: 'Checking in...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      const today = new Date().toDateString();
      const checkInDates = wx.getStorageSync('checkInDates') || [];
      checkInDates.push(today);
      
      if (checkInDates.length > 30) {
        checkInDates.shift();
      }
      
      wx.setStorageSync('lastCheckIn', today);
      wx.setStorageSync('checkInDates', checkInDates);
      
      const streakBonus = Math.min(this.data.checkInStreak, 7) * 2;
      const totalPoints = 10 + streakBonus;
      
      this.addPoints(totalPoints, 'Daily Check-in');
      this.completeTask('checkin');
      
      this.setData({
        hasCheckedIn: true,
        checkInStreak: this.data.checkInStreak + 1
      });
      
      this.loadCheckInData();
      
      util.showSuccess(`+${totalPoints} Points!`);
    }, 500);
  },

  completeTask(taskId) {
    const completedTasks = wx.getStorageSync('completedTasks') || { date: new Date().toDateString(), tasks: {} };
    completedTasks.tasks = completedTasks.tasks || {};
    completedTasks.tasks[taskId] = true;
    wx.setStorageSync('completedTasks', completedTasks);
    
    const tasks = this.data.dailyTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: true };
      }
      return task;
    });
    
    this.setData({ dailyTasks: tasks });
  },

  addPoints(points, reason) {
    let userInfo = wx.getStorageSync('userInfo') || {};
    userInfo.points = (userInfo.points || 0) + points;
    wx.setStorageSync('userInfo', userInfo);
    
    let historyList = wx.getStorageSync('pointsHistory') || [];
    historyList.unshift({
      id: Date.now(),
      title: reason,
      time: new Date().toLocaleString(),
      points: points,
      type: 'earn'
    });
    
    if (historyList.length > 50) {
      historyList = historyList.slice(0, 50);
    }
    
    wx.setStorageSync('pointsHistory', historyList);
    
    this.setData({ userInfo });
  },

  loadHistory() {
    const history = wx.getStorageSync('pointsHistory') || [
      { id: 1, title: 'Daily Check-in', time: '2026-03-08 09:30', points: 10, type: 'earn' },
      { id: 2, title: 'Order Completed', time: '2026-03-07 14:20', points: 156, type: 'earn' },
      { id: 3, title: 'Points Redemption', time: '2026-03-05 18:45', points: 200, type: 'spend' },
      { id: 4, title: 'Review Submitted', time: '2026-03-04 11:15', points: 30, type: 'earn' },
      { id: 5, title: 'Product Shared', time: '2026-03-02 16:30', points: 20, type: 'earn' }
    ];
    
    this.setData({ historyList: history });
  }
});
