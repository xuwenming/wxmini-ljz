var app = getApp();
var wxpay = require('../../../../util/pay');

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
    this.setData({
      orderId: options.orderId,
      totalPrice: options.totalPrice,
      contactPeople: options.contactPeople,
      contactPhone: options.contactPhone,
      deliveryAddress: options.deliveryAddress
    });
  },

  toPayTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var totalPrice = e.currentTarget.dataset.money;
    
    wxpay.wxpay(totalPrice, orderId, "/pages/order-list/index?currentType=1&share=1");
  },

  closeOreder: function () {
    wx.showModal({
      title: '',
      content: '优惠不等人，商品一旦错过就不存在了哦～',
      cancelText: '忍痛放弃',
      cancelColor: '#999999',
      confirmText: '我在想想',
      confirmColor: '#b5272d',
      success: function (res) {
        if (res.cancel) {
          wx.redirectTo({
            url: "/page/component/index"
          });
        }
      }
    })
  }
})