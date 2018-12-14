// pages/chooseKlass/chooseKlass.js
const app = getApp()
const service = require('../../utils/base.js')
const countActive = require('../../utils/countActive.js')
const config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    schoolId: '',
    list: '',
    index: 0,
    arr: [],
    arr2: ['爸爸','妈妈','爷爷','奶奶','外公','外婆','其他'],
    index2: 0,
    relationship: ['DADDY','MOMMY','GRANDPA','GRANDMA','MGRANDPA','MGRANDMA','OTHER'],
    stuName: '',
    mobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      schoolId: options.schoolId,
      mobile: options.mobile
    })

    //获取班级列表
    this.getKlassList()
  },

  getKlassList: function(){
    const page = this
    wx.request({
      url: page.data.service + '/web/getKlassList?schoolId=' + page.data.schoolId,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        let data = res.data
        let arr = []
        for(var i in data){
          arr.push(data[i].klassName)
        } 
        page.setData({
          list: res.data,
          arr: arr
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //班级选择
  klassChange: function(e){
    this.setData({
      index: e.detail.value
    })
  },

  //选择关系
  relationChange: function(e){
    this.setData({
      index2: e.detail.value
    })
  },

  //幼儿名字
  changeName: function(e){
    this.setData({
      stuName: e.detail.value
    })
  },

  submit: function(){
    const page = this
    const mobile = this.data.mobile
    const klassId = this.data.list[this.data.index].klassid
    const stuName = this.data.stuName
    const schoolId = this.data.schoolId
    const relationType = this.data.relationship[this.data.index2]
    var data = {
      mobile: mobile,
      klassId: klassId,
      stuName: stuName,
      schoolId: schoolId,
      relationType: relationType
    }
    console.log(data)
    wx.request({
      url: page.data.service + '/tokens/CreateUser?mobile=' + mobile + '&klassId=' + klassId + '&stuName=' + stuName + '&schoolId=' + schoolId + '&relationType=' + relationType,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        if(res.statusCode == 200){
          wx.showToast({
            title: '等待授权',
            icon: 'loading',
            duration: 9999999,
            mask: true
          })
          let timer = setInterval(function(){
            // 登录
            new Promise(function (resolve, reject) {
              wx.login({
                success: res => {
                  const ActiveType = 'LOGIN'
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  wx.request({
                    url: service.service.baseUrl + '/wxLogin/web/wxTokens?code=' + res.code,
                    method: 'post',
                    header: {
                      "Content-Type": "application/json"
                    },
                    success: function (res) {
                      console.log(res)
                      
                      if (res.statusCode != 500) {
                        wx.setStorageSync('resData', res.data)
                        console.log("没有500")
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
                            console.log(res)
                            if (res.data.patriarch != null) {
                              if (res.data.patriarch.guardians.length != 0) {
                                wx.setStorageSync('klassId', res.data.patriarch.guardians[0].klass.id)
                              }
                              wx.setStorageSync('userToken', res.data.token)
                              wx.setStorageSync('actorId', res.data.patriarch.actor.id)
                              wx.setStorageSync('studentId', res.data.patriarch.guardians[0].student.id)
                              wx.setStorageSync('studentName', res.data.patriarch.guardians[0].student.name)
                              app.globalData.userToken = res.data.token
                              countActive(ActiveType, res.data.token)
                              wx.hideToast()
                              clearInterval(timer)
                              wx.switchTab({
                                url: '../index/index',
                              })
                              resolve(res)
                            } else if (res.data.teacher != null) {
                              wx.setStorageSync('klassId', res.data.teacher.klass[0].id)
                              wx.setStorageSync('userToken', res.data.token)
                              countActive(ActiveType, res.data.token)
                              wx.switchTab({
                                url: '../index/index',
                              })
                              resolve(res)
                            } else {
                              wx.hideToast()
                              clearInterval(timer)
                              wx.showModal({
                                title: '温馨提示',
                                content: '此程序仅限家长与老师使用',
                                showCancel: false,
                                success: function () {
                                  wx.setStorageSync('userToken', res.data.token)
                                  // countActive(res)
                                  countActive(ActiveType, res.data.token)
                                  wx.switchTab({
                                    url: '../index/index',
                                  })
                                }
                              })
                              resolve(res)
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })
            })
          },3000)
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})