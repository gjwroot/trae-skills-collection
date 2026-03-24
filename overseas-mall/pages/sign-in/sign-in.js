const util = require('../../utils/util.js');
const checkInManager = require('../../utils/check-in.js');
const memberManager = require('../../utils/member.js');

Page({
  data: {
    checkedIn: false,
    continuousDays: 0,
    todayPoints: 0,
    weeklyRewards: [],
    monthCheckIns: [],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    daysInMonth: 0,
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    stats: {
      totalCheckIns: 0,
      totalPoints: 0
    }
  },

  onLoad() {
    this.initCheckInData();
  },

  onShow() {
    this.initCheckInData();
  },

  initCheckInData() {
    const checkedIn = checkInManager.hasCheckedInToday();
    const stats = checkInManager.getCheckInStats();
    const weeklyRewards = checkInManager.getWeeklyRewards();
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const monthCheckIns = checkInManager.getMonthCheckInStatus(currentYear, currentMonth);

    this.setData({
      checkedIn,
      continuousDays: stats.continuousDays,
      todayPoints: this.getTodayRewardPoints(stats.continuousDays),
      weeklyRewards: weeklyRewards.map((reward, index) => ({
        ...reward,
        active: index < stats.continuousDays % 7 || (stats.continuousDays >= 7 && index < 7),
        today: index === stats.continuousDays % 7 && !checkedIn
      })),
      currentYear,
      currentMonth,
      daysInMonth,
      monthCheckIns,
      stats
    });
  },

  getTodayRewardPoints(continuousDays) {
    const rewardDay = ((continuousDays - 1) % 7) + 1;
    const rewards = checkInManager.getWeeklyRewards();
    const reward = rewards.find(r => r.day === rewardDay) || rewards[0];
    return reward.points;
  },

  handleCheckIn() {
    if (this.data.checkedIn) {
      util.showToast('You have already checked in today');
      return;
    }

    wx.showLoading({ title: 'Checking in...' });

    setTimeout(() => {
      wx.hideLoading();
      
      const result = checkInManager.checkIn();
      
      if (result.success) {
        const userInfo = wx.getStorageSync('userInfo') || {};
        if (userInfo.id) {
          memberManager.addPoints(userInfo.id, result.points);
        }

        this.showCheckInSuccess(result);
        this.initCheckInData();
      } else {
        util.showToast(result.message);
      }
    }, 800);
  },

  showCheckInSuccess(result) {
    wx.showModal({
      title: '🎉 Check-in Successful!',
      content: `You got ${result.points} points!\n${result.continuousDays} days in a row!`,
      showCancel: false,
      confirmText: 'Great!'
    });
  },

  generateCalendarDays() {
    const days = [];
    const firstDayOfMonth = new Date(this.data.currentYear, this.data.currentMonth - 1, 1).getDay();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', empty: true });
    }
    
    for (let i = 1; i <= this.data.daysInMonth; i++) {
      days.push({
        day: i,
        checked: this.data.monthCheckIns.includes(i),
        today: i === new Date().getDate()
      });
    }
    
    return days;
  },

  navigateToPoints() {
    wx.navigateTo({ url: '/pages/my-points/my-points' });
  }
});
