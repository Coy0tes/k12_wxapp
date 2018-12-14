// pages/wxpay/wxpay.js
const service = require('../../utils/base.js')
import MD5 from '../../utils/MD5.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    service: service.service.baseUrl,
    newCode: '',
    url: '/wxpay/wxpay'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindMoney: function(e){
    this.setData({
      money: e.detail.value
    })
  },

  pay: function(e){
    wx.showToast({
      title: '等待支付',
      icon: 'loading'
    })
    const formId = e.detail.formId
    console.log('发起支付')
    const page = this
    const token = wx.getStorageSync('userToken')

    //参数
    const timeStamp = new Date().getTime() * 1000
    const nonceStr = Math.random * 12
    // const package = ''
    const signType = 'MD5'
    const paySign = ''
    wx.login({
      success: function(res){
        const code = res.code
        //统一下单
        const money = 1
        wx.request({
          url: page.data.service + '/weixin/pay/unifiedOrder',
          header: {
            Authorization: 'Bearer ' + token
          },
          data: {
            code: code,
            totalFee: money,
            clientIp: '61.25.36.26',
            body: '青苗宝贝-商品购买'
          },
          success: function(res){
            console.log(res)
            const orderId = res.data.orderId
            const orderDate = new Date(new Date().getTime())
            // debugger
            //微信支付
            page.payM(res, money, formId, orderId, orderDate)
          },
          fail: function(res){
            console.log(res)
          }
        })
      }
    })
  },
  //将对象按照Ascii码排序
  sort_ASCII: function (obj) {
    var arr = new Array();
    var num = 0;
    for (var i in obj) {
      arr[num] = i;
      num++;
    }
    var sortArr = arr.sort();
    var sortObj = {};
    for (var i in sortArr) {
      sortObj[sortArr[i]] = obj[sortArr[i]]
    }
    return sortObj;
  },

  payM: function (res, money, formId, orderId, orderDate){
    wx.hideToast()
    console.log("formId：" + formId)
    
    const token = wx.getStorageSync('userToken')
    const page = this
    const key = '24D85E56E7F13AFEB649938AF2433CA1'
    const signA = "appId=" + res.data.appId + "&nonceStr=" + res.data.nonceStr + "&package=" + res.data.package + "&signType=MD5&timeStamp=" + res.data.timeStamp
    const signB = signA + "&key=" + key
    let signC = MD5.hexMD5(signB).toUpperCase()
    wx.requestPayment({
      timeStamp: res.data.timeStamp,
      nonceStr: res.data.nonceStr,
      package: res.data.package,
      signType: 'MD5',
      paySign: signC,
      success: function(res) {
        console.log(res)
        console.log('支付成功')
        
      },
      fail: function(res){
        console.log(res)
      },
      complete: function(res){
        console.log('支付完成');
        var url = page.data.url;
        var submitData = {
          "feePeriodtype": "YEAR",
          "feeType": "WX",
          "mobile": wx.getStorageSync('resData').mobile,
          "money": money,
          "scopt": "VIDEOS",
          "stuName": wx.getStorageSync('studentName'),
          "studentId": wx.getStorageSync('studentId'),
          "username": wx.getStorageSync('resData').username,
          "wxOrder": orderId
        }
        console.log(submitData)
        if (res.errMsg == 'requestPayment:ok') {
          wx.showToast({
            title: '请稍候',
            icon: 'loading',
            duration: 9999999,
            mask: true
          })
          new Promise(function(resolve, reject){
            wx.request({
              url: page.data.service + '/wxLogin/sendTemplateMessage',
              header: {
                Authorization: 'Bearer ' + token
              },
              data: {
                "data": {
                  "keyword1": {
                    "value": "青苗宝贝商品"
                  },
                  "keyword2": {
                    "value": money + "分"
                  },
                  "keyword3": {
                    "value": orderDate
                  },
                  "keyword4": {
                    "value": orderId
                  },
                },
                "emphasisKeyword": "keyword2",
                "formId": formId,
                "page": "pages/index/index",
                "templateId": "__RlAU0Dt6ffnz6jGYNjcA8sIDY5qYiHjDiEsjzRwq0",
                "timeoutAt": new Date().getTime()
              },
              method: "post",
              success: function (res) {
                console.log(res)
                resolve()
              },
              fail: function (res) {
                console.log(res)
                reject()
              }
            })
          }).then(function(){
            //订单发送到后台
            wx.request({
              url: page.data.service + '/feeDetails/management/create',
              header: {
                Authorization: 'Bearer ' + token
              },
              data: submitData,
              method: 'post',
              success: function (res) {
                console.log(res)
                wx.hideToast()
                if (res.statusCode == 200) {
                  wx.showModal({
                    title: '提示',
                    content: '充值成功',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }
                    }
                  })
                }
              }
            })
          })
        }
        return;
      }
    })
  },

  getCode: function(){
    wx.login({
      success: function(res){
        console.log(res.code)
      }
    })
  }
})