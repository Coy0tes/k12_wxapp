// pages/familySchool/familySchool.js
const app = getApp()
const service = require('../../utils/base.js')
const saveFormId = require('../../utils/saveFormId.js')
// const countActive = require('../../utils/countActive.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    childList: [
      {
        name: '李思琪',
        avatar: 'bdhead.oss-cn-beijing.aliyuncs.com/1540256129530.jpg',
        klassName: '奇思3班',
        studentId: '1'
      },
      {
        name: '李思琪',
        avatar: 'bdhead.oss-cn-beijing.aliyuncs.com/1540256129530.jpg',
        klassName: '奇思3班',
        studentId: '2'
      },
    ],
    noImg: 'bdhead.oss-cn-beijing.aliyuncs.com/1540889884667.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getChild()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  detail: function(e){
    wx.navigateTo({
      url: '../childDetail/childDetail?msg=' + JSON.stringify(this.data.childList[e.currentTarget.dataset.index]),
    })
  },

  getChild: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/management/guardians/findChildren',
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        page.setData({
          childList: res.data
        })
      }
    })
  },
})