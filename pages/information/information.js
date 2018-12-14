// pages/information/information.js
const app = getApp()
const service = require('../../utils/base.js')
import reset from '../../utils/dic.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    nowTab: 0,
    nowDate: '',
    cardBg: {
      bgc: '#FFEBF6',
      color: '#F54C6E'
    },
    cardBg2: {
      bgc: '#FFFFCB',
      color: '#FB8600'
    },
    cardBg3: {
      bgc: '#CCE8FE',
      color: '#004C8F'
    },
    allData: [],
    nowData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!options.goId) {
      app.globalData.goId = 4
      wx.switchTab({
        url: '../index/index',
      })
    }
    //首次进入先查今日的
    let y = new Date().getFullYear()
    let m = new Date().getMonth() + 1
    let d = new Date().getDate()
    if (m < 10) m = "0" + m
    if (d < 10) d = "0" + d
    let time = y + '-' + m + '-' + d
    this.setData({
      nowDate: time
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  getData: function() {
    //为了防止登录失败，重新调用一次
    this.getNewData()
  },

  getNewData: function() {
    const page = this
    const token = wx.getStorageSync('userToken')
    let date = this.data.nowDate
    wx.request({
      url: page.data.service + '/wxLogin/findWxPushMassage',
      header: {
        Authorization: 'Bearer ' + token
      },
      data: {
        date: date
      },
      success: function(res) {
        if (res.statusCode == 200) {
          var data3 = res.data
          var nowData = []
          for (var i = 0; i < data3.length; i++) {
            nowData.push(JSON.parse(data3[i].massage))
          }
          page.setData({
            nowData: nowData
          })
          let data = page.data.nowData
          for (var i in data) {
            data[i].data2 = reset(data[i].data)
            if (data[i].type == "MORNING") data[i].type2 = "晨检通知"
            if (data[i].type == "NOON") data[i].type2 = "午检通知"
            if (data[i].type == "NIGHT") data[i].type2 = "晚检通知"
          }
          page.setData({
            nowData: data
          })
        } else if (res.statusCode == 500) {
          page.getData()
        }
      },
      fail: function(res) {
        page.getData()
      }
    })
  },

  tableTab: function(e) {
    this.setData({
      nowTab: e.currentTarget.dataset.id
    })
    if (this.data.nowTab == 0) {
      let y = new Date().getFullYear()
      let m = new Date().getMonth() + 1
      let d = new Date().getDate()
      if (m < 10) m = "0" + m
      if (d < 10) d = "0" + d
      let time = y + '-' + m + '-' + d
      this.setData({
        nowDate: time
      })
    } else {
      this.setData({
        nowDate: ''
      })
    }
    this.getData()
  }
})