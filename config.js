/**
 * 小程序配置文件
 * pro appid=wx0b54b1b16b700f4b
 * qa  appid=wx6196df0ee20f5fa3
 */

// var server_host = "http://192.168.0.107:8080"; // dev
var server_host = "https://www.mobiang.com/ljz"; // qa
// var server_host = "https://www.qrun360.com"; // pro

var config = {

    // 下面的地址配合云端 Server 工作
    server_host,

    // 登录地址，用于建立会话
    loginUrl: `${server_host}/api/user/login`,

    // 获取商品详情
    getGoodsDetail: `${server_host}/api/goods/detail`,

    // 获取商品昨日消费中奖列表
    getPrizeLogList: `${server_host}/api/goods/prizelog/list`,

    // 获取商品转发提现名单
    getShareLogList: `${server_host}/api/goods/sharelog/list`,

    // 获取商品小程序专属二维码
    getWxacode: `${server_host}/api/goods/getWxacode`,

    // 创建订单
    addOrder: `${server_host}/api/order/add`,

    // 发起微信支付
    wxpay: `${server_host}/api/pay/wxpay`,

    // 获取我的财产
    getBalance: `${server_host}/api/balance/getBalance`,

    // 获取我的财产明细
    queryBalanceLogPage: `${server_host}/api/balance/queryLogPage`,

    // 获取提现配置
    getWithdrawConfig: `${server_host}/api/balance/getWithdrawConfig`,

    // 申请提现
    applyWithdraw: `${server_host}/api/balance/applyWithdraw`
};

module.exports = config
