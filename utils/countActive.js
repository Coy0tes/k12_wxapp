const app = getApp()
const service = require('base.js')


const countActive = function (wxActiveType, token) {
  var source = 'WXAPP'
  let data = {
    source: source,
    wxActiveType: wxActiveType
  }
  wx.request({
    url: service.service.baseUrl + '/wxLogin/countActive?wxActiveType=' + data.wxActiveType + '&source=' + data.source,
    method: 'post',
    header: {
      Authorization: 'Bearer ' + token
    },
    success: function(res){
      // console.log(res)
    },
    fail: function(res){
      // console.log(res)
    }
  })
}

module.exports = countActive