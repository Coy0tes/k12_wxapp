// pages/mine/mine.js
const app = getApp()
const service = require('../../utils/base.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    username: '',
    avatar: '',
    mobile: wx.getStorageSync("resData").mobile,
    list: [
      {
        title: '修改个人信息',
        path: '../edit/edit'
      },
      {
        title: '账号与安全',
        path: '../forget/forget'
      },
      {
        title: '版本号：2.0.0',
        path: ''
      },
      {
        title: '意见反馈',
        path: '../opinion/opinion'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("resData").avatar == "") {
      this.setData({
        avatar: 'https://bdhead.oss-cn-beijing.aliyuncs.com/1540889884667.jpg'
      })
    } else {
      this.setData({
          avatar: "https://" + wx.getStorageSync("resData").avatar
      })
    }
    this.setData({
      username: wx.getStorageSync("resData").username
    })
  },

  onShow: function(){
    this.relogin()
  },

  relogin: function(){
    const page = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.setStorageSync('code', res.code)
        wx.request({
          url: service.service.baseUrl + '/wxLogin/web/wxTokens?code=' + res.code,
          method: 'post',
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            wx.setStorageSync('resData', res.data)
            // res.statusCode = 500
            if (res.statusCode != 500) {
              const loginTime = new Date().getTime()
              wx.setStorageSync('loginTime', loginTime)
              app.globalData.schoolId = res.data.schools[0].id
              wx.setStorageSync('schoolId', res.data.schools[0].id)
              wx.request({
                url: service.service.baseUrl + '/tokens/school/' + app.globalData.schoolId,
                header: {
                  Authorization: 'Bearer ' + res.data.token
                },
                method: 'post',
                success: function (res) {
                  if (res.data.patriarch != null) {
                    if (res.data.patriarch.guardians.length != 0) {
                      wx.setStorageSync('klassId', res.data.patriarch.guardians[0].klass.id)
                    }
                    wx.setStorageSync('userToken', res.data.token)
                    page.getUserMessage()
                  } else if (res.data.teacher != null) {
                    wx.setStorageSync('klassId', res.data.teacher.klass[0].id)
                    wx.setStorageSync('userToken', res.data.token)
                    page.getUserMessage()
                  }
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '获取失败，请重新登录',
                showCancel: false,
                success: function () {
                  wx.redirectTo({
                    url: '/pages/login/login',
                  })
                }
              })
            }
          }
        })
      }
    })
  },

  getUserMessage: function(){
    if (wx.getStorageSync("resData").avatar == "") {
      this.setData({
        avatar: 'https://bdhead.oss-cn-beijing.aliyuncs.com/1540889884667.jpg'
      })
    } else {
      this.setData({
        avatar: "https://" + wx.getStorageSync("resData").avatar
      })
    }
    this.setData({
      username: wx.getStorageSync("resData").username
    })
  },

  go: function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },
})