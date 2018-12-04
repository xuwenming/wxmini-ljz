var app = getApp();
var config = require('../../../config');
var request = require('../../../util/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    goodsDetail: {},
    buyNumber: 1,
    buyNumMin: 1,
    buyNumMax: 0,
    allGoodsPrice: 0,
    yunPrice: 0
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
    var goodsDetail = wx.getStorageSync('buyNowInfo');
    var buyNumMax = goodsDetail.quantity;
    if (goodsDetail.limitNumber > 0 && goodsDetail.limitNumber < goodsDetail.quantity) {
      buyNumMax = goodsDetail.limitNumber;
    }
    this.setData({
      goodsDetail: goodsDetail,
      buyNumMax: buyNumMax,
      allGoodsPrice: goodsDetail.price,
      yunPrice: goodsDetail.freight,
    });
  },


  chooseAddress: function() {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          address: {
            deliveryAddress: res.provinceName + " " + res.cityName + " " + res.countyName + " " + res.detailInfo,
            contactPeople: res.userName,
            contactPhone: res.telNumber
          }
        });
      },
      fail: function() {
        app.getAuthorize({
          scope: 'scope.address',
          content: '检测到您没打开通讯地址权限，是否去设置打开？',
          required: true // 必须授权
        })
      }
    })
  },

  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
      this.totalPrice(currentNum);
    }
  },
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
      this.totalPrice(currentNum);
    }
  },
  totalPrice: function(num){
    var price = this.data.goodsDetail.price;
    this.setData({
      allGoodsPrice: price*num
    })
  },
  createOrder: function(e) {
    var that = this;
    if (!that.data.address) {
      wx.hideLoading();
      wx.showModal({
        title: '错误',
        content: '请先设置您的收货地址！',
        showCancel: false
      })
      return;
    }
    var goodsDetail = that.data.goodsDetail;
    var address = that.data.address;
    var orderParam = {
      shopId: goodsDetail.shopId,
      totalPrice: that.data.allGoodsPrice + that.data.yunPrice,
      freight: that.data.yunPrice,
      contactPhone: address.contactPhone,
      contactPeople: address.contactPeople,
      deliveryAddress: address.deliveryAddress,
      orderItemList: []
    };
    var orderItem = {
      goodsId: goodsDetail.id,
      buyPrice: goodsDetail.price,
      quantity: that.data.buyNumber
    };
    orderParam.orderItemList.push(orderItem);

    request.httpPost({
      url: config.addOrder,
      data: { orderParam: JSON.stringify(orderParam) },
      success: function (data) {
        if (data.success) {
          wx.navigateTo({
            url: "/page/component/to-pay-order/success/index?orderId=" + data.obj + "&totalPrice=" + orderParam.totalPrice + "&contactPhone=" + orderParam.contactPhone + "&contactPeople=" + orderParam.contactPeople + "&deliveryAddress=" + orderParam.deliveryAddress
          });
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