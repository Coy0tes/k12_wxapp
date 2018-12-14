const app = getApp()
const service = require('../../utils/base.js')
import confirmData from '../../utils/confirmData.js'
const saveFormId = require('../../utils/saveFormId.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: [],
    planType: 'HOMEWORK',
    service: service.service.baseUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const page = this
    const token = wx.getStorageSync('userToken')
    const klassId = wx.getStorageSync('klassId')
    wx.request({
      url: page.data.service + '/api/klass-plans?klassId=' + klassId + '&planType=' + page.data.planType + '&fromDate=' + 0,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        // console.log(res)
        let data1 = res.data.createds
        let data2 = res.data.updateds
        let data = confirmData(data1, data2)
        wx.setStorageSync('PlanFromId', res.data.eventId)
        
        for (var i in data) {
          if (data[i] == null) continue
          var thisDate = new Date(data[i].createdAt * 1000)
          var year = thisDate.getFullYear()
          var month = thisDate.getMonth() + 1
          var day = thisDate.getDate()
          var h = thisDate.getHours()
          if (h < 10) h = '0' + h
          var s = thisDate.getMinutes()
          if (s < 10) s = '0' + s
          var year2 = new Date().getFullYear()
          var month2 = new Date().getMonth() + 1
          var day2 = new Date().getDate()
          var h2 = new Date().getHours()
          var s2 = new Date().getMinutes()
          // console.log(year + '年' + month + '月' + day + '日' + h + '时' + s + '分')
          // console.log(year2 + '年' + month2 + '月' + day2 + '日' + h2 + '时' + s2 + '分')
          if(year == year2){
            if(month == month2){
              if(day == day2){
                data[i].createdAt = h + ':' + s
              } else {
                if(day2 - day == 1){
                  data[i].createdAt = '昨天  ' + h + ':' + s
                } else if (day2 - day == 2){
                  data[i].createdAt = '前天  ' + h + ':' + s
                } else {
                  data[i].createdAt = month + '月' + day + '日' + h + ':' + s
                }
              }
            } else{
              data[i].createdAt = month + '月' + day + '日' + h + ':' + s
            }
          } else {
            data[i].createdAt = year + '年' + month + '月' + day + '日' + h + ':' + s
          }
        }
        // console.log(data)
        page.setData({
          activity: data
        })
      }
    })
  },

  activityDetail: function (e) {
    var index = e.currentTarget.dataset.id
    var id = e.currentTarget.dataset.id
    var title = this.data.activity[index].title
    var str = this.data.activity[index].content
    str = str.replace(/=/g, "%")
    str = str.replace(/\"/g, "\'")

    wx.navigateTo({
      url: '../activityDetail/activityDetail?id=' + id + '&data=' + str + '&title=' + title,
    })
  },

  getFormId: function (e) {
    saveFormId(e.detail.formId)
  }
})