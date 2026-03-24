class CustomerServiceManager {
  constructor() {
    this.messagesKey = 'cs_messages';
    this.quickReplies = [
      '查询订单',
      '退换货',
      '物流咨询',
      '优惠券使用',
      '商品咨询',
      '其他问题'
    ];
    this.autoReplies = {
      '查询订单': '您好！请提供您的订单号，我来帮您查询订单状态。',
      '退换货': '您好！关于退换货，请您先确认商品是否符合退换货条件：\n1. 商品保持全新未使用\n2. 包装完整\n3. 在收货后7天内申请\n\n符合条件后，您可以在订单详情页申请退换货。',
      '物流咨询': '您好！您可以在订单详情页查看实时物流信息。如果物流超过3天未更新，请告诉我订单号，我来帮您跟进。',
      '优惠券使用': '您好！优惠券使用说明：\n1. 每个订单限用一张优惠券\n2. 满足优惠券最低消费金额\n3. 在结算页面选择使用\n\n如有问题，请提供优惠券详情。',
      '商品咨询': '您好！请告诉我具体的商品名称或商品ID，我来为您详细介绍。',
      '其他问题': '您好！请详细描述您的问题，我会尽力为您解答。',
      'default': '您好！人工客服工作时间为 9:00-21:00。\n\n您可以先尝试以下快捷问题，或描述您的具体问题。'
    };
  }

  getMessages() {
    try {
      return wx.getStorageSync(this.messagesKey) || [];
    } catch (error) {
      console.error('Get customer service messages failed:', error);
      return [];
    }
  }

  saveMessages(messages) {
    try {
      wx.setStorageSync(this.messagesKey, messages);
      return true;
    } catch (error) {
      console.error('Save customer service messages failed:', error);
      return false;
    }
  }

  addMessage(content, type = 'user') {
    try {
      const messages = this.getMessages();
      const message = {
        id: this.generateMessageId(),
        content,
        type,
        timestamp: Date.now(),
        timestampISO: new Date().toISOString()
      };
      
      messages.push(message);
      
      if (messages.length > 100) {
        messages.shift();
      }
      
      this.saveMessages(messages);
      return message;
    } catch (error) {
      console.error('Add customer service message failed:', error);
      return null;
    }
  }

  generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  sendMessage(content) {
    const userMessage = this.addMessage(content, 'user');
    
    setTimeout(() => {
      const autoReply = this.getAutoReply(content);
      this.addMessage(autoReply, 'system');
    }, 500 + Math.random() * 1000);
    
    return userMessage;
  }

  getAutoReply(userMessage) {
    for (const key in this.autoReplies) {
      if (userMessage.includes(key)) {
        return this.autoReplies[key];
      }
    }
    
    if (this.autoReplies[userMessage]) {
      return this.autoReplies[userMessage];
    }
    
    return this.autoReplies['default'];
  }

  getQuickReplies() {
    return this.quickReplies;
  }

  clearMessages() {
    try {
      wx.removeStorageSync(this.messagesKey);
      return true;
    } catch (error) {
      console.error('Clear customer service messages failed:', error);
      return false;
    }
  }

  openCustomerService() {
    try {
      wx.showModal({
        title: '客服中心',
        content: '正在连接客服...\n\n快捷问题：\n' + this.quickReplies.join('\n'),
        confirmText: '联系客服',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.showServiceOptions();
          }
        }
      });
    } catch (error) {
      console.error('Open customer service failed:', error);
    }
  }

  showServiceOptions() {
    wx.showActionSheet({
      itemList: ['在线客服', '电话客服', '留言反馈'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.openOnlineService();
            break;
          case 1:
            this.callPhoneService();
            break;
          case 2:
            this.openFeedback();
            break;
        }
      }
    });
  }

  openOnlineService() {
    wx.showToast({
      title: '正在连接客服...',
      icon: 'loading',
      duration: 1500
    });
    
    setTimeout(() => {
      wx.showModal({
        title: '在线客服',
        content: '欢迎咨询！\n\n工作时间：9:00-21:00\n\n请描述您的问题，我们会尽快为您解答。',
        showCancel: false,
        confirmText: '开始咨询'
      });
    }, 1500);
  }

  callPhoneService() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567',
      success: () => {
        console.log('Calling customer service...');
      },
      fail: (error) => {
        console.error('Make phone call failed:', error);
        wx.showToast({
          title: '拨打电话失败',
          icon: 'none'
        });
      }
    });
  }

  openFeedback() {
    wx.showToast({
      title: '留言功能开发中',
      icon: 'none'
    });
  }

  getUnreadCount() {
    try {
      const messages = this.getMessages();
      const lastRead = wx.getStorageSync('cs_last_read') || 0;
      
      return messages.filter(msg => 
        msg.type === 'system' && msg.timestamp > lastRead
      ).length;
    } catch (error) {
      console.error('Get unread count failed:', error);
      return 0;
    }
  }

  markAsRead() {
    try {
      wx.setStorageSync('cs_last_read', Date.now());
      return true;
    } catch (error) {
      console.error('Mark as read failed:', error);
      return false;
    }
  }
}

module.exports = new CustomerServiceManager();