const util = require('../../utils/util.js');

Page({
  data: {
    faqList: [
      {
        id: 1,
        question: 'How to track my order?',
        answer: 'Go to "Mine" > "My Orders" > Select your order to view tracking information. You can also use the tracking number on the carrier\'s website.',
        expanded: false
      },
      {
        id: 2,
        question: 'What payment methods do you accept?',
        answer: 'We accept credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely.',
        expanded: false
      },
      {
        id: 3,
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 7-15 business days. Express shipping takes 3-7 business days. Delivery times may vary depending on your location.',
        expanded: false
      },
      {
        id: 4,
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for most items. Items must be unused and in original packaging. Some items like swimwear and underwear are non-returnable for hygiene reasons.',
        expanded: false
      },
      {
        id: 5,
        question: 'How do I cancel my order?',
        answer: 'You can cancel your order within 1 hour of placing it. Go to "My Orders" > Select order > Click "Cancel Order". Orders that have been shipped cannot be cancelled.',
        expanded: false
      }
    ]
  },

  onSearch(e) {
    const keyword = e.detail.value.toLowerCase();
    const faqList = this.data.faqList.map(item => ({
      ...item,
      hidden: keyword && !item.question.toLowerCase().includes(keyword) && !item.answer.toLowerCase().includes(keyword)
    }));
    this.setData({ faqList });
  },

  toggleFaq(e) {
    const id = e.currentTarget.dataset.id;
    const faqList = this.data.faqList.map(item => {
      if (item.id === id) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    this.setData({ faqList });
  },

  showHelp(e) {
    const type = e.currentTarget.dataset.type;
    const helpContent = {
      order: 'For order-related issues, please check "My Orders" or contact customer service.',
      payment: 'We accept various payment methods including credit cards, PayPal, Apple Pay, and Google Pay.',
      shipping: 'Standard shipping: 7-15 days. Express shipping: 3-7 days. Free shipping on orders over $99.',
      return: '30-day return policy. Items must be unused and in original packaging.'
    };
    
    wx.showModal({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: helpContent[type],
      showCancel: false
    });
  },

  contactCustomer() {
    wx.showModal({
      title: 'Online Chat',
      content: 'Our customer service team is available 24/7. Start a chat session?',
      success: (res) => {
        if (res.confirm) {
          util.showToast('Connecting...');
        }
      }
    });
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: '18001234567',
      fail: () => {
        util.showToast('Unable to make call');
      }
    });
  },

  sendEmail() {
    wx.setClipboardData({
      data: 'support@overseasmall.com',
      success: () => {
        util.showSuccess('Email copied');
      }
    });
  },

  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  }
});
