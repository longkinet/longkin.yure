//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/apihelper.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    banners: {}, 
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var self = this;
    /*
      加载首页精彩活动/banner 配置参数
    */
    var pms = {
      service: util.serverce.m_act_wonderful_list,
      pagesize: '2',
      page: '1'
    };

    /*
    请求接口
    */
    wx.request({
      url: util.apihelper.SetPms(pms), 
      method: 'POST',
      header: {'content-type': 'application/json'},
      success: function (result) {
        if (result != undefined && result != null && result != '' && result.data.head.response_code == "SUCCESS") {
          self.setData({ banners: result.data.body.activitywonderfulactinfotextend });
        }
      },
      fail: function (ex) {
      }
    })
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  banner_gotolink: function (e) {
    var self = this;

    var link = escape(e.currentTarget.dataset.link);
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({ url: "/pages/news/about/about?type=post&link=" + link + "&title=" + title})
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  translate: function () {
    setInterval(function () {
      this.animation.translate(0, 50).step()
      this.setData({ animation: this.animation.export() })
    }, 2000);
    this.animation.translate(0, 50).step()
    this.setData({ animation: this.animation.export() })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  }
})
