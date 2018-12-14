// pages/medicineHistory/medicineHistory.js
const app = getApp()
const service = require('../../utils/base.js')
const formatTime = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    childList: [],
    noImg: 'bdhead.oss-cn-beijing.aliyuncs.com/1541064112033.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.medicineHistory()
  },

  goDetail: function(e){
    const index = e.currentTarget.dataset.index
    const id = this.data.childList[index].id
    wx.navigateTo({
      url: '../medicineing/medicineing?id=' + id,
    })
  },

  //查询历史记录
  medicineHistory: function () {
    const page = this
    const token = wx.getStorageSync('userToken')
    const d = new Date()
    const t = formatTime.formatTime(d)
    wx.request({
      url: page.data.service + '/medicine/management/findBy?localDate=' + t + '&code=0',
      header: {
        Authorization: 'Bearer ' + token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
        let data = res.data
        for(var i in data){
          let d = new Date(data[i].date * 1000)
          data[i].date = formatTime.formatTime(d)
        }
        data = data.reverse()
        page.setData({
          childList: data
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})