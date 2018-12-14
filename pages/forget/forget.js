// pages/regist/regist.js
const app = getApp()
const service = require('../../utils/base.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invat: '邀请码',
    canSubmit: false,
    canGetInvat: true,
    myData: {
      mobile: '',
      secretcode: '',
      password: '',
      secpass: ''
    },
    content: '',
    service: service.service.baseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp()
    new app.ToastPannel()

  },

  openToastPannel: function () {
    this.show(this.data.content)
  },

  /**
   * 验证
   */
  vaild: function (e) {
    const data = this.data.myData
    let data2 = e.currentTarget.dataset
    for (let i in data) {
      for (let k in data2) {
        if (i == k) data[i] = e.detail.value
      }
    }
    this.setData({
      myData: data
    })
    //设置一个所有数据不为空可以通过的信号
    let has = true
    for (var i in data) {
      if (data[i] == '') has = false
    }
    if (has == true) {
      this.setData({
        canSubmit: true
      })
    } else {
      this.setData({
        canSubmit: false
      })
    }
  },

  /**
   * 提交表单
   */
  formSubmit: function (e) {
    if (this.data.canSubmit == false) return
    const data = this.data.myData
    //验证数据格式
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if (!(reg.test(data.mobile))) {
      this.setData({
        content: '手机号不存在'
      })
      this.openToastPannel()
      return
    }
    if (data.password.length < 6) {
      this.setData({
        content: '密码不能少于6位'
      })
      this.openToastPannel()
      return
    }
    if (data.password != data.secpass) {
      this.setData({
        content: '两次密码不一致'
      })
      this.openToastPannel()
      return
    }
    const sc = data.secretcode
    delete (data['secpass'])
    delete (data['secretcode'])
    data.secretCode = sc
    this.setData({
      myData: data
    })
    const submitData = this.data.myData
    submitData.secretCode = Number(submitData.secretCode)
    const page = this
    wx.request({
      url: page.data.service + '/users/' + submitData.mobile + '/password',
      method: 'PUT',
      data: {
        code: submitData.secretCode,
        password: submitData.password
      },
      success: function(res){
        if (res.statusCode != 200) return
        page.setData({
          content: '修改成功'
        })
        page.openToastPannel()
        wx.redirectTo({
          url: '../login/login',
        })
      }
    })
  },

  /**
   * 发送验证码
   */
  getInvat: function(){
    if (this.data.canGetInvat == false) return
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if (!(reg.test(this.data.myData.mobile))) {
      this.setData({
        content: '手机号不存在'
      })
      this.openToastPannel()
      return
    }
    const page = this
    wx.request({
      url: page.data.service + '/users/' + this.data.myData.mobile + '/password',
      method: 'post',
      success: function(res){
        let t = 20
        page.setData({
          canGetInvat: false
        })
        let timer = setInterval(function(){
          page.setData({
            invat: t + 's'
          })
          if(t == 0) {
            clearInterval(timer)
            page.setData({
              canGetInvat: true,
              invat: '重新发送'
            })
          }
          else t--
        },1000)
      }
    })
  }
})