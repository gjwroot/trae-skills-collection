class MemberActivityManager {
  constructor() {
    this.activityKey = 'member_activities';
    this.participationKey = 'activity_participations';
  }

  getActivities() {
    try {
      return wx.getStorageSync(this.activityKey) || [];
    } catch (error) {
      console.error('Get activities failed:', error);
      return [];
    }
  }

  saveActivities(activities) {
    try {
      wx.setStorageSync(this.activityKey, activities);
      return true;
    } catch (error) {
      console.error('Save activities failed:', error);
      return false;
    }
  }

  getParticipations() {
    try {
      return wx.getStorageSync(this.participationKey) || {};
    } catch (error) {
      console.error('Get participations failed:', error);
      return {};
    }
  }

  saveParticipations(participations) {
    try {
      wx.setStorageSync(this.participationKey, participations);
      return true;
    } catch (error) {
      console.error('Save participations failed:', error);
      return false;
    }
  }

  participateActivity(activityId, userId = 'user') {
    try {
      const participations = this.getParticipations();
      const userParticipations = participations[userId] || [];

      if (userParticipations.includes(activityId)) {
        return { success: false, message: '已参与过该活动' };
      }

      userParticipations.push(activityId);
      participations[userId] = userParticipations;
      this.saveParticipations(participations);

      return { success: true, message: '参与成功' };
    } catch (error) {
      console.error('Participate activity failed:', error);
      return { success: false, message: '参与失败' };
    }
  }

  hasParticipated(activityId, userId = 'user') {
    try {
      const participations = this.getParticipations();
      const userParticipations = participations[userId] || [];
      return userParticipations.includes(activityId);
    } catch (error) {
      console.error('Check participation failed:', error);
      return false;
    }
  }

  getMockActivities() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    return [
      {
        id: 1,
        title: '新人专享礼包',
        description: '新会员专享，领取100积分和专属优惠券',
        type: 'newbie',
        icon: '🎁',
        color: '#FF6B4A',
        minLevel: 1,
        pointsReward: 100,
        couponReward: { amount: 20, minAmount: 100 },
        startTime: now - oneDay,
        endTime: now + 30 * oneDay,
        status: 'active'
      },
      {
        id: 2,
        title: '每日签到奖励',
        description: '连续签到7天，额外赠送50积分',
        type: 'daily',
        icon: '📅',
        color: '#4CAF50',
        minLevel: 1,
        pointsReward: 10,
        startTime: now - oneDay,
        endTime: now + 365 * oneDay,
        status: 'active'
      },
      {
        id: 3,
        title: '白银会员双倍积分',
        description: '白银及以上会员购物享双倍积分',
        type: 'double_points',
        icon: '🥈',
        color: '#C0C0C0',
        minLevel: 2,
        pointsMultiplier: 2,
        startTime: now - oneDay,
        endTime: now + 90 * oneDay,
        status: 'active'
      },
      {
        id: 4,
        title: '黄金会员专属折扣',
        description: '黄金及以上会员享全场9折优惠',
        type: 'discount',
        icon: '🥇',
        color: '#FFD700',
        minLevel: 3,
        discount: 0.9,
        startTime: now - oneDay,
        endTime: now + 90 * oneDay,
        status: 'active'
      },
      {
        id: 5,
        title: '生日专属礼包',
        description: '生日当月领取200积分和生日优惠券',
        type: 'birthday',
        icon: '🎂',
        color: '#E91E63',
        minLevel: 1,
        pointsReward: 200,
        couponReward: { amount: 50, minAmount: 200 },
        startTime: now - oneDay,
        endTime: now + 365 * oneDay,
        status: 'active'
      },
      {
        id: 6,
        title: '邀请好友奖励',
        description: '每邀请一位好友注册，获得150积分',
        type: 'invite',
        icon: '👥',
        color: '#9C27B0',
        minLevel: 1,
        pointsReward: 150,
        startTime: now - oneDay,
        endTime: now + 180 * oneDay,
        status: 'active'
      }
    ];
  }

  isActivityValid(activity) {
    const now = Date.now();
    return activity.status === 'active' && 
           now >= activity.startTime && 
           now <= activity.endTime;
  }

  getActivitiesForLevel(userLevel) {
    try {
      let activities = this.getActivities();
      
      if (activities.length === 0) {
        activities = this.getMockActivities();
        this.saveActivities(activities);
      }

      return activities
        .filter(activity => this.isActivityValid(activity) && userLevel >= activity.minLevel)
        .sort((a, b) => a.minLevel - b.minLevel);
    } catch (error) {
      console.error('Get activities for level failed:', error);
      return [];
    }
  }
}

const memberActivityManager = new MemberActivityManager();
module.exports = memberActivityManager;
