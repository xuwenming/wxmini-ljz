var app = getApp();
var config = require('../../../config');
var request = require('../../../util/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.iphone == true) { this.setData({ iphone: 'iphone' }) }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    request.httpGet({
      url: config.getBalance,
      success: function (data) {
        if (data.success) {
          that.setData({
            amount: data.obj.amount,
            balanceId: data.obj.id
          })
        }
      }
    });
  }
})