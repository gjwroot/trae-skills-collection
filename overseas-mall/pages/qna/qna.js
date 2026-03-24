const qnaManager = require('../../utils/qna.js');
const util = require('../../utils/util.js');

Page({
  data: {
    goodsId: null,
    goodsName: '',
    qnaList: [],
    loading: true,
    showAskModal: false,
    newQuestion: '',
    userInfo: null
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ goodsId: parseInt(options.id) });
    }
    if (options.name) {
      this.setData({ goodsName: decodeURIComponent(options.name) });
    }
    this.loadQnAList();
  },

  loadQnAList() {
    this.setData({ loading: true });
    
    setTimeout(() => {
      let qnaList = qnaManager.getQnAList(this.data.goodsId);
      
      if (qnaList.length === 0) {
        qnaList = qnaManager.getMockQnAs(this.data.goodsId);
      }
      
      this.setData({
        qnaList,
        loading: false
      });
    }, 300);
  },

  showAskModal() {
    this.setData({
      showAskModal: true
    });
  },

  hideAskModal() {
    this.setData({
      showAskModal: false,
      newQuestion: ''
    });
  },

  onQuestionInput(e) {
    this.setData({
      newQuestion: e.detail.value
    });
  },

  submitQuestion() {
    const question = this.data.newQuestion.trim();
    
    if (!question) {
      util.showToast('请输入问题');
      return;
    }

    if (question.length < 5) {
      util.showToast('问题至少5个字符');
      return;
    }

    const result = qnaManager.addQuestion(this.data.goodsId, question);
    
    if (result.success) {
      util.showSuccess('提问成功');
      this.hideAskModal();
      this.loadQnAList();
    } else {
      util.showToast(result.message);
    }
  },

  deleteQuestion(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个问题吗？',
      success: (res) => {
        if (res.confirm) {
          const result = qnaManager.deleteQuestion(id);
          if (result.success) {
            util.showSuccess('删除成功');
            this.loadQnAList();
          } else {
            util.showToast(result.message);
          }
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: this.data.goodsName || '商品问答',
      path: `/pages/qna/qna?id=${this.data.goodsId}&name=${encodeURIComponent(this.data.goodsName)}`
    };
  }
});
