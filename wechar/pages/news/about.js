
var app = getApp();
const util = require('../../utils/apihelper.js')
var WxParse = require('../../wxParse/wxParse.js');
const duration = 2000;
Page({
  data: {
  },

  eventManage: function (e) {
    app.wxq.callEvent(e);
  },
  onLoad: function (options) {
    if (options.type == 'post') {
      var link = unescape(options.link) ;
      var title = options.title;
      wx.request({
        url: link + '&LK_PLAT=2',
        success: function (result) { 
          var body = util.apihelper.getBody(result.data);
          body = body.replace(util.apihelper.reg, "div")
          self.setData({
            content: WxParse.wxParse('content', 'html', "<h3>" + title+"</h3>"+body, self, 5)
          }); 
        }
      })

    }else if (options.id == undefined || options.id <= 0) {
      wx.showModal({
        content: "数据丢失",
        confirmText: "确定",
        showCancel: false,
      })
      return;
    }
    var self = this;
    /** 注册事件源 */
    app.wxq.register(this);
    var pms = {
      service: util.apihelper.servers.m_others_new_detial,
      id: options.id
    };
    wx.request({
      url: util.apihelper.SetPms(pms),
      // data: {},
      success: function (result) {
        if (result.data.head.response_code == "SUCCESS") {
          if (result.data.body.id > 0) {
            var title = '<h4>' + result.data.body.title + '</h4>'
            self.setData({
              content: WxParse.wxParse('content', 'html', title + result.data.body.content, self, 5)
            })
          }
        }
      },
      fail: function ({ errMsg }) {
        wx.showModal({
          content: "请求失败：" + errMsg,
          confirmText: "确定",
          showCancel: false,
        })
      }
    });


  }
})