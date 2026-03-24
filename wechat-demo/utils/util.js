// 格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 格式化数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示加载中
const showLoading = title => {
  wx.showLoading({
    title: title || '加载中...',
    mask: true
  })
}

// 隐藏加载中
const hideLoading = () => {
  wx.hideLoading()
}

// 显示提示
const showToast = (title, icon = 'none') => {
  wx.showToast({
    title: title,
    icon: icon,
    duration: 2000
  })
}

// 显示成功提示
const showSuccess = title => {
  showToast(title, 'success')
}

// 显示错误提示
const showError = title => {
  showToast(title, 'none')
}

// 显示确认框
const showConfirm = (content, title = '提示') => {
  return new Promise((resolve) => {
    wx.showModal({
      title: title,
      content: content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

module.exports = {
  formatTime,
  showLoading,
  hideLoading,
  showToast,
  showSuccess,
  showError,
  showConfirm
}