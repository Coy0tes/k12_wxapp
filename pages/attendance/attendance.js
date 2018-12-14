// pages/attendance/attendance.js
const app = getApp()
const service = require('../../utils/base.js')
const dateTimePicker = require('../../utils/dateTimePicker.js')
const saveFormId = require('../../utils/saveFormId.js')
const countActive = require('../../utils/countActive.js')
// var uploadImage = require('../../utils/uploadFile.js')
import uploadImage from '../../utils/uploadFile.js'
var util = require('../../utils/util.js')
var config2 = require('../../utils/config.js')
const cause = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ActiveType: 'HEALTH',
    active: 0,
    array: [],
    leaveType: ['病假', '事假', '其他'],
    leaveFor: 0,
    leaveTime: {
      date: '2018-10-01',
      time: '12:00',
      dateTimeArray: null,
      dateTime: null,
      dateTimeArray1: null,
      dateTime1: null,
      startYear: 2000,
      endYear: 2050,
      leavetime: '请选择开始时间',
      hasDetail: 'false'
    },
    backTime: {
      date: '2018-10-01',
      time: '12:00',
      dateTimeArray: null,
      dateTime: null,
      dateTimeArray1: null,
      dateTime1: null,
      startYear: 2000,
      endYear: 2050,
      backtime: '请选择结束时间',
      hasDetail: 'false'
    },
    cause,
    hasCauseDetail: 'false',
    multiArray: [
      ['35', '36', '37', '38', '39', '40', '41'],
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
     ],
    multiIndex: [0, 0],
    temperature: '35.0',
    index: 0,
    service: service.service.baseUrl,
    signData: '',
    klassId: '',
    studentId: '',
    parentImg: '',
    noImg: 'bdhead.oss-cn-beijing.aliyuncs.com/1541064112033.jpg',
    noImg2: 'bdhead.oss-cn-beijing.aliyuncs.com/1541666321086.jpg',
    date: '',
    studentInfo: {},
    specialDate: '',
    checkType: 'day',
    acount: '',
    formData: {       //请假数据
      desc: cause,
      fromDate: 0,
      reason: '',
      studentId: 0,
      toDate: 0
    },
    vacationsBook: '',
    attendanceDetail: false,
    detailIndex: 0,
    canSign: false,
    chooseChildIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    countActive(this.data.ActiveType, wx.getStorageSync('userToken'))
    const klassid = wx.getStorageSync("klassId")
    this.setData({
      klassId: klassid
    })
    this.studentInfo()
    let y = new Date().getFullYear()
    let m = new Date().getMonth() + 1
    let d = new Date().getDate()
    if (m < 10) m = '0' + m
    if (d < 10) d = '0' + d
    const today = y + '-' + m + '-' + d
    this.setData({
      date: today
    })
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    let reson = ''
    if (this.data.leaveType[this.data.leaveFor] == '病假') reson = 'SICK'
    if (this.data.leaveType[this.data.leaveFor] == '事假') reson = 'AFFAIR'
    if (this.data.leaveType[this.data.leaveFor] == '其他') reson = 'OTHER'
    this.setData({
      ['leaveTime.dateTime']: obj.dateTime,
      ['leaveTime.dateTimeArray']: obj.dateTimeArray,
      ['leaveTime.dateTimeArray1']: obj1.dateTimeArray,
      ['leaveTime.dateTime1']: obj1.dateTime,
      ['backTime.dateTime']: obj.dateTime,
      ['backTime.dateTimeArray']: obj.dateTimeArray,
      ['backTime.dateTimeArray1']: obj1.dateTimeArray,
      ['backTime.dateTime1']: obj1.dateTime,
      'formData.reason': reson,
    })
  },

  /**
   * tab切换
   */
  choose: function(e){
    const activeId = e.currentTarget.dataset.id
    this.setData({
      active: activeId
    })
    if (activeId == 1) this.daySelect()
    if (activeId == 3) this.vacationsBook()
  },

  /**
   * 单项选择
   */
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      studentId: this.data.studentInfo[e.detail.value].id,
      parentImg: this.data.noImg2
    })
  },
  bindPickerChange2: function (e) {
    this.setData({
      index: e.detail.value,
      studentId: this.data.studentInfo[e.detail.value].id,
      'formData.studentId': this.data.studentInfo[e.detail.value].id,
      parentImg: this.data.noImg2
    })
  },

  /**
   * 请假类型
   */
  bindLeavePickerChange: function(e){
    let reson = ''
    if (this.data.leaveType[e.detail.value] == '病假') reson = 'SICK'
    if (this.data.leaveType[e.detail.value] == '事假') reson = 'AFFAIR'
    if (this.data.leaveType[e.detail.value] == '其他') reson = 'OTHER'
    this.setData({
      leaveFor: e.detail.value,
      'formData.reason': reson
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

  /**
   * 日查询签到
   */
  daySelect: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + "/api/attendances?klassId=" + page.data.klassId + "&date=" + page.data.date,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function(res){
        page.setData({
          signData: res.data,
          checkType: 'day'
        })
        const studentInfo = page.data.studentInfo
        const signData = page.data.signData
        for (var i in studentInfo){
          for (var j in signData){
            if(studentInfo[i].id == signData[j].studentId){
              studentInfo[i].signInfo = signData[j]
              let earlie = studentInfo[i].signInfo.earliest
              let latest = studentInfo[i].signInfo.latest
              studentInfo[i].signInfo.earliest = page.getTime(earlie)
              studentInfo[i].signInfo.latest = page.getTime(latest)
            }
          }
        }
        page.setData({
          studentInfo: studentInfo
        })
      }
    })
  },

  bindDayChange: function(e){
    const page = this
    const token = wx.getStorageSync('userToken')
    page.setData({
      date: e.detail.value,
      checkType: 'day'
    })
    wx.request({
      url: page.data.service + '/api/attendances?studentId=' + page.data.studentId + '&klassId=' + page.data.klassId + '&date=' + page.data.date,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        page.setData({
          signData: res.data
        })
        if(res.data == '') return
        const studentInfo = page.data.studentInfo
        const signData = page.data.signData
        for (var i in studentInfo) {
          for (var j in signData) {
            if (studentInfo[i].id == signData[j].studentId) {
              studentInfo[i].signInfo = signData[j]
              let earlie = studentInfo[i].signInfo.earliest
              let latest = studentInfo[i].signInfo.latest
              studentInfo[i].signInfo.earliest = page.getTime(earlie)
              studentInfo[i].signInfo.latest = page.getTime(latest)
            }
          }
        }
        page.setData({
          studentInfo: studentInfo
        })
      }
    })
  },

  /**
   * 周签到查询
   */
  bindDateChange: function(e){
    const page = this
    const token = wx.getStorageSync('userToken')
    this.setData({
      specialDate: e.detail.value,
      checkType: e.currentTarget.dataset.type
    })
    let requestType
    if (e.currentTarget.dataset.type == '周') requestType = "WEEK"
    else if (e.currentTarget.dataset.type == '月') requestType = "MONTH"
    wx.request({
      url: page.data.service + '/api/attendances/period',
      header: {
        Authorization: 'Bearer ' + token
      },
      data: {
        "klassId": page.data.klassId,
        "type": requestType,
        "specialDate": page.data.specialDate
      },
      success: function(res){
        page.setData({
          acount: res.data.students[0].attendCount
        })
      }
    })
  },

  /**
   * 时间格式转换
   */
  getTime: function (time, hasSeconds){
    let timeY = new Date(time * 1000).getFullYear()
    let timeM = new Date(time * 1000).getMonth() + 1
    let timeD = new Date(time * 1000).getDate()
    let timeH = new Date(time * 1000).getHours()
    let timeMn = new Date(time * 1000).getMinutes()
    let timeS = new Date(time * 1000).getSeconds()
    if (timeM < 10) timeM = '0' + timeM
    if (timeD < 10) timeD = '0' + timeD
    if (timeH < 10) timeH = '0' + timeH
    if (timeMn < 10) timeMn = '0' + timeMn
    if (timeS < 10) timeS = '0' + timeS
    if (hasSeconds == false){
      return timeY + '-' + timeM + '-' + timeD + ' ' + timeH + ':' + timeMn
    } else {
      return timeY + '-' + timeM + '-' + timeD + ' ' + timeH + ':' + timeMn + ':' + timeS
    }
  },

  /**
   * 查询学生信息
   */
  studentInfo: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/management/students?params=' + '1' + '&klassId=' + page.data.klassId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function(res){
        let arr = []
        let canUseData = []
        for(var i = 0; i < res.data.length; i++){
          var t = res.data[i]
          page.thirdFn(arr, canUseData, t)
        }
        page.daySelect()
      }
    })
  },

  thirdFn: function (arr, canUseData, t){
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
            studentId: canUseData[0].id,
            parentImg: page.data.noImg2
          })
        }
      }
    })
  },

  /**
   * 签到提交
   */
  submitSign: function(e){
    const page = this
    if (this.data.parentImg == this.data.noImg2) {
      wx.showModal({
        title: '提示',
        content: '为了您的孩子安全，请您点击拍照上传本人照片',
        showCancel: false,
        success: function(){
          page.chooseImg()
        }
      })
    }
    if (this.data.canSign == false) return
    saveFormId(e.detail.formId)
    const token = wx.getStorageSync('userToken')
    var parentImg = page.data.parentImg
    // parentImg = parentImg.substring(8,parentImg.length)
    page.setData({
      parentImg: parentImg
    })
    wx.request({
      url: page.data.service + '/api/attendances',
      header: {
        Authorization: 'Bearer ' + token
      },
      method: 'post',
      data: {
        portrait: page.data.parentImg,
        studentId: page.data.studentInfo[page.data.chooseChildIndex].id,
        temperature: page.data.temperature
      },
      success: function(res){
        if(res.statusCode == 200){
          wx.showModal({
            title: '提示',
            content: '签到成功',
            showCancel: false,
            success: function (res) {
              page.daySelect()
              if (res.confirm) {
                page.setData({
                  active: 1
                })
              }
            }
          }) 
        } else{
          wx.showModal({
            title: '提示',
            content: '签到失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              } else if (res.cancel) {
                // console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },

  /**
   * 开始时间选择
   */
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
      'formData.fromDate': new Date(leavetime.replace(/-/g, '/')).getTime()
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

  /**
   * 结束时间选择
   */
  changeDateTime2(e) {
    this.setData({ 'backTime.dateTime1': e.detail.value });
    const arr = this.data.backTime.dateTime1
    const y = this.data.backTime.dateTimeArray1[0][arr[0]]
    const M = this.data.backTime.dateTimeArray1[1][arr[1]]
    const d = this.data.backTime.dateTimeArray1[2][arr[2]]
    const h = this.data.backTime.dateTimeArray1[3][arr[3]]
    const m = this.data.backTime.dateTimeArray1[4][arr[4]]
    const backtime = y + '-' + M + '-' + d + ' ' + h + ':' + m
    
    this.setData({
      'backTime.backtime': backtime,
      'backTime.hasDetail': true,
      'formData.toDate': new Date(backtime.replace(/-/g, '/')).getTime()
    })
    
  },

  changeDateTimeColumn2(e) {
    var arr = this.data.backTime.dateTime1, dateArr = this.data.backTime.dateTimeArray1

    arr[e.detail.column] = e.detail.value
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])

    this.setData({
      'backTime.dateTimeArray1': dateArr
    })
  },

  /**
   * 输入请假原因
   */
  bindTextArea: function (e){
    this.setData({
      cause: e.detail.value,
      'formData.desc': e.detail.value
    })
    if(e.detail.value.length > 5){
      this.setData({
        hasCauseDetail: true
      })
    } else {
      this.setData({
        hasCauseDetail: false
      })
    }
  },

  //提交请假
  append: function(e){
    saveFormId(e.detail.formId)
    if (this.data.hasCauseDetail == true && this.data.leaveTime.hasDetail == true && this.data.backTime.hasDetail){
      this.setData({
        'formData.studentId': this.data.studentId
      })
      const data = this.data.formData
      const page = this
      const token = wx.getStorageSync('userToken')
      wx.request({
        url: page.data.service + '/api/vacations',
        method: 'post',
        header: {
          Authorization: 'Bearer ' + token
        },
        data: data,
        success: function(res){
          // if (res.statusCode != 200) return
          if(res.statusCode == 200) {
            wx.showModal({
              title: '提示',
              content: '请假成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  page.vacationsBook()
                  page.setData({
                    active: 3
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '请假失败，请重试',
              showCancel: false
            })
          }
        }
      })
    }else {
      return
    }
  },

  /**
   * 请假记录
   */
  vacationsBook: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/api/vacations?klassId=' + page.data.klassId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function(res){
        let data = res.data
        for(var i in data){
          if (data[i].reason == 'SICK') data[i].reason = '病假'
          if (data[i].reason == 'AFFAIR') data[i].reason = '事假'
          if (data[i].reason == 'OTHER') data[i].reason = '其他'
          
          data[i].fromDate = page.getTime(data[i].fromDate, false)
          data[i].toDate = page.getTime(data[i].toDate, false)
        }
        page.guardiansChild(data)
      }
    })
  },

  //查询监护人的孩子列表
  guardiansChild: function(data1){
    const page = this
    const token = wx.getStorageSync('userToken')
    let data2 = []
    wx.request({
      url: page.data.service + '/management/guardians/findChildren',
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        //所有孩子id
        // data1[k].student.id
        //监护人孩子id
        // res.data[i].student.id
        //过滤非监护人的孩子
        for(var i in res.data){
          for(var k in data1){
            if (data1[k].student.id == res.data[i].student.id) {
              data2.push(data1[k])
            }
          }
        }
        page.setData({
          vacationsBook: data2
        })
      }
    })
  },
  /**
   * 获取formId并保存至appData
   */
  getFormId: function (e) {
    saveFormId(e.detail.formId)
  },

  chooseImg: function (e) {
    this.uploadImg()
  },

  //上传半身像
  uploadImg: function () {
    var page = this
    wx.chooseImage({
      count: 1, // 默认最多一次选择9张图
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      camera: 'front',
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var nowTime = util.formatTime(new Date());

        //支持多图上传
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          //显示消息提示框
          wx.showLoading({
            title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
            mask: true
          })

          //上传图片
          //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
          //图片路径可自行修改
          uploadImage(res.tempFilePaths[i], 'cbb/' + nowTime + '/',
            function (result) {
              console.log("======上传成功图片地址为：", result);
              result = result.substring(8,result.length)
              page.setData({
                parentImg: result,
                canSign: true
              })
              // console.log(page.data.parentImg)
              wx.hideLoading();
            }, function (result) {
              console.log("======上传失败======", result);
              wx.hideLoading()
            }
          )
        }
      }
    })
  },
  /**
   * 打开遮罩
   */
  openMask: function(e){
    const index = e.currentTarget.dataset.index
    this.setData({
      detailIndex: index,
      attendanceDetail: true
    })
  },
  /**
   * 关闭遮罩
   */
  closeMask: function(){
    this.setData({
      attendanceDetail: false
    })
  },
  /**
   * 选择孩子
   */
  chooseChild: function(e){
    const index = e.currentTarget.dataset.index
    this.setData({
      chooseChildIndex: index
    })
  }

})