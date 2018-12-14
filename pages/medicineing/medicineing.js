// pages/medicineing/medicineing.js
const app = getApp()
const service = require('../../utils/base.js')
const formatTime = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    date: '2018-09-01',
    add: '../../images/add.png',
    id: '',
    medicineTime: [
      { time: '12:01' },
      { time: '12:01' },
      { time: '12:01' },
    ],
    childName: '李思琪',
    other: '孩子有些上火，希望给多喝水，谢谢老师。',
    data: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      const id = options.id
      this.medicineing(id)
      this.setData({
        id: id
      })
    }
    else {
      this.medicineing()
    }
    
  },

  //查询进行中
  medicineing: function(id){
    //通过有无id判断查询方式
    if(id){       
      this.getData1(id)
    } else {
      this.getData2()
    }
  },

  //通过id获取数据
  getData1: function(id){
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/medicine/management/findOne?id=' + id,
      header: {
        Authorization: 'Bearer ' + token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
        let data = res.data
        let t = new Date(data.executeTime * 1000)
        t = formatTime.formatTime(t)
        data.executeTime = t
        page.setData({
          data: data
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //无id获取数据
  getData2: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    const d = new Date()
    const t = formatTime.formatTime(d)
    wx.request({
      url: page.data.service + '/medicine/management/findDoneForParent?localDate=' + t,
      header: {
        Authorization: 'Bearer ' + token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
        let data = res.data
        for (var i in data) {
          let t = new Date(data[i].executeTime * 1000)
          t = formatTime.formatTime(t)
          data[i].executeTime = t
        }
        page.setData({
          data: data
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  stopMedicine: function(e){
    const index = e.currentTarget.dataset.index
    console.log(e)
    const id = this.data.data[index].id
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.showModal({
      title: '温馨提示',
      content: '确认停止孩子继续服用当前药单吗？',
      confirmText: '确认',
      cancelText: '取消',
      success: function(res){
        if(res.confirm){
          wx.request({
            url: page.data.service + '/medicine/management/stopMedicine?medicineId=' + id,
            header: {
              Authorization: 'Bearer ' + token
            },
            method: 'PUT',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              console.log(res)
              if (res.statusCode == 200) {
                wx.showToast({
                  title: '停药成功'
                })
                page.getData2()
              }
            },
            fail: function (res) {
              wx.showModal({
                title: '温馨提示',
                content: '停止失败，请检查您的网络后重试',
                showCancel: false
              })
            },
            complete: function (res) { },
          })
        }
      }
    })
  },

  stopMedicine2: function(){
    const id = this.data.data.id
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.showModal({
      title: '温馨提示',
      content: '确认停止孩子继续服用当前药单吗？',
      confirmText: '确认',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: page.data.service + '/medicine/management/stopMedicine?medicineId=' + id,
            header: {
              Authorization: 'Bearer ' + token
            },
            method: 'PUT',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              console.log(res)
              if (res.statusCode == 200) {
                wx.showToast({
                  title: '停药成功'
                })
                page.getData1(page.data.id)
              }
            },
            fail: function (res) {
              wx.showModal({
                title: '温馨提示',
                content: '停止失败，请检查您的网络后重试',
                showCancel: false
              })
            },
            complete: function (res) { },
          })
        }
      }
    })
  },

  pushAgain: function(e){
    const page = this
    const token = wx.getStorageSync('userToken')
    if(this.data.id == ''){
      const index = e.currentTarget.dataset.index
      let data = this.data.data
      let date = formatTime.formatTime(new Date())
      console.log(data[index])
    } else {
      wx.showModal({
        title: '提示',
        content: '确认再次提交当前药单吗？',
        confirmText: '确认提交',
        cancelText: '取消',
        success: function(e){
          if(e.confirm){
            let data = page.data.data
            console.log(data)
            var arr = []
            for (var i in data.medicineTime) {
              var obj = {
                time: data.medicineTime[i].time
              }
              arr.push(obj)
            }
            let time = new Date(data.executeTime.replace(/-/g, '/')).getTime()
            let submitData = {
              days: data.days,
              dose: data.dose,
              executeTime: time,
              klassId: data.klassId,
              medicineName: data.medicineName,
              medicineTimeForms: arr,
              remark: data.remark,
              stuId: data.stuId,
              stuName: data.stuName
            }
            console.log(submitData)
            //发送到后台
            wx.request({
              url: page.data.service + '/medicine/management/pCreate',
              data: submitData,
              header: {
                Authorization: 'Bearer ' + token
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                  wx.showToast({
                    title: '提交成功',
                    success: function () {
                      wx.navigateBack({
                        delta: 2
                      })
                    }
                  })
                }
              },
              fail: function (res) {
                wx.showModal({
                  title: '提示',
                  content: '提交失败,请检查网络后重试',
                  showCancel: false
                })
              },
              complete: function (res) { },
            })
          }
        }
      })
    }
  }
})