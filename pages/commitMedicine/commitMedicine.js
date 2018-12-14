// pages/commitMedicine/commitMedicine.js
const app = getApp()
const service = require('../../utils/base.js')
const saveFormId = require('../../utils/saveFormId.js')
const formatTime = require('../../utils/util.js')

let animation = wx.createAnimation({
  duration: 500,
  timingFunction: 'ease-out',
  delay: 0,
  transformOrigin: '"50% 50% 0"',
})
let animation2 = wx.createAnimation({
  duration: 500,
  timingFunction: 'ease-out',
  delay: 0,
  transformOrigin: '"50% 50% 0"',
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    childId: '',
    list: '',
    childIndex: 0,
    date: '',
    add: '../../images/add.png',
    medicinename: '',
    medicineDetail: [
      {
        time: ['早饭前', '早饭后', '午饭前', '午饭后', '晚饭前', '晚饭后'],
        index: 0,
        forIndex: 0,
        middle: true,
        animation: '',
        animation2: ''
      }
    ],
    jiliang: '',
    days: '',
    childName: '李思琪',
    index2: 0,
    submitForm: {
      days: '',
      executeTime: '',    //执行时间
      klassId: wx.getStorageSync('klassId'),      //儿童所在班级
      medicineName: '',    //药品名称
      medicineTimeForms: [],
      dose: '',    //服药剂量
      remark: '',   //备注
      stuId: '',    //儿童ID
      stuName: ''   //服药儿童姓名
    },
    startF: '',
    endF: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.studentInfo()
    const d = new Date()
    let t = formatTime.formatTime(d)
    this.setData({
      date: t,
      'submitForm.executeTime': t
    })
  },

  onReady: function(){

  },

  /**
   * 查询学生信息
   */
  studentInfo: function () {
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/management/guardians/findChildren',
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        // console.log(res)
        let list = res.data
        let arr = []
        let arr2 = []
        for(var i in list){
          arr.push(list[i].student.name)
          arr2.push(list[i].student.id)
        }
        page.setData({
          list: arr,
          childId: arr2,
          'submitForm.stuName': arr[page.data.childIndex],
          'submitForm.stuId': arr2[page.data.childIndex]
        })
      }
    })
  },

  //选择孩子
  bindChildChoose: function(e){
    this.setData({
      childIndex: e.detail.value,
      'submitForm.stuName': this.data.list[e.detail.value],
      'submitForm.stuId': this.data.childId[e.detail.value],
    })
  },

  //执行时间改变
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      'submitForm.executeTime': e.detail.value
    })
  },

  //服药时间改变
  bindTimeChange: function (e) {
    // console.log(e)
    const index = e.currentTarget.dataset.index
    const t = 'medicineDetail[' + index + '].index'
    // console.log(t)
    this.setData({
      [t]: e.detail.value
    })
  },

  //添加服药时间
  add: function(){
    let newFormObj = {
      time: ['早饭前', '早饭后', '午饭前', '午饭后', '晚饭前', '晚饭后'],
      index: 0,
      forIndex: 0,
      middle: true,
      animation: '',
      animation2: ''
    }
    const oldArray2 = this.data.medicineDetail
    oldArray2.push(newFormObj)
    this.setData({
      medicineDetail: oldArray2
    })
    this.sortArray()
  },

  //药品名称
  medicineName: function(e){
    this.setData({
      'submitForm.medicineName': e.detail.value,
      medicinename: e.detail.value
    })
  },

  //每次剂量
  timece: function(e){
    this.setData({
      'submitForm.dose': e.detail.value,
      jiliang: e.detail.value
    })
  },
  //执行天数
  days: function(e){
    this.setData({
      'submitForm.days': e.detail.value,
      days: e.detail.value
    })
  },

  //备注
  remark: function(e){
    this.setData({
      'submitForm.remark': e.detail.value
    })
  },

  //touchStart
  start: function(e){
    this.setData({
      startF: e.changedTouches[0].clientX
    })
  },

  //touchEnd
  end: function(e){
    const index = e.currentTarget.dataset.index
    this.setData({
      endF: e.changedTouches[0].clientX
    })
    if (this.data.startF > this.data.endF && this.data.medicineDetail[index].middle == true){
      animation.translateX(-80).step()
      animation2.right(0).step()

      this.setData({
        ['medicineDetail[' + index + '].animation']: animation.export(),
        ['medicineDetail[' + index + '].animation2']: animation2.export(),
        ['medicineDetail[' + index + '].middle']: false,
      })
    } 
    if (this.data.startF < this.data.endF && this.data.medicineDetail[index].middle == false) {
      animation.translateX(0).step()
      animation2.right(-80).step()

      this.setData({
        ['medicineDetail[' + index + '].animation']: animation.export(),
        ['medicineDetail[' + index + '].animation2']: animation2.export(),
        ['medicineDetail[' + index + '].middle']: true,
      })
    }
  },

  //删除服药时间
  deleteMedicine: function(e){
    const arr = this.data.medicineDetail
    const index = e.currentTarget.dataset.index
    arr.splice(index, 1)
    console.log(arr)
    this.setData({
      medicineDetail: arr
    })
    this.sortArray()
  },

  //medicineDetail重新排序
  sortArray: function(){
    let data = this.data.medicineDetail
    for(var i = 0; i < data.length; i++){
      data[i].forIndex = i
    }
    this.setData({
      medicineDetail: data
    })
  },

  //提交表单
  submit: function (e){
    let data = this.data.medicineDetail
    for (var i in data) {
      for (var j in data[i].medicineDetailForms) {
        if (data[i].medicineName == '') {
          wx.showModal({
            title: '提示',
            content: '请输入药品名称',
            showCancel: false
          })
          return
        }
        if (data[i].dose == ''){
          wx.showModal({
            title: '提示',
            content: '请输入每次剂量',
            showCancel: false
          })
          return
        }
      }
    }

    for (var i in data){
      data[i].time = data[i].time[data[i].index]
      delete data[i].index
      delete data[i].animation
      delete data[i].animation2
      delete data[i].middle
      delete data[i].forIndex
    }
    console.log(data)
    this.setData({
      'submitForm.medicineTimeForms': data
    })
    const page = this
    const token = wx.getStorageSync('userToken')
    
    let submitdata = this.data.submitForm
    submitdata.executeTime = new Date(submitdata.executeTime.replace(/-/g, '/')).getTime()
    //发送到后台
    wx.request({
      url: page.data.service + '/medicine/management/pCreate',
      data: submitdata,
      header: {
        Authorization: 'Bearer ' + token
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        if(res.statusCode == 200){
          wx.showToast({
            title: '提交成功',
            success: function(){
              wx.navigateTo({
                url: '../medicine/medicine'
              })
            }
          })
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '提交失败,请检查网络后重试',
          showCancel: false,
          success: function(){
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      complete: function(res) {},
    })
  },
})