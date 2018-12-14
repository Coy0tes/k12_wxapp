// pages/opinion/opinion.js
const app = getApp()
const service = require('../../utils/base.js')
const saveFormId = require('../../utils/saveFormId.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: '',
    service: service.service.baseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  change: function(e){
    this.setData({
      formData: e.detail.value
    })
  },

  send: function(e){
    saveFormId(e.detail.formId)
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/wxLogin/addMassage',
      data: JSON.stringify(this.data.formData),
      header: {
        Authorization: 'Bearer ' + token
      },
      method: 'post',
      success: function(res){
        if(res.statusCode == 200){
          wx.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false,
            success: function () {
              wx.switchTab({
                url: '../mine/mine',
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '提交失败',
            showCancel: false
          })
        }
      }
    })
  },
})