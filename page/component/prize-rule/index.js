var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.iphone == true) { this.setData({ iphone: 'iphone' }) }
  },
  buyNow: function (e) {
    wx.navigateTo({
      url: "/page/component/to-pay-order/index"
    })
  },
  goback: function (e) {
    wx.navigateBack({
      delta:1
    })
  }
})