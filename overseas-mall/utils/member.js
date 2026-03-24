class MemberManager {
  constructor() {
    this.levels = [
      { id: 1, name: 'Bronze', minPoints: 0, discount: 1, color: '#CD7F32', icon: '🥉' },
      { id: 2, name: 'Silver', minPoints: 1000, discount: 0.95, color: '#C0C0C0', icon: '🥈' },
      { id: 3, name: 'Gold', minPoints: 3000, discount: 0.9, color: '#FFD700', icon: '🥇' },
      { id: 4, name: 'Platinum', minPoints: 8000, discount: 0.85, color: '#E5E4E2', icon: '💎' },
      { id: 5, name: 'Diamond', minPoints: 20000, discount: 0.8, color: '#B9F2FF', icon: '🔷' }
    ];
  }

  getLevelByPoints(points) {
    let currentLevel = this.levels[0];
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (points >= this.levels[i].minPoints) {
        currentLevel = this.levels[i];
        break;
      }
    }
    return currentLevel;
  }

  getNextLevel(points) {
    const currentLevel = this.getLevelByPoints(points);
    const currentIndex = this.levels.findIndex(l => l.id === currentLevel.id);
    if (currentIndex < this.levels.length - 1) {
      return this.levels[currentIndex + 1];
    }
    return null;
  }

  getProgressToNextLevel(points) {
    const nextLevel = this.getNextLevel(points);
    if (!nextLevel) {
      return { progress: 100, remaining: 0 };
    }
    const currentLevel = this.getLevelByPoints(points);
    const progress = ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100;
    const remaining = nextLevel.minPoints - points;
    return { progress: Math.min(100, Math.max(0, progress)), remaining: Math.max(0, remaining) };
  }

  calculateDiscountedPrice(originalPrice, points) {
    const level = this.getLevelByPoints(points);
    return (originalPrice * level.discount).toFixed(2);
  }

  getLevelById(levelId) {
    return this.levels.find(l => l.id === levelId) || this.levels[0];
  }

  getAllLevels() {
    return this.levels;
  }

  addPoints(userId, points) {
    try {
      const userInfo = wx.getStorageSync('userInfo') || {};
      if (userInfo.id === userId) {
        const newPoints = (userInfo.points || 0) + points;
        const newLevel = this.getLevelByPoints(newPoints);
        const updatedUserInfo = {
          ...userInfo,
          points: newPoints,
          vipLevel: newLevel.id
        };
        wx.setStorageSync('userInfo', updatedUserInfo);
        
        const app = getApp();
        if (app && app.globalData) {
          app.globalData.userInfo = updatedUserInfo;
        }
        
        return { success: true, points: newPoints, level: newLevel };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Add points failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new MemberManager();
