// pages/activityDetail/activityDetail.js
var WxParse = require('../../wxParse/wxParse.js');
const saveFormId = require('../../utils/saveFormId.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    message: '',
    data: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let data = options.data
    const title = options.title
    data = data.split("")
    
    for(var i in data){
      var ss = '&nbsp;'
      if (data[i] == '%') data[i] = '='
      if (data[i] === '@') data[i] = '&nbsp;'
    }
    data = data.join("")
    // if (data.content.indexOf("UTF-8") == 0) console.log(data.content)
    this.setData({
      title: title,
    })
    WxParse.wxParse('article', 'html', data, this, 0)
  },

  getFormId: function (e) {
    saveFormId(e.detail.formId)
  }
})