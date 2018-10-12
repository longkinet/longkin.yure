//index.js
//获取应用实例 
var app = getApp();

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

  /**
   * 用户点击右上角分享 转发 事件
   */
  onShareAppMessage: function() {

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    app.wxQuery.register(this); 

    app.Ini();
    var self = this;
    var userinfo = wx.getStorageSync('userinfo') || null;
    self.setData({
      userInfo: userinfo
    });
 
    /*
      加载首页精彩活动/banner 配置参数
    */
    var pms = {
      service: app.service.m_act_wonderful_list,
      pagesize: '4',
      page: '1'
    };

    /*
    请求接口
    */
    wx.request({
      url: app.apihelper.SetPms(pms),
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(result) {
        if (result != undefined && result != null && result != '' && result.data.head.response_code == "SUCCESS") {
          self.setData({
            banners: result.data.body.activitywonderfulactinfotextend
          });
        }
      },
      fail: function(ex) {}
    })
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    var _this = this;
    app.wxQuery.register(this);
    app.$('paymentbtn').bind('tap', function (e) {
      app.alert(
        "确定去支付？",
        function () {
          wx.navigateTo({
            url: "/pages/payment/pay/pay"
          });
        },
        "支付提示",
        function () {
          app.alert("拉基吧倒")
        }
      )

    });

  },

  userinfobtnclick: function() {
    //已封装 消息弹窗 (模态窗) app.alert("消息内容" , 点击确定执行方法 , “消息标题” , 点击取消执行方法)
    app.alert(
      "content123",
      function() {
        console.info(app.globalData.userInfo);
      },
      "传入提示",
      function() {
        app.alert("消息内容")
      }
    )
  },
  banner_gotolink: function(e) {
    var self = this;
    var link = escape(e.currentTarget.dataset.link);
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: "/pages/news/about/about?type=post&link=" + link + "&title=" + title
    })
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  translate: function() {
    setInterval(function() {
      this.animation.translate(0, 50).step()
      this.setData({
        animation: this.animation.export()
      })
    }, 2000);
    this.animation.translate(0, 50).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
})
var indexevent = {
  query :wx.createSelectorQuery(),
  paymentbtnclick: function(e) {
    app.alert(
      "确定去支付？",
      function() {
        wx.navigateTo({
          url: "/pages/payment/pay/pay"
        });
      },
      "支付提示",
      function() {
        app.alert("拉基吧倒")
      }
    )

  }

}