//app.js
var wxQuery = require('./utils/wxquery.js');
//var apihelper = require('./utils/apihelper.js')
App({ /** 全局引入wxQuery */
  wxQuery: wxQuery,
  apihelper: require('./utils/apihelper.js').apihelper,
  hexMD5: require('./utils/apihelper.js').hexMD5,
  service: require('./utils/service').service,
  systemPms: require('./utils/service').systemPms,
  systemConfig: require('./utils/service').systemConfig,
  config: require('./utils/config').config,
  $: wxQuery.$,
  onLaunch: function() {
    var self = this
    //本地存储
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

          // 必须是在用户已经授权的情况下调用
          wx.getUserInfo({
            success: function(res) {
              self.globalData.userInfo = res.userInfo
              //var nickName = userInfo.nickName
              //var avatarUrl = userInfo.avatarUrl
              //var gender = userInfo.gender //性别 0：未知、1：男、2：女
              //var province = userInfo.province
              //var city = userInfo.city
              //var country = userInfo.country
            }
          });
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})