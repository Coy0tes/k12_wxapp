// pages/attSeconds/attSeconds.js
const service = require('../../utils/base.js')
const dateTimePicker = require('../../utils/dateTimePicker.js');
const saveFormId = require('../../utils/saveFormId.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    array: [''],
    index: 0,
    multiArray: [
      ['35', '36', '37', '38', '39', '40', '41'],
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    ],
    multiIndex: [0, 0],
    temperature: '35.0',
    leaveTime: {
      date: '2018-10-01',
      time: '12:00',
      dateTimeArray: null,
      dateTime: null,
      dateTimeArray1: null,
      dateTime1: null,
      startYear: 2000,
      endYear: 2050,
      leavetime: '请选择时间',
      hasDetail: 'false',
      klassId: ''
    },
    studentInfo: {},
    formData: {
      studentId: '',
      temperature: '35.0',
      retroAt: '',
      portrait: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    this.setData({
      ['leaveTime.dateTime']: obj.dateTime,
      ['leaveTime.dateTimeArray']: obj.dateTimeArray,
      ['leaveTime.dateTimeArray1']: obj1.dateTimeArray,
      ['leaveTime.dateTime1']: obj1.dateTime
    })
    //初始化一些值
    this.setData({
      klassId: wx.getStorageSync('klassId')
    })
    //查询学生信息
    this.studentInfo()
  },

  /**
   * 单项选择
   */
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      'formData.studentId': this.data.studentInfo[e.detail.value].id
    })
  },

  /**
   * 多项选择
   */
  bindMultiPickerChange: function (e) {
    const temperature = this.data.multiArray[0][e.detail.value[0]] + '.' + this.data.multiArray[1][e.detail.value[1]]
    
    this.setData({
      multiIndex: e.detail.value,
      temperature: temperature
    })
  },

  changeDateTimeColumn1(e) {
    var arr = this.data.leaveTime.dateTime1, dateArr = this.data.leaveTime.dateTimeArray1

    arr[e.detail.column] = e.detail.value
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])

    this.setData({
      'leaveTime.dateTimeArray1': dateArr
    })
  },

  changeDateTime1(e) {
    this.setData({ 'leaveTime.dateTime1': e.detail.value });
    const arr = this.data.leaveTime.dateTime1
    const y = this.data.leaveTime.dateTimeArray1[0][arr[0]]
    const M = this.data.leaveTime.dateTimeArray1[1][arr[1]]
    const d = this.data.leaveTime.dateTimeArray1[2][arr[2]]
    const h = this.data.leaveTime.dateTimeArray1[3][arr[3]]
    const m = this.data.leaveTime.dateTimeArray1[4][arr[4]]
    const leavetime = y + '-' + M + '-' + d + ' ' + h + ':' + m
    
    this.setData({
      'leaveTime.leavetime': leavetime,
      'leaveTime.hasDetail': true,
      'formData.retroAt': new Date(leavetime)
    })
  },

  /**
   * 查询学生信息
   */
  studentInfo: function () {
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/management/students?params=' + '1' + '&klassId=' + page.data.klassId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        let arr = []
        let canUseData = []
        for (var i = 0; i < res.data.length; i++) {
          var t = res.data[i]
          page.thirdFn(arr, canUseData, t)
        }
      }
    })
  },

  thirdFn: function (arr, canUseData, t) {
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/management/guardians?studentId=' + t.id + '&schoolId=' + wx.getStorageSync('schoolId'),
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res2) {
        if (res2.data.length != 0) {
          for (var j = 0; j < res2.data.length; j++) {
            if (res2.data[j].patriarch.actor.user.id == wx.getStorageSync('resData').id) {
              arr.push(t.name)
              canUseData.push(t)
            }
          }
          if (canUseData.length == 0) return
          page.setData({
            studentInfo: canUseData,
            array: arr,
            'formData.studentId': canUseData[0].id
          })
        }
      }
    })
  },
  
  submit: function(e){
    saveFormId(e.detail.formId)
    if (this.data.leaveTime.hasDetail != true){
      wx.showModal({
        title: '提示',
        content: '请选择时间',
        showCancel: false
      })
      return
    }
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/api/attendances',
      data: page.data.formData,
      header: {
        Authorization: 'Bearer ' + token
      },
      method: 'PUT',
      success: function(res) {
        wx.showModal({
          title: '提示',
          content: '补录成功',
          showCancel: false
        })
      }
    })
  },

  getFormId: function (e) {
    saveFormId(e.detail.formId)
  }
})