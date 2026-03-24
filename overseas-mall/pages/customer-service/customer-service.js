const util = require('../../utils/util.js');

Page({
  data: {
    messageList: [],
    inputText: '',
    scrollTop: 0,
    isTyping: false
  },

  onLoad() {
    this.initMessageList();
  },

  initMessageList() {
    const welcomeMessage = {
      id: Date.now(),
      type: 'text',
      content: '您好！欢迎咨询，有什么可以帮助您的吗？',
      isSelf: false,
      time: new Date().toLocaleTimeString()
    };
    
    const quickQuestions = {
      id: Date.now() + 1,
      type: 'quick-questions',
      content: '',
      isSelf: false,
      time: ''
    };

    this.setData({
      messageList: [welcomeMessage, quickQuestions]
    });

    this.scrollToBottom();
  },

  scrollToBottom() {
    setTimeout(() => {
      this.setData({
        scrollTop: 99999
      });
    }, 100);
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  sendMessage() {
    const text = this.data.inputText.trim();
    if (!text) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'text',
      content: text,
      isSelf: true,
      time: new Date().toLocaleTimeString()
    };

    const newMessageList = [...this.data.messageList, userMessage];
    this.setData({
      messageList: newMessageList,
      inputText: '',
      isTyping: true
    });

    this.scrollToBottom();

    this.simulateReply(text);
  },

  simulateReply(userText) {
    setTimeout(() => {
      let replyContent = '非常感谢您的咨询，我们的客服人员会尽快与您联系。';
      
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('订单') || lowerText.includes('order')) {
        replyContent = '关于订单问题，您可以在"我的订单"中查看订单详情，如有问题请提供订单号，我们会尽快为您处理。';
      } else if (lowerText.includes('物流') || lowerText.includes('shipping')) {
        replyContent = '关于物流问题，通常订单会在24小时内发货，3-5个工作日内送达。您可以在订单详情中查看物流信息。';
      } else if (lowerText.includes('退款') || lowerText.includes('refund')) {
        replyContent = '关于退款问题，您可以在订单详情中申请退款，我们会在1-3个工作日内处理您的申请。';
      } else if (lowerText.includes('商品') || lowerText.includes('product')) {
        replyContent = '关于商品问题，您可以在商品详情页查看商品信息和规格，如有其他问题请随时咨询。';
      } else if (lowerText.includes('你好') || lowerText.includes('hello') || lowerText.includes('hi')) {
        replyContent = '您好！很高兴为您服务，请问有什么可以帮助您的？';
      } else if (lowerText.includes('谢谢') || lowerText.includes('thank')) {
        replyContent = '不客气！如果还有其他问题，欢迎随时咨询。祝您购物愉快！';
      }

      const replyMessage = {
        id: Date.now(),
        type: 'text',
        content: replyContent,
        isSelf: false,
        time: new Date().toLocaleTimeString()
      };

      this.setData({
        messageList: [...this.data.messageList, replyMessage],
        isTyping: false
      });

      this.scrollToBottom();
    }, 1500);
  },

  onQuickQuestionTap(e) {
    const question = e.currentTarget.dataset.question;
    this.setData({
      inputText: question
    });
    this.sendMessage();
  },

  getQuickQuestions() {
    return [
      '订单多久发货？',
      '如何申请退款？',
      '物流信息在哪查？',
      '商品有问题怎么办？'
    ];
  },

  onSendTap() {
    this.sendMessage();
  },

  onImageTap() {
    util.showToast('图片功能开发中');
  },

  onVoiceTap() {
    util.showToast('语音功能开发中');
  }
});
