var app = getApp();
var config = require('../../../config');
var request = require('../../../util/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    minAmount: 0,
    serviceAmtPer: 0,
    serviceAmt: 0
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
      url: config.getWithdrawConfig,
      success: function (data) {
        if (data.success) {
          that.setData({
            amount: data.obj.amount,
            minAmount: data.obj.minAmount,
            serviceAmtPer: data.obj.serviceAmtPer,
            serviceAmt: data.obj.serviceAmt
          })
          if (data.obj.withdrawLog) {
            that.setData({
              realName: data.obj.withdrawLog.realName,
              phone: data.obj.withdrawLog.phone
            })
          }
        }
      }
    });
  },

  bindSave: function (e) {
    var that = this;
    var amount = e.detail.value.amount;
    var realName = e.detail.value.realName;
    var phone = e.detail.value.phone;

    if (amount == '' || amount < that.data.minAmount) {
      wx.showModal({
        title: '错误',
        content: '提现金额' + that.data.minAmount+'元起',
        showCancel: false
      })
      return
    }
    if (amount > that.data.amount) {
      wx.showModal({
        title: '错误',
        content: '提现金额不能超过' + that.data.amount+'元',
        showCancel: false
      })
      return
    }
    if (realName == '') {
      wx.showModal({
        title: '错误',
        content: '请填写真实姓名',
        showCancel: false
      })
      return
    }
    if (phone == '') {
      wx.showModal({
        title: '错误',
        content: '请填写真实手机号',
        showCancel: false
      })
      return
    }
    request.httpPost({
      url: config.applyWithdraw,
      data: {
        amount: amount,
        realName: realName,
        phone: phone
      },
      success: function (data) {
        if (data.success) {
          wx.showModal({
            title: '成功',
            content: '您的提现申请已提交，等待财务打款',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '错误',
            content: data.msg,
            showCancel: false
          })
        }
      }
    })
  }
})