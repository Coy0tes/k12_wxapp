// pages/notice/notice.js
const app = getApp()
const service = require('../../utils/base.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: [],
    planType: 'NOTICE',
    service: service.service.baseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const page = this
    const token = app.globalData.userToken
    wx.request({
      url: page.data.service + '/management/news?schoolId=' + 1 + '&fromDate=25',
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        let data = res.data.createds
        data = data.reverse()

        for (var i in data) {
          var thisDate = new Date(data[i].createdAt * 1000)
          var year = thisDate.getFullYear()
          var month = thisDate.getMonth() + 1
          var day = thisDate.getDate()
          var h = thisDate.getHours()
          var s = thisDate.getMinutes()
          if (s < 10) s = '0' + s
          var year2 = new Date().getFullYear()
          var month2 = new Date().getMonth() + 1
          var day2 = new Date().getDate()
          var h2 = new Date().getHours()
          var s2 = new Date().getMinutes()
          if (year == year2) {
            if (month == month2) {
              if (day == day2) {
                data[i].createdAt = h + ':' + s
              } else {
                if (day2 - day == 1) {
                  data[i].createdAt = '昨天  ' + h + ':' + s
                } else if (day2 - day == 2) {
                  data[i].createdAt = '前天  ' + h + ':' + s
                } else {
                  data[i].createdAt = month + '月' + day + '日' + h + ':' + s
                }
              }
            } else {
              data[i].createdAt = month + '月' + day + '日' + h + ':' + s
            }
          } else {
            data[i].createdAt = year + '年' + month + '月' + day + '日' + h + ':' + s
          }
        }
        page.setData({
          activity: data
        })
      }
    })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  activityDetail: function (e) {
    var index = e.currentTarget.dataset.id
    var id = e.currentTarget.dataset.id
    var title = this.data.activity[index].title
    var str = this.data.activity[index].content
    str = str.replace(/http/g, "zzz")
    str = str.replace(/www/g, "xxx")
    str = str.replace(/:/g, "ccc")
    str = str.replace(/\//g, "vvv")
    str = str.split("")
    for(var i in str){
      if (str[i] == '.') str[i] = str[i].replace('.', "bbb")
    }
    str = str.join("")
    wx.navigateTo({
      url: "../activityWeb/activityWeb?data=" + str,
    })
  }
})