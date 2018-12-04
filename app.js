

App({
  onLaunch: function () {
    var self = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        self.globalData.network.networkType = res.networkType
      }
    })
    // console.log('App Launch')
    wx.onNetworkStatusChange(function (res) {
      self.globalData.network = {
        isConnected: res.isConnected,
        networkType: res.networkType
      }
    });
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.search("iPhone X") != -1) {
          self.globalData.iphone = true;
        }
      }
    });
    self.login();
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
  globalData: {
    tokenId: null,
    network:{
      isConnected:true,
      networkType:''
    },
    systemInfo:null
  },

  getModel: function () { //获取手机型号
    return this.globalData.systemInfo["model"]
  },
  getVersion: function () { //获取微信版本号
    return this.globalData.systemInfo["version"]
  },
  getSystem: function () { //获取操作系统版本
    return this.globalData.systemInfo["system"]
  },
  getPlatform: function () { //获取客户端平台
    return this.globalData.systemInfo["platform"]
  },
  config : require('config'),
  login: function () {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.config.loginUrl,
          data: {
            code: res.code
          },
          success: function (res) {
            if (!res.data.success) {
              that.globalData.usinfo = 0;
              return;
            }
            if (!res.data.success) {
              wx.hideLoading();
              wx.showModal({
                title: "提示",
                content: "无法登录，请重试",
                showCancel: false
              });
              return;
            }
            that.globalData.tokenId = res.data.obj.tokenId;
            that.globalData.uid = res.data.obj.userId;
          }
        });
      }
    });
  },
  
  /**
   * scope:权限的scope 
   * content：拒绝授权的提示信息
   * required ： 授权是否必须
   * callback : 授权成功回调函数
   */
  getAuthorize : function(opts) {
    var self = this, scope = opts.scope;
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success(res) {
              self.getAuthorize(opts);
            },
            fail() {
              wx.showModal({
                content: opts.content,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        res.authSetting = {
                          scope: true
                        }
                      }
                    })
                  } else if (res.cancel) {
                    if (opts.required) self.getAuthorize(opts);
                  }
                }
              });
            }
          })
        } else {
          if(opts.callback)
            opts.callback();
        }
      }
    })
  },

  uploadImage: function (options) {
    var self = this,
      index = options.index || 0,
      result = options.result || ''
    wx.uploadFile({
      url: options.url, 
      filePath: options.filePaths[index],
      name: options.name || 'file',
      formData: options.formData || null,
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          var data = JSON.parse(res.data);
          index++;
          if (result != '') result += ';';
          result += data.obj;
          if (index == options.filePaths.length) {
            if (options.success)
              options.success(result);
          } else {
            options.index = index;
            options.result = result;
            self.uploadImage(options);
          }
        } else {
          wx.showModal({
            content: '请求超时，请稍后再试！',
            showCancel: false
          });
        }

      },
      fail: function (res) {
        console.log('图片【' + (index + 1) + '】上传失败！', res);
        wx.showModal({
          content: '图片【' + (index + 1) + '】上传失败！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              if (options.fail)
                options.fail();
            }
          }
        });
      },
      complete: function (res) {
        if (!options.showLoading && index == options.filePaths.length) {
          wx.hideLoading();
          wx.hideNavigationBarLoading();
        }
      }
    })
  }
})
