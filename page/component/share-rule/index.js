var app = getApp();
var config = require('../../../config');
var request = require('../../../util/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareAmount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.iphone == true) { this.setData({ iphone: 'iphone' }) };
    var goodsDetail = wx.getStorageSync('buyNowInfo');
    this.setData({
      shareAmount: goodsDetail.shareAmount
    })
  },

  onShow: function () {
    var that = this;
    var goodsDetail = wx.getStorageSync('buyNowInfo');
    request.httpGet({
      url: config.getWxacode,
      data: { id: goodsDetail.id},
      success: function (data) {
        if (data.success) {
          that.setData({
            wxacodeUrl: data.obj.wxacodeUrl,
            nickName: data.obj.nickName
          })
        }
      }
    });
  },

  onShareAppMessage: function () {
    var goodsDetail = wx.getStorageSync('buyNowInfo');
    return {
      title: goodsDetail.title,
      imageUrl: goodsDetail.icon,
      path: 'page/component/index?id=' + goodsDetail.id + '&recommend=' + app.globalData.uid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

})