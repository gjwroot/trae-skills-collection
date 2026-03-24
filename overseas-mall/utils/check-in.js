class CheckInManager {
  constructor() {
    this.storageKey = 'checkInRecords';
    this.continuousCheckInKey = 'continuousCheckIn';
    this.lastCheckInDateKey = 'lastCheckInDate';
    
    this.rewards = [
      { day: 1, points: 10 },
      { day: 2, points: 15 },
      { day: 3, points: 20 },
      { day: 4, points: 25 },
      { day: 5, points: 30 },
      { day: 6, points: 40 },
      { day: 7, points: 50 }
    ];
  }

  formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isDateToday(date) {
    return this.formatDate(date) === this.formatDate(new Date());
  }

  isDateYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.formatDate(date) === this.formatDate(yesterday);
  }

  getCheckInRecords() {
    try {
      return wx.getStorageSync(this.storageKey) || [];
    } catch (error) {
      console.error('Get check-in records failed:', error);
      return [];
    }
  }

  saveCheckInRecords(records) {
    try {
      wx.setStorageSync(this.storageKey, records);
    } catch (error) {
      console.error('Save check-in records failed:', error);
    }
  }

  getContinuousCheckIn() {
    try {
      return wx.getStorageSync(this.continuousCheckInKey) || 0;
    } catch (error) {
      console.error('Get continuous check-in failed:', error);
      return 0;
    }
  }

  saveContinuousCheckIn(count) {
    try {
      wx.setStorageSync(this.continuousCheckInKey, count);
    } catch (error) {
      console.error('Save continuous check-in failed:', error);
    }
  }

  getLastCheckInDate() {
    try {
      return wx.getStorageSync(this.lastCheckInDateKey) || '';
    } catch (error) {
      console.error('Get last check-in date failed:', error);
      return '';
    }
  }

  saveLastCheckInDate(date) {
    try {
      wx.setStorageSync(this.lastCheckInDateKey, date);
    } catch (error) {
      console.error('Save last check-in date failed:', error);
    }
  }

  hasCheckedInToday() {
    const lastDate = this.getLastCheckInDate();
    if (!lastDate) return false;
    return this.isDateToday(lastDate);
  }

  checkIn() {
    if (this.hasCheckedInToday()) {
      return {
        success: false,
        message: 'You have already checked in today',
        points: 0,
        continuousDays: this.getContinuousCheckIn()
      };
    }

    const lastDate = this.getLastCheckInDate();
    let continuousDays = this.getContinuousCheckIn();

    if (lastDate && this.isDateYesterday(lastDate)) {
      continuousDays += 1;
    } else {
      continuousDays = 1;
    }

    const rewardDay = ((continuousDays - 1) % 7) + 1;
    const reward = this.rewards.find(r => r.day === rewardDay) || this.rewards[0];

    const record = {
      id: Date.now(),
      date: this.formatDate(new Date()),
      points: reward.points,
      continuousDays: continuousDays
    };

    const records = this.getCheckInRecords();
    records.push(record);
    this.saveCheckInRecords(records);
    this.saveContinuousCheckIn(continuousDays);
    this.saveLastCheckInDate(this.formatDate(new Date()));

    return {
      success: true,
      message: 'Check-in successful!',
      points: reward.points,
      continuousDays: continuousDays,
      reward: reward
    };
  }

  getMonthCheckInStatus(year, month) {
    const records = this.getCheckInRecords();
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const monthRecords = records.filter(r => r.date.startsWith(monthStr));
    const checkedInDates = monthRecords.map(r => parseInt(r.date.split('-')[2]));
    return checkedInDates;
  }

  getWeeklyRewards() {
    return this.rewards;
  }

  getCheckInStats() {
    const records = this.getCheckInRecords();
    const continuousDays = this.getContinuousCheckIn();
    const totalPoints = records.reduce((sum, r) => sum + r.points, 0);
    
    return {
      totalCheckIns: records.length,
      continuousDays: continuousDays,
      totalPoints: totalPoints,
      hasCheckedInToday: this.hasCheckedInToday()
    };
  }
}

module.exports = new CheckInManager();
