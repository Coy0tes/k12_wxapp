// pages/edit/edit.js
const app = getApp()
// var uploadImage = require('../../utils/uploadFile.js')
import uploadImage from '../../utils/uploadFile.js'
var util = require('../../utils/util.js')
var config2 = require('../../utils/config.js')
const service = require('../../utils/base.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: service.service.baseUrl,
    username: "",
    sex: ["男 士", "女 士"],
    index: 0,
    imgsrc: '',
    imgsrc2: '',
    formData: {
      username: '',
      gender: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow: function(){
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
    this.setData({
      'formData.gender': userinfo.gender,
      username: wx.getStorageSync("resData").username,
      'formData.username': wx.getStorageSync("resData").username
    })
    if (wx.getStorageSync("resData").avatar == ""){
      this.setData({
        imgsrc: 'https://bdhead.oss-cn-beijing.aliyuncs.com/1540889884667.jpg'
      })
    } else {
      this.setData({
        imgsrc: "https://" + wx.getStorageSync("resData").avatar
      })
    }
    if (wx.getStorageSync("resData").portrait == ""){
      this.setData({
        imgsrc2: 'https://bdhead.oss-cn-beijing.aliyuncs.com/1540889884667.jpg'
      })
    } else {
      this.setData({
        imgsrc2: "https://" + wx.getStorageSync("resData").portrait
      })
    }
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value == 0){
      this.setData({
        'formData.gender': 'MALE'
      })
    } else {
      this.setData({
        'formData.gender': 'FEMALE'
      })
    }
  },

  changeName: function(e){
    const val = e.detail.value
    this.setData({
      'formData.username': val
    })
  },

  chooseImg: function(e){
    this.uploadImg(e.currentTarget.dataset.imgindex)
  },

  uploadImg: function(index){
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
              if(index == 1){
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

  submit: function(e){
    const submitData = this.data.formData
    if (this.data.imgsrc != 'https://bdhead.oss-cn-beijing.aliyuncs.com/1540889884667.jpg'){
      submitData.avatar = this.data.imgsrc
      submitData.portrait = this.data.imgsrc2
      submitData.avatar = submitData.avatar.substring(8, submitData.avatar.length)
      submitData.portrait = submitData.portrait.substring(8, submitData.portrait.length)
    }
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: service.service.baseUrl + '/api/users',
      method: 'put',
      header: {
        Authorization: 'Bearer ' + token
      },
      data: submitData,
      success: function(res){
        let dd = wx.getStorageSync('resData')
        const resdata = wx.getStorageSync('resData')
        dd.username = submitData.username
        dd.gender = submitData.gender
        dd.avatar = submitData.avatar
        dd.portrait = submitData.portrait
        wx.setStorageSync('resData', dd)
        wx.showModal({
          title: '提示',
          content: '修改成功',
          showCancel: false,
          success: function(){
            wx.switchTab({
              url: '../mine/mine',
            })
          }
        })
      }
    })
  }
})