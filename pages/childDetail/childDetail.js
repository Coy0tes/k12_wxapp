// pages/childDetail/childDetail.js
const app = getApp()
const service = require('../../utils/base.js')
const saveFormId = require('../../utils/saveFormId.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    selectImg: '../../images/search.png',
    star: '../../images/Starb.png',
    active: 0,
    allEvalute: '',
    date: '',
    dateList: [],
    dateList2: [],
    dateIndex: 0,
    evaluate: [
      {
        name: '情    绪',
        star: 0
      },
      {
        name: '同伴相处',
        star: 0
      },
      {
        name: '进    餐',
        star: 0
      },
      {
        name: '卫生习惯',
        star: 0
      },
      {
        name: '睡    眠',
        star: 0
      },
      {
        name: '身体状况',
        star: 0
      },
      {
        name: '适应环境',
        star: 0
      },
      {
        name: '自理能力',
        star: 0
      },
    ],
    teacherEvaluate: '',
    parentEvaluate: '',
    noImg: 'bdhead.oss-cn-beijing.aliyuncs.com/1540889884667.jpg',
    studentMsg: '',
    parentContent: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const msg = JSON.parse(options.msg)
    this.setData({
      studentMsg: msg
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  thisWeek: function(e) {
    const page = this
    const token = wx.getStorageSync('userToken')
    const studentId = page.data.studentMsg.student.id
    const klassId = page.data.studentMsg.student.klass.id
    let date
    if (e && e.currentTarget && e.currentTarget.dataset.date) {
      date = e.currentTarget.dataset.date
    } else if (e.nowDate){
      date = e.nowDate
    } else {
      var y = new Date().getFullYear()
      var m = new Date().getMonth() + 1
      if (m < 10) m = '0' + m
      var d = new Date().getDate()
      if (d < 10) d = '0' + d
      date = y + '-' + m + '-' + d
    }
    page.setData({
      nowDate: date
    })

    wx.request({
      url: page.data.service + '/weeklyrRemark/management/find?studentId=' + studentId + '&klassId=' + klassId + '&date=' + date,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function(res) {
        let allEvalute = res.data[0]
        page.setData({
          allEvalute: allEvalute,
          'evaluate[0].star': allEvalute.emotion,
          'evaluate[1].star': allEvalute.partner,
          'evaluate[2].star': allEvalute.dine,
          'evaluate[3].star': allEvalute.sanitation,
          'evaluate[4].star': allEvalute.seleep,
          'evaluate[5].star': allEvalute.health,
          'evaluate[6].star': allEvalute.environment,
          'evaluate[7].star': allEvalute.self,
          teacherEvaluate: allEvalute.tcontext,
          parentEvaluate: allEvalute.pcontext,
          // parentEvaluate: '',
          date: allEvalute.datePeriod,
        })
      }
    })
    page.setData({
      active: 1
    })
  },

  historyWeek: function() {
    const page = this
    const token = wx.getStorageSync('userToken')
    const studentId = page.data.studentMsg.student.id
    wx.request({
      url: page.data.service + '/weeklyrRemark/management/findDate?studentId=' + studentId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        let newArray = []
        for(var i in res.data){
          newArray.push(res.data[i].date)
        }
        page.setData({
          active: 2,
          dateList: res.data,
          dateList2: newArray,
        })
      }
    })
  },

  bindPickerChange: function(e) {
    e.currentTarget.dataset.date = this.data.dateList2[e.detail.value]
    this.thisWeek(e)
  },

  getFormId: function(e){
    saveFormId(e.detail.formId),
    this.submit()
  },

  changeInput: function(e){
    this.setData({
      parentContent: e.detail.value
    })
  },

  submit: function(){
    var dataId = this.data.allEvalute.id
    var message = this.data.parentContent
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/weeklyrRemark/management/parent?id=' + dataId + '&message=' + message,
      header: {
        Authorization: 'Bearer ' + token
      },
      method: 'put',
      success: function (res) {
        if(res.statusCode == 200){
          wx.showModal({
            title: '提示',
            content: '反馈成功',
            showCancel: false,
            success: function(){
              var e = {
                nowDate: page.data.nowDate
              }
              page.thisWeek(e)
            }
          })
        }
      }
    })
  },

  goDate: function(e){
    this.thisWeek(e)
  }
})