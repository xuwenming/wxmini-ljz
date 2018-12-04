var config = require('../config');
var request = require('request');
function wxpay(totalPrice, orderId, redirectUrl) {
  let remark = "支付订单 ：" + orderId;
  request.httpPost({
    url: config.wxpay,
    data: { 
      orderId: orderId,
      amount: totalPrice,
      payWay: 'PW01'
    },
    success: function (data) {
      if (data.success) {
        // 发起支付
        wx.requestPayment({
          timeStamp: data.obj.timeStamp,
          nonceStr: data.obj.nonceStr,
          package: 'prepay_id=' + data.obj.prepayId,
          signType: 'MD5',
          paySign: data.obj.sign,
          fail: function (aaa) {
            wx.showToast({ title: '支付失败' })
          },
          success: function () {
            wx.showToast({ title: '支付成功' })
            wx.redirectTo({
              url: redirectUrl
            });
          }
        })
      } else {
        wx.showToast({ title: '服务器忙' + data.msg })
      }
    }
  })
}

module.exports = {
  wxpay: wxpay
}
