
const tf = require('./test-framework.js');
const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = tf;

const memberManager = require('./member.js');
const addressParser = require('./address-parser.js');
const qnaManager = require('./qna.js');
const memberActivityManager = require('./member-activity.js');

describe('MemberManager Tests', () => {
  it('should return Bronze level for 0 points', () => {
    const level = memberManager.getLevelByPoints(0);
    expect(level.id).toBe(1);
    expect(level.name).toBe('Bronze');
  });

  it('should return Silver level for 1000 points', () => {
    const level = memberManager.getLevelByPoints(1000);
    expect(level.id).toBe(2);
    expect(level.name).toBe('Silver');
  });

  it('should return Gold level for 3000 points', () => {
    const level = memberManager.getLevelByPoints(3000);
    expect(level.id).toBe(3);
    expect(level.name).toBe('Gold');
  });

  it('should calculate discount correctly', () => {
    const level = memberManager.getLevelByPoints(3000);
    expect(level.discount).toBe(0.9);
  });

  it('should calculate progress to next level', () => {
    const progress = memberManager.getProgressToNextLevel(1500);
    expect(progress.progress).toBeGreaterThan(0);
    expect(progress.progress).toBeLessThan(100);
  });

  it('should calculate remaining points', () => {
    const progress = memberManager.getProgressToNextLevel(1500);
    expect(progress.remaining).toBe(1500);
  });

  it('should return 100% progress for max level', () => {
    const progress = memberManager.getProgressToNextLevel(20000);
    expect(progress.progress).toBe(100);
    expect(progress.remaining).toBe(0);
  });
});

describe('AddressParser Tests', () => {
  it('should parse empty address', () => {
    const result = addressParser.parse('');
    expect(result.name).toBe('');
    expect(result.phone).toBe('');
  });

  it('should extract phone number', () => {
    const result = addressParser.parse('张三 13812345678');
    expect(result.phone).toBe('13812345678');
  });

  it('should extract name', () => {
    const result = addressParser.parse('张三 13812345678');
    expect(result.name).toBe('张三');
  });

  it('should extract province', () => {
    const result = addressParser.parse('张三 13812345678 广东省深圳市南山区');
    expect(result.province).toBe('广东省');
  });

  it('should extract city', () => {
    const result = addressParser.parse('张三 13812345678 广东省深圳市南山区');
    expect(result.city).toBe('深圳市');
  });

  it('should extract district', () => {
    const result = addressParser.parse('张三 13812345678 广东省深圳市南山区');
    expect(result.district).toBe('南山区');
  });

  it('should extract detail address', () => {
    const result = addressParser.parse('张三 13812345678 广东省深圳市南山区科技园路123号');
    expect(result.detail).toContain('科技园路123号');
  });
});

describe('QnAManager Tests', () => {
  beforeAll(() => {
    wx.clearStorageSync();
  });

  it('should return empty list for new goods', () => {
    const list = qnaManager.getQnAList(999);
    expect(list).toHaveLength(0);
  });

  it('should add question successfully', () => {
    const result = qnaManager.addQuestion(1, '这个商品多少钱？');
    expect(result.success).toBeTruthy();
  });

  it('should get question list', () => {
    qnaManager.addQuestion(1, '这个商品多少钱？');
    const list = qnaManager.getQnAList(1);
    expect(list).toHaveLength(1);
  });

  it('should add answer successfully', () => {
    const addResult = qnaManager.addQuestion(2, '有货吗？');
    const questionId = addResult.data.id;
    const answerResult = qnaManager.addAnswer(questionId, '有货的，欢迎购买');
    expect(answerResult.success).toBeTruthy();
  });

  afterAll(() => {
    wx.clearStorageSync();
  });
});

describe('MemberActivityManager Tests', () => {
  beforeAll(() => {
    wx.clearStorageSync();
  });

  it('should get mock activities', () => {
    const activities = memberActivityManager.getActivitiesForLevel(1);
    expect(activities).toBeTruthy();
  });

  it('should have activities for Bronze level', () => {
    const activities = memberActivityManager.getActivitiesForLevel(1);
    expect(activities.length).toBeGreaterThan(0);
  });

  it('should participate activity successfully', () => {
    const activities = memberActivityManager.getActivitiesForLevel(1);
    if (activities.length > 0) {
      const result = memberActivityManager.participateActivity(activities[0].id);
      expect(result.success).toBeTruthy();
    }
  });

  it('should not allow double participation', () => {
    const activities = memberActivityManager.getActivitiesForLevel(1);
    if (activities.length > 0) {
      memberActivityManager.participateActivity(activities[0].id);
      const result = memberActivityManager.participateActivity(activities[0].id);
      expect(result.success).toBeFalsy();
    }
  });

  afterAll(() => {
    wx.clearStorageSync();
  });
});

tf.run();
