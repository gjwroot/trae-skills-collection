class QnAManager {
  constructor() {
    this.qnaKey = 'qna_list';
    this.maxQnAsPerGoods = 100;
  }

  getQnAList(goodsId) {
    try {
      const allQnAs = this.getAllQnAs();
      return allQnAs.filter(item => item.goodsId === goodsId).sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Get Q&A list failed:', error);
      return [];
    }
  }

  getAllQnAs() {
    try {
      return wx.getStorageSync(this.qnaKey) || [];
    } catch (error) {
      console.error('Get all Q&As failed:', error);
      return [];
    }
  }

  saveQnAList(qnaList) {
    try {
      wx.setStorageSync(this.qnaKey, qnaList);
      return true;
    } catch (error) {
      console.error('Save Q&A list failed:', error);
      return false;
    }
  }

  addQuestion(goodsId, question, userId = 'anonymous') {
    try {
      const qnaList = this.getAllQnAs();
      
      const goodsQnAs = qnaList.filter(item => item.goodsId === goodsId);
      if (goodsQnAs.length >= this.maxQnAsPerGoods) {
        return { success: false, message: '该商品问答数量已达上限' };
      }

      const newQuestion = {
        id: Date.now(),
        goodsId,
        type: 'question',
        content: question,
        userId,
        userName: userId === 'anonymous' ? '匿名用户' : '用户' + userId.slice(-4),
        createdAt: Date.now(),
        answers: [],
        isAnswered: false
      };

      qnaList.push(newQuestion);
      this.saveQnAList(qnaList);

      return { success: true, message: '提问成功', data: newQuestion };
    } catch (error) {
      console.error('Add question failed:', error);
      return { success: false, message: '提问失败' };
    }
  }

  addAnswer(questionId, answer, merchantId = 'merchant') {
    try {
      const qnaList = this.getAllQnAs();
      const questionIndex = qnaList.findIndex(item => item.id === questionId);

      if (questionIndex === -1) {
        return { success: false, message: '问题不存在' };
      }

      const newAnswer = {
        id: Date.now(),
        content: answer,
        userId: merchantId,
        userName: '商家客服',
        isMerchant: true,
        createdAt: Date.now()
      };

      qnaList[questionIndex].answers.push(newAnswer);
      qnaList[questionIndex].isAnswered = true;
      
      this.saveQnAList(qnaList);

      return { success: true, message: '回答成功', data: newAnswer };
    } catch (error) {
      console.error('Add answer failed:', error);
      return { success: false, message: '回答失败' };
    }
  }

  deleteQuestion(questionId) {
    try {
      let qnaList = this.getAllQnAs();
      const initialLength = qnaList.length;
      qnaList = qnaList.filter(item => item.id !== questionId);
      
      if (qnaList.length < initialLength) {
        this.saveQnAList(qnaList);
        return { success: true, message: '删除成功' };
      }
      
      return { success: false, message: '问题不存在' };
    } catch (error) {
      console.error('Delete question failed:', error);
      return { success: false, message: '删除失败' };
    }
  }

  getUnansweredCount() {
    try {
      const qnaList = this.getAllQnAs();
      return qnaList.filter(item => !item.isAnswered).length;
    } catch (error) {
      console.error('Get unanswered count failed:', error);
      return 0;
    }
  }

  getMockQnAs(goodsId) {
    const mockQuestions = [
      '这个商品质量怎么样？',
      '发货快吗？',
      '支持退换货吗？',
      '有什么颜色可选？',
      '尺码标准吗？'
    ];

    const mockAnswers = [
      '您好，我们的商品质量有保障，支持7天无理由退换货。',
      '通常24小时内发货，3-5个工作日送达。',
      '支持7天无理由退换货，请保持商品完好。',
      '目前有多种颜色可选，详情请查看商品规格。',
      '尺码标准，建议按平时穿着的尺码购买。'
    ];

    const qnaList = [];
    for (let i = 0; i < mockQuestions.length; i++) {
      qnaList.push({
        id: Date.now() + i,
        goodsId,
        type: 'question',
        content: mockQuestions[i],
        userId: 'mock_user_' + i,
        userName: '用户' + (1000 + i),
        createdAt: Date.now() - (mockQuestions.length + i) * 86400000,
        answers: [{
          id: Date.now() + i + 1000,
          content: mockAnswers[i],
          userId: 'merchant',
          userName: '商家客服',
          isMerchant: true,
          createdAt: Date.now() - (mockQuestions.length + i) * 86400000 + 3600000
        }],
        isAnswered: true
      });
    }
    return qnaList;
  }
}

const qnaManager = new QnAManager();
module.exports = qnaManager;
