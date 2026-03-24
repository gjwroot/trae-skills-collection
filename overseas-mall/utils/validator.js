const util = require('./util.js');

class Validator {
  constructor() {
    this.errors = [];
  }

  validatePhone(phone, fieldName = 'Phone number') {
    if (!phone) {
      this.errors.push(`${fieldName} is required`);
      return false;
    }
    if (!util.isValidPhone(phone)) {
      this.errors.push(`${fieldName} format is invalid`);
      return false;
    }
    return true;
  }

  validateEmail(email, fieldName = 'Email') {
    if (!email) {
      this.errors.push(`${fieldName} is required`);
      return false;
    }
    if (!util.isValidEmail(email)) {
      this.errors.push(`${fieldName} format is invalid`);
      return false;
    }
    return true;
  }

  validatePassword(password, fieldName = 'Password') {
    if (!password) {
      this.errors.push(`${fieldName} is required`);
      return false;
    }
    if (password.length < 6) {
      this.errors.push(`${fieldName} must be at least 6 characters`);
      return false;
    }
    return true;
  }

  validateConfirmPassword(password, confirmPassword, fieldName = 'Confirm password') {
    if (!confirmPassword) {
      this.errors.push(`${fieldName} is required`);
      return false;
    }
    if (password !== confirmPassword) {
      this.errors.push('Passwords do not match');
      return false;
    }
    return true;
  }

  validateCode(code, fieldName = 'Verification code') {
    if (!code) {
      this.errors.push(`${fieldName} is required`);
      return false;
    }
    if (code.length !== 6) {
      this.errors.push(`${fieldName} must be 6 digits`);
      return false;
    }
    return true;
  }

  validateUsername(username, fieldName = 'Username') {
    if (!username) {
      this.errors.push(`${fieldName} is required`);
      return false;
    }
    if (username.length < 2 || username.length > 20) {
      this.errors.push(`${fieldName} must be 2-20 characters`);
      return false;
    }
    return true;
  }

  validateAddress(address, fieldName = 'Address') {
    if (!address) {
      this.errors.push(`${fieldName} is required`);
      return false;
    }
    if (address.length < 5) {
      this.errors.push(`${fieldName} is too short`);
      return false;
    }
    return true;
  }

  getErrors() {
    return this.errors;
  }

  getFirstError() {
    return this.errors[0] || null;
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  clearErrors() {
    this.errors = [];
  }

  showFirstError() {
    const error = this.getFirstError();
    if (error) {
      util.showError(error);
    }
    return error;
  }
}

module.exports = new Validator();
