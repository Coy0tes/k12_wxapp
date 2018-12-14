const service = require('base.js')
const app = getApp()


var fileHost = "https://bdhead.oss-cn-beijing.aliyuncs.com/";//你的阿里云地址最后面跟上一个/   在你当前小程序的后台的uploadFile 合法域名也要配上这个域名
var config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`, // 默认存在根目录，可根据需求改
  AccessKeySecret: 'xxx',        // AccessKeySecret 去你的阿里云上控制台上找
  OSSAccessKeyId: 'xxx',         // AccessKeyId 去你的阿里云上控制台上找
  timeout: 87600, //这个是上传文件时Policy的失效时间
  token: ''
};

app.vessionIf().then(function(res){
  app.Login().then(function(res){
    let token1 = wx.getStorageSync('userToken')
    wx.request({
      url: service.service.baseUrl + '/api/tp/aliyun/bd-token',
      method: 'get',
      header: {
        Authorization: 'Bearer ' + token1
      },
      success: function (res) {
        // console.log(res)
        if (res.statusCode == 500) {
          // getKey()
        } else if (res.statusCode == 200) {
          config.OSSAccessKeyId = res.data.accessKeyId
          config.AccessKeySecret = res.data.accessKeySecret
          config.token = res.data.token
        } else {
          return
        }
      }
    })
  })
})


module.exports = config