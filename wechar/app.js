//app.js
var wxQuery = require('./utils/wxquery.js');
//var apihelper = require('./utils/apihelper.js')
App({ /** 全局引入wxQuery */
  wxQuery: wxQuery,
  $: wxQuery.$,
  apihelper: require('./utils/apihelper.js').apihelper,
  hexMD5: require('./utils/apihelper.js').hexMD5,
  service: require('./utils/service').service,
  systemPms: require('./utils/service').systemPms,
  systemConfig: require('./utils/service').systemConfig,
  config: require('./utils/config').config,
  onLaunch: function() {
    var self = this
    //本地存储
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  alert: function (content, confirm_fun, title, cancel_fun) {    
    wx.showModal({
      title: title==undefined?"":title,
      content: content,
      showCancel: (confirm_fun != undefined || cancel_fun!=undefined),
      confirmText: "确定",
      success: function (res) {
        //点击确定按钮
        if (res.confirm && confirm_fun!=undefined) {
          confirm_fun();
        } else if (cancel_fun != undefined){
          cancel_fun();
        }
      }
    })
  },
  Ini: function() {
    var self = this;
    var userinfo = wx.getStorageSync('userinfo') || null;
    if (userinfo == null) {
      //用code 换 openid  调用接口
      /*
       // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })


      wx.login({
        success: function (res) {
          if (res.code) {
            //start
            wx.request({
              url: '',
              data: {
                code: res.code,
              },
              success: function (res) {
                console.log(res.data)
                self.globalData.openid ="";// res.data;
              }
            })
            //end
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })*/

      // 在没有 open-type=getUserInfo 版本的兼容处理
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            // 必须是在用户已经授权的情况下调用
            wx.getUserInfo({
              success: function(res) {
                var userinfo = {
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender, //性别 0：未知、1：男、2：女
                  province: res.userInfo.province,
                  city: res.userInfo.city,
                  country: res.userInfo.country
                }
                wx.setStorageSync('userinfo', userinfo);
                self.globalData.userInfo = res.userInfo;

              }
            });
          }
        }
      })
    }
    return self.globalData.userInfo;
  },
  globalData: {
    userInfo: wx.getStorageSync('userinfo') || null,
    openid: '321231'
  }
})