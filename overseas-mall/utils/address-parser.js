class AddressParser {
  constructor() {
    this.provinces = [
      '北京', '天津', '河北', '山西', '内蒙古',
      '辽宁', '吉林', '黑龙江', '上海', '江苏',
      '浙江', '安徽', '福建', '江西', '山东',
      '河南', '湖北', '湖南', '广东', '广西',
      '海南', '重庆', '四川', '贵州', '云南',
      '西藏', '陕西', '甘肃', '青海', '宁夏',
      '新疆', '香港', '澳门', '台湾'
    ];
    
    this.provincePattern = new RegExp(`^(${this.provinces.join('|')})`);
    
    this.citySuffixes = ['市', '自治州', '盟', '地区'];
    this.districtSuffixes = ['区', '县', '市', '旗'];
    
    this.phonePattern = /1[3-9]\d{9}/;
    this.namePattern = /[\u4e00-\u9fa5]{2,4}/;
  }

  parse(addressText) {
    if (!addressText || typeof addressText !== 'string') {
      return {
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: ''
      };
    }

    const result = {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: addressText.trim()
    };

    result.phone = this.extractPhone(addressText);
    result.name = this.extractName(addressText);
    
    let cleanText = addressText
      .replace(result.phone, '')
      .replace(result.name, '')
      .trim();

    const region = this.extractRegion(cleanText);
    result.province = region.province;
    result.city = region.city;
    result.district = region.district;
    
    let detailText = cleanText;
    if (result.province) detailText = detailText.replace(result.province, '');
    if (result.city) detailText = detailText.replace(result.city, '');
    if (result.district) detailText = detailText.replace(result.district, '');
    
    result.detail = detailText.replace(/[,，\s]+/g, ' ').trim();

    return result;
  }

  extractPhone(text) {
    const match = text.match(this.phonePattern);
    return match ? match[0] : '';
  }

  extractName(text) {
    const phone = this.extractPhone(text);
    let cleanText = text.replace(phone, '');
    
    const separators = [',', '，', ' ', '\t', '\n'];
    let parts = [cleanText];
    
    for (const sep of separators) {
      if (cleanText.includes(sep)) {
        parts = cleanText.split(sep).filter(p => p.trim());
        break;
      }
    }

    for (const part of parts) {
      const trimmed = part.trim();
      if (this.namePattern.test(trimmed) && trimmed.length >= 2 && trimmed.length <= 4) {
        const hasDigit = /\d/.test(trimmed);
        const hasSpecial = /[省市区县镇村路号弄].*/.test(trimmed);
        if (!hasDigit && !hasSpecial) {
          return trimmed;
        }
      }
    }

    return '';
  }

  extractRegion(text) {
    const result = {
      province: '',
      city: '',
      district: ''
    };

    const provinceMatch = text.match(this.provincePattern);
    if (provinceMatch) {
      result.province = provinceMatch[1];
    }

    let remainingText = result.province ? text.substring(result.province.length) : text;

    for (const suffix of this.citySuffixes) {
      const cityPattern = new RegExp(`^(.+?${suffix})`);
      const cityMatch = remainingText.match(cityPattern);
      if (cityMatch) {
        result.city = cityMatch[1];
        remainingText = remainingText.substring(result.city.length);
        break;
      }
    }

    for (const suffix of this.districtSuffixes) {
      const districtPattern = new RegExp(`^(.+?${suffix})`);
      const districtMatch = remainingText.match(districtPattern);
      if (districtMatch) {
        result.district = districtMatch[1];
        break;
      }
    }

    return result;
  }

  validateAddress(address) {
    const errors = [];
    
    if (!address.name || address.name.length < 2) {
      errors.push('请输入姓名');
    }
    
    if (!address.phone || !this.phonePattern.test(address.phone)) {
      errors.push('请输入正确的手机号');
    }
    
    if (!address.province) {
      errors.push('请选择省份');
    }
    
    if (!address.detail || address.detail.length < 5) {
      errors.push('请输入详细地址');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new AddressParser();