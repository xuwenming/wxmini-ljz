var app = getApp();
var config = require('../../config');
var request = require('../../util/request');
var currPage = 1, rows = 5;

Page({
  data: {
    autoplay: true,
    interval: 10000,
    duration: 500,
    goodsDetail: {},
    prizeLogs: [],
    swiperCurrent: 0,
    wxlogin: true,
    hasMore: false
  },
  onLoad: function (options){
    var self = this;
    if (app.globalData.iphone == true) { self.setData({ iphone: 'iphone' }) }

    var data = {};
    if (options && options.recommend) { // 分享进入
      self.setData({
        recommend: options.recommend
      });
      data.id = options.id;
    }

    request.httpGet({
      url: config.getGoodsDetail,
      data: data,
      success: function (data) {
        // console.log(data)
        if (data.success) {
          self.setData({
            goodsDetail:data.obj
          })
        }
      }
    });

    request.httpGet({
      url: config.getPrizeLogList,
      data: data,
      success: function (data) {
        console.log(data)
        if (data.success) {
          self.setData({
            prizeLogs: data.obj
          })
        }
      }
    });

    currPage = 1;
    self.getShareLogs(data, options.isRefresh);
  },

  getShareLogs: function (data, isRefresh) {
    var self = this;
    data = data || {};
    data.page = currPage;
    data.rows = rows;
    request.httpGet({
      url: config.getShareLogList,
      data: data,
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

          var shareLogs = self.data.shareLogs;
          if (isRefresh) shareLogs = data.obj.rows;
          else shareLogs = shareLogs == null ? data.obj.rows : shareLogs.concat(data.obj.rows);
          self.setData({
            shareLogs: shareLogs
          });
        }
      }
    })
  },

  onShow : function(){
    var that = this;
    setTimeout(function () {
      if (app.globalData.usinfo == 0) {
        that.setData({
          wxlogin: false
        })
        wx.hideTabBar();
      }
    }, 800)
  },

  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // currPage = 1;
    this.onLoad({ isRefresh:true});
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getShareLogs();
    }
  },

  onShareAppMessage: function () {
    var that = this;
    return {
      title: this.data.goodsDetail.title,
      imageUrl: this.data.goodsDetail.icon,
      path: 'page/component/index?id=' + this.data.goodsDetail.id + '&recommend=' + app.globalData.uid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  userlogin: function (e) {
    var that = this;
    var userInfo = e.detail.userInfo;
    var data = {};
    if (userInfo) {
      data.nickName = userInfo.nickName;
      data.icon = userInfo.avatarUrl;
      data.sex = userInfo.gender;
      data.refType = 'wx';
      data.oAuth = true;
    } else {
      data.oAuth = false;
    }
    if(that.data.recommend)
      data.recommends = that.data.recommend;

    wx.login({
      success: function (wxs) {
        data.code = wxs.code;
        wx.request({
          url: config.loginUrl,
          data: data,
          success: function (res) {
            if (!res.data.success) {
              wx.showModal({
                title: '温馨提示',
                content: '需要您的授权，才能正常使用哦～',
                showCancel: false,
                success: function (res) { }
              })
            } else {
              that.setData({ wxlogin: true })
              that.onLoad({});
              wx.showToast({
                title: '授权成功',
                duration: 2000
              })
              app.globalData.usinfo = 1;
            }
          }
        })
      }
    })
  },
  buyNow: function(e){
    var that = this;
    if (that.data.goodsDetail.quantity < 1) {
      wx.showModal({
        title: '提示',
        content: '商品库存不足哦~',
        showCancel: false
      })
    }
    setTimeout(function () {
      wx.hideLoading();
      // 商品信息写入本地存储
      wx.setStorage({
        key: "buyNowInfo",
        data: that.data.goodsDetail
      })

      wx.navigateTo({
        url: "/page/component/to-pay-order/index"
      })
    }, 500);
    wx.showLoading({
      title: '商品准备中...',
    })
  },
  prizeRule: function(e) {
    var that = this;
    // 商品信息写入本地存储
    wx.setStorage({
      key: "buyNowInfo",
      data: that.data.goodsDetail
    })

    wx.navigateTo({
      url: "/page/component/prize-rule/index"
    })
  },
  shareRule: function (e) {
    var that = this;
    // 商品信息写入本地存储
    wx.setStorage({
      key: "buyNowInfo",
      data: that.data.goodsDetail
    })

    wx.navigateTo({
      url: "/page/component/share-rule/index"
    })
  }
})