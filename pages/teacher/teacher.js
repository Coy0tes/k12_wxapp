
const app = getApp()
const service = require('../../utils/base.js')
const saveFormId = require('../../utils/saveFormId.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    service: service.service.baseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const page = this
    const token = wx.getStorageSync('userToken')
    const schoolId = wx.getStorageSync('schoolId')
    wx.request({
      url: page.data.service + '/management/teachers?schoolId=' + schoolId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res){
        page.setData({
          list: res.data
        })
      }
    })
  },
  
  getFormId: function (e) {
    saveFormId(e.detail.formId)
  }
})