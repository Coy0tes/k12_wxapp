// pages/login/login.js
const app = getApp()
const service = require('../../utils/base.js')
const countActive = require('../../utils/countActive.js')
const config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoBgImg: 'https://www.k12soft.net/kdweb/img/loginBg.png',
    service: service.service.baseUrl,
    mobile: '',
    password: '',
    passwordVaild: '',
    mobileVaild: '',
    ActiveType: 'LOGIN'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  login: function(){
    if (this.data.passwordVaild != true || this.data.mobileVaild != true) return

    const page = this
    
    return new Promise(function(resolve, reject){
      wx.login({
        success: res => {
          wx.request({
            url: page.data.service + '/wxLogin/web/wxTokensPWD?code=' + res.code,
            data: {
              mobile: page.data.mobile,
              password: page.data.password
            },
            method: 'post',
            success: function (res) {
              wx.setStorageSync('resData', res.data)
              const token = res.data.token
              const schoolId = res.data.schools[0].id
              wx.setStorageSync('schoolId', res.data.schools[0].id)
              //登录到学校
              wx.request({
                url: page.data.service + '/tokens/school/' + schoolId,
                header: {
                  Authorization: 'Bearer ' + token
                },
                method: 'post',
                success: function (res) {
                  wx.showToast({
                    title: '登录中',
                    icon: 'loading'
                  })
                  if (res.data.patriarch != null) {
                    if (res.data.patriarch.guardians.length != 0) {
                      wx.setStorageSync('klassId', res.data.patriarch.guardians[0].klass.id)
                    }
                    wx.setStorageSync('userToken', res.data.token)
                    wx.setStorageSync('actorId', res.data.patriarch.actor.id)
                    wx.setStorageSync('studentId', res.data.patriarch.guardians[0].student.id)
                    wx.setStorageSync('studentName', res.data.patriarch.guardians[0].student.name)
                    resolve(res)
                    // page.countActive(res)
                    countActive(page.data.ActiveType, res.data.token)
                    wx.hideToast()
                    wx.switchTab({
                      url: '../index/index',
                    })
                  } else if (res.data.teacher != null) {
                    wx.setStorageSync('klassId', res.data.teacher.klass[0].id)
                    wx.setStorageSync('userToken', res.data.token)
                    resolve(res)
                    countActive(page.data.ActiveType, res.data.token)
                    wx.hideToast()
                    wx.switchTab({
                      url: '../index/index',
                    })
                  } else {
                    wx.hideToast()
                    wx.showModal({
                      title: '温馨提示',
                      content: '此程序仅限家长与老师使用',
                      showCancel: false,
                      success: function () {
                        wx.setStorageSync('userToken', res.data.token)
                        countActive(page.data.ActiveType, res.data.token)
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }
                    })
                    resolve(res)
                  }
                },
                fail: function (res) {
                  wx.showModal({
                    title: '提示',
                    content: '账号或密码错误，请重试',
                    showCancel: false
                  })
                  reject('error')
                },
                complete: function (res) { },
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      })
    }).then(function (res) {
      let token1 = wx.getStorageSync('userToken')
      wx.request({
        url: page.data.service + '/api/tp/aliyun/bd-token',
        method: 'get',
        header: {
          Authorization: 'Bearer ' + token1
        },
        success: function (res) {
          if (res.statusCode == 500) {

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
    // return
    //登录
    
  },

  bindValueMobile: function(e){
    this.setData({
      mobile: e.detail.value
    })
  },

  bindValuePassword: function(e){
    this.setData({
      password: e.detail.value
    })
  },

  vaildMobile: function(){
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if (!reg.test(this.data.mobile)){
      this.setData({
        mobileVaild: false
      })
    } else {
      this.setData({
        mobileVaild: true
      })
    }
  },

  vaildPassword: function(){
    if(this.data.password == '') {
      this.setData({
        passwordVaild: false
      })
    } else {
      this.setData({
        passwordVaild: true
      })
    }
  },

  toRegist: function(){
    wx.navigateTo({
      url: '../regist/regist',
    })
  },

  toForget: function(){
    wx.navigateTo({
      url: '../forget/forget',
    })
  }
})