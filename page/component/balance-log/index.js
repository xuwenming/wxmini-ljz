var app = getApp();
var config = require('../../../config');
var request = require('../../../util/request');

var currPage = 1, rows = 20, balanceId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balanceLogs: null,
    hasMore: false,
    noDataMsg: '没有相关的财产明细哦~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.iphone == true) { this.setData({ iphone: 'iphone' }) }
    balanceId = options.balanceId;
    currPage = 1;
    this.getBalanceLogs();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getBalanceLogs: function (isRefresh) {
    var self = this;
    request.httpGet({
      url: config.queryBalanceLogPage,
      data: { balanceId: balanceId, page: currPage, rows: rows },
      success: function (data) {
        console.log(data)
        if (data.success) {
          if (data.obj.rows.length >= rows) {
            currPage++;
            self.setData({
              hasMore: true
            });
          } else {
            self.setData({
              hasMore: false
            });
          }

          var balanceLogs = self.data.balanceLogs;
          if (isRefresh) balanceLogs = data.obj.rows;
          else balanceLogs = balanceLogs == null ? data.obj.rows : balanceLogs.concat(data.obj.rows);
          self.setData({
            balanceLogs: balanceLogs
          });
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currPage = 1;
    this.getBalanceLogs(true);
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getBalanceLogs();
    } 
  }
})