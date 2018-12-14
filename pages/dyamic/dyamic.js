// pages/dyamic/dyamic.js
const service = require('../../utils/base.js')
const saveFormId = require('../../utils/saveFormId.js')
const countActive = require('../../utils/countActive.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WebSrc: '',
    service: service.service.baseUrl,
    goId: 0,
    ActiveType: 'DYNAMIC'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.goId){
      this.setData({
        goId: options.goId
      })
    } else {
      // console.log('没有goId')
    }

    //获取最新数据放入已读
    const page = this
    const token = wx.getStorageSync('userToken')
    const klassId = wx.getStorageSync('klassId')
    let fromId
    if (wx.getStorageSync('fromId')) fromId = wx.getStorageSync('fromId')
    else fromId = 0
    wx.request({
      url: page.data.service + '/api/klass-feeds?fromId=' + fromId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function(res) {
        wx.setStorageSync('fromId', res.data.feeds[0].id)
      }
    })
    wx.login({
      success: function(res) {
        countActive(page.data.ActiveType, wx.getStorageSync('userToken'))
        var str = "https://www.k12soft.net/kdweb/dongtai/#/?cd=" + res.code + '&goId=' + page.data.goId + "&t=" + Math.random() * 100
        page.setData({
          WebSrc: str
        })
      }
    })
  },

  getFormId: function(e) {
    saveFormId(e.detail.fromId)
  }
})