const app = getApp()
import uploadImage from '../../utils/uploadFile.js'
var util = require('../../utils/util.js')
var config2 = require('../../utils/config.js')
const service = require('../../utils/base.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentId: '',
    service: service.service.baseUrl,
    date: '',
    name: "",
    sex: ["男 孩", "女 孩"],
    noImg: 'https://bdhead.oss-cn-beijing.aliyuncs.com/1540889884667.jpg',
    index: 0,
    imgsrc: '',
    formData: {
      name: '',
      gender: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.studentId)
    const d = new Date()
    const t = util.formatTime(d)
    this.setData({
      studentId: options.studentId,
      date: t
    })
    
  },

  onShow: function () {
    const userinfo = wx.getStorageSync('resData')
    if (userinfo.gender == 'MALE') {
      this.setData({
        index: 0
      })
    } else {
      this.setData({
        index: 1
      })
    }
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value == 0) {
      this.setData({
        'formData.gender': 'MALE'
      })
    } else {
      this.setData({
        'formData.gender': 'FEMALE'
      })
    }
  },

  changeName: function (e) {
    const val = e.detail.value
    this.setData({
      'formData.username': val
    })
  },

  chooseImg: function (e) {
    this.uploadImg(e.currentTarget.dataset.imgindex)
  },

  uploadImg: function (index) {
    var page = this
    wx.chooseImage({
      count: 1, // 默认最多一次选择9张图
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
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
              // console.log("======上传成功图片地址为：", result);
              if (index == 1) {
                page.setData({
                  imgsrc: result
                })
              } else {
                page.setData({
                  imgsrc2: result
                })
              }
              wx.hideLoading();
            }, function (result) {
              // console.log("======上传失败======", result);
              wx.hideLoading()
            }
          )
        }
      }
    })
  },

  submit: function (e) {
    const submitData = this.data.formData
    if (this.data.imgsrc != 'https://bdhead.oss-cn-beijing.aliyuncs.com/1540889884667.jpg') {
      submitData.avatar = this.data.imgsrc
      submitData.avatar = submitData.avatar.substring(8, submitData.avatar.length)
    }
    const token = wx.getStorageSync('userToken')
    const page = this
    wx.request({
      url: service.service.baseUrl + '/management/students/' + page.data.studentId,
      method: 'put',
      header: {
        Authorization: 'Bearer ' + token
      },
      data: submitData,
      success: function (res) {
        let dd = wx.getStorageSync('resData')
        const resdata = wx.getStorageSync('resData')
        dd.name = submitData.name
        dd.gender = submitData.gender
        dd.avatar = submitData.avatar
        wx.setStorageSync('resData', dd)
        wx.showModal({
          title: '提示',
          content: '修改成功',
          showCancel: false,
          success: function () {
            
          }
        })
      }
    })
  }
})