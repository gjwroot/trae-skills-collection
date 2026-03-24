const Security = {
  maskPhone(phone) {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  },

  maskEmail(email) {
    if (!email) return '';
    const atIndex = email.indexOf('@');
    if (atIndex <= 1) return email;
    return email.charAt(0) + '***' + email.substring(atIndex);
  },

  maskIdCard(idCard) {
    if (!idCard || idCard.length < 8) return idCard;
    return idCard.substring(0, 4) + '********' + idCard.substring(idCard.length - 4);
  },

  maskBankCard(bankCard) {
    if (!bankCard || bankCard.length < 8) return bankCard;
    return bankCard.substring(0, 4) + ' **** **** ' + bankCard.substring(bankCard.length - 4);
  },

  simpleHash(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  },

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  sanitizeHTML(html) {
    if (!html) return '';
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

module.exports = Security;
