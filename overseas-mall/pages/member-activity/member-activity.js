const memberActivityManager = require('../../utils/member-activity.js');
const memberManager = require('../../utils/member.js');
const util = require('../../utils/util.js');

Page({
  data: {
    userInfo: null,
    memberLevel: null,
    memberPoints: 0,
    activities: [],
    loading: true,
    activeTab: 'all'
  },

  onLoad() {
    this.loadUserInfo();
    this.loadActivities();
  },

  onShow() {
    this.loadUserInfo();
    this.loadActivities();
  },

  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo') || {};
      const points = userInfo.points || 0;
      const memberLevel = memberManager.getLevelByPoints(points);
      
      this.setData({
        userInfo,
        memberLevel,
        memberPoints: points
      });
    } catch (error) {
      console.error('Load user info failed:', error);
    }
  },

  loadActivities() {
    this.setData({ loading: true });
    
    setTimeout(() => {
      const activities = memberActivityManager.getActivitiesForLevel(this.data.memberLevel.id);
      
      const activitiesWithStatus = activities.map(activity => {
        const activityData = {
          ...activity,
          hasParticipated: memberActivityManager.hasParticipated(activity.id)
        };
        
        if (activityData.discount) {
          activityData.discountDisplay = (activityData.discount * 10).toFixed(0);
        }
        
        return activityData;
      });
      
      this.setData({
        activities: activitiesWithStatus,
        loading: false
      });
    }, 300);
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  participateActivity(e) {
    const activity = e.currentTarget.dataset.activity;
    const activityId = activity.id;
    
    if (memberActivityManager.hasParticipated(activityId)) {
      util.showToast('已参与过该活动');
      return;
    }

    wx.showModal({
      title: '确认参与',
      content: `确定要参与"${activity.title}"活动吗？`,
      success: (res) => {
        if (res.confirm) {
          const result = memberActivityManager.participateActivity(activityId);
          
          if (result.success) {
            this.grantRewards(activity);
            util.showSuccess('参与成功');
            this.loadActivities();
          } else {
            util.showToast(result.message);
          }
        }
      }
    });
  },

  grantRewards(activity) {
    try {
      let userInfo = wx.getStorageSync('userInfo') || {};
      
      if (activity.pointsReward) {
        userInfo.points = (userInfo.points || 0) + activity.pointsReward;
        
        let historyList = wx.getStorageSync('pointsHistory') || [];
        historyList.unshift({
          id: Date.now(),
          title: `参与活动：${activity.title}`,
          time: new Date().toLocaleString(),
          points: activity.pointsReward,
          type: 'earn'
        });
        
        if (historyList.length > 50) {
          historyList = historyList.slice(0, 50);
        }
        
        wx.setStorageSync('pointsHistory', historyList);
      }
      
      wx.setStorageSync('userInfo', userInfo);
      this.loadUserInfo();
    } catch (error) {
      console.error('Grant rewards failed:', error);
    }
  },

  viewActivityDetail(e) {
    const activity = e.currentTarget.dataset.activity;
    wx.showModal({
      title: activity.title,
      content: activity.description,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  onShareAppMessage() {
    return {
      title: '会员专属活动',
      path: '/pages/member-activity/member-activity'
    };
  }
});
