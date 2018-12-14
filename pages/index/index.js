//index.js
//获取应用实例
const app = getApp()
const service = require('../../utils/base.js')
const saveFormId = require('../../utils/saveFormId.js')
const formatTime = require('../../utils/util.js')

Page({
  data: {
    message: '登录页',
    imgUrls: [],
    indicatorDots: true,
    indicatorColor: 'rgba(255, 255, 255, 1)',
    indicatorActiveColor: "#87CEFA",
    autoplay: true,
    interval: 3000,
    duration: 500,
    asrc: '',
    service: service.service.baseUrl,
    topTab: [
      {
        imageSrc: 'https://www.k12soft.net/kdweb/newImage/dainping.png',
        title1: '一周',
        title2: '点评',
        url: '../familySchool/familySchool',
        count: ''
      },
      {
        imageSrc: 'https://www.k12soft.net/kdweb/newImage/banjidongtai.png',
        title1: '班级',
        title2: '动态',
        url: '../dyamic/dyamic?goId=1',
        count: ''
      },
      {
        imageSrc: 'https://www.k12soft.net/kdweb/newImage/chuqiandaka.png',
        title1: '出勤',
        title2: '打卡',
        url: '../attendance/attendance',
      }
    ],
    nav: [
      {
        url: '../notice/notice?goId=3',
        imageSrc: '../../images/tongzhitixing.png',
        text: '通知提醒',
        count: 1
      },
      {
        url: '../plan/plan?goId=2',
        imageSrc: '../../images/banjijihua.png',
        text: '班级计划'
      },
      {
        url: '../information/information?goId=4',
        imageSrc: '../../images/tijian.png',
        text: '体检'
      },
      {
        url: '../cookBook/cookBook',
        imageSrc: '../../images/meizhoushipu.png',
        text: '每周食谱'
      },
      {
        url: '../teacher/teacher',
        imageSrc: '../../images/banjijiaoshi.png',
        text: '班级教师'
      },
      {
        url: '../homeWork/homeWork',
        imageSrc: '../../images/qinzizuoye.png',
        text: '亲子作业'
      },
      {
        url: '../kindergartenHub/kindergartenHub',
        imageSrc: '../../images/yuansuoguanwang.png',
        text: '园所官网'
      },
      {
        url: '../medicine/medicine',
        imageSrc: '../../images/weiyaojihua.png',
        text: '喂药计划'
      },
      {
        url: '../children/children',
        imageSrc: '../../images/banjiyouer.png',
        text: '班级幼儿'
      },
      {
        url: '../klassLive/klassLive',
        imageSrc: '../../images/banjizhibo.png',
        text: '班级直播'
      }
    ]
  },
  onLoad: function (options) {
    if (app.globalData.goId == 3) {
      app.globalData.goId = ''
      wx.navigateTo({
        url: '../notice/notice?goId=3',
      })
    } else if (app.globalData.goId == 1) {
      app.globalData.goId = ''
      wx.navigateTo({
        url: '../plan/plan?goId=1',
      })
    } else if (app.globalData.goId == 4) {
      app.globalData.goId = ''
      wx.navigateTo({
        url: '../information/information?goId=4',
      })
    }
    const code = wx.getStorageSync("code")
    const page = this
    this.setData({
      message: code
    })
    app.globalData.userToken = wx.getStorageSync('userToken')
    app.globalData.klassId = wx.getStorageSync('klassId')

  },

  onShow: function(){
    const page = this
    if (!wx.getStorageSync('userToken')) {
      setTimeout(function(){
        //获取班级动态数量
        page.getFeeds()
        //获取未读通知
        page.getNoticeUnread()
        //获取未反馈点评数量
        page.getFamilySchool()

        app.globalData.userToken = wx.getStorageSync('userToken')
        app.globalData.klassId = wx.getStorageSync('klassId')
        //获取园所图片
        page.getImg()
      },1000)
    } else {
      //获取班级动态数量
      page.getFeeds()
      //获取未读通知
      page.getNoticeUnread()
      //获取未反馈点评数量
      page.getFamilySchool()

      app.globalData.userToken = wx.getStorageSync('userToken')
      app.globalData.klassId = wx.getStorageSync('klassId')
      //获取园所图片
      page.getImg()
    }
    
  },
  
  go: function (e) {
    saveFormId(e.detail.formId)
    const index = e.currentTarget.dataset.id
    let thisUrl = this.data.nav[index].url

    // wx.navigateTo({
    //   url: thisUrl,
    // })
    const page = this
    const token = wx.getStorageSync('userToken')
    const actorId = wx.getStorageSync('actorId')
    if(index == 9){
      const d = new Date()
      let t = formatTime.formatTime(d)
      wx.request({
        url: page.data.service + '/feeDetails/management/findBy?localDate=' + t + '&actorId=' + actorId,
        header: {
          Authorization: 'Bearer ' + token
        },
        method: 'get',
        success: function(res){
          console.log(res)
          if (res.data == [] || res.data.isState == false || res.data == ''){
            //没有权限观看视频
            wx.showModal({
              title: '温馨提示',
              content: '您暂无观看班级直播权限，确认前往购买吗？',
              confirmText: '确认',
              cancelText: '取消',
              success: function(res){
                if(res.confirm){
                  wx.navigateTo({
                    url: '../wxpay/wxpay'
                  })
                }
              }
            })
          }
          if(res.data.isState == true){
            wx.showModal({
              title: '温馨提示',
              content: '您已购买，请前往“青苗宝贝”公众号下载APP观看班级直播视频',
              showCancel: false,
              confirmText: '我知道了'
            })
          }
        },
        fail: function(err){
          console.log(err)
        }
      })
    } 
    // else if(index == 10){
    //   // 允许从相机和相册扫码
    //   wx.scanCode({
    //     success(res) {
    //       console.log(res)
    //     }
    //   })
    // } 
    else {
      wx.navigateTo({
        url: thisUrl,
      })
    }
  },

  go2: function(e){
    saveFormId(e.detail.formId)
    const index = e.currentTarget.dataset.id
    let thisUrl = this.data.topTab[index].url

    wx.navigateTo({
      url: thisUrl,
    })
  },

  getFeeds: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    const klassId = wx.getStorageSync('klassId')
    let fromId
    if (wx.getStorageSync('fromId')) fromId = wx.getStorageSync('fromId')
    else fromId = 0
    wx.request({
      url: page.data.service + '/api/klass-feeds/unread?fromId=' + fromId + '&klassId=' + klassId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function(res){
        const count = res.data.count
        page.setData({
          ['topTab[1].count']: count
        })
      }
    })
  },

  getNoticeUnread: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    const klassId = wx.getStorageSync('klassId')
    let fromId
    if (wx.getStorageSync('NoticeFromId')) fromId = wx.getStorageSync('NoticeFromId')
    else fromId = 0
    wx.request({
      url: page.data.service + '/api/klass-plans/unread?fromId=' + fromId + '&klassId=' + klassId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        const count = res.data.NOTICE
        page.setData({
          ['nav[0].count']: count
        })
      }
    })
  },

  getFamilySchool: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    wx.request({
      url: page.data.service + '/weeklyrRemark/management/countUnRead',
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        page.setData({
          ['topTab[0].count']: res.data
        })
      }
    })
  },

  getImg: function(){
    const page = this
    const token = wx.getStorageSync('userToken')
    const schoolId = wx.getStorageSync('schoolId')
    wx.request({
      url: page.data.service + '/management/marquees?schoolId=' + schoolId,
      header: {
        Authorization: 'Bearer ' + token
      },
      success: function(res){
        const first = 'https://' + res.data[0].firstImg
        const center = 'https://' + res.data[0].centerImg
        const last = 'https://' + res.data[0].lastImg
        page.setData({
          ['imgUrls[0]']: first,
          ['imgUrls[1]']: center,
          ['imgUrls[2]']: last,
        })
      }
    })
  },

  ImgTap: function(e){

    // if(e.currentTarget.dataset.index == 2){
    //   wx.navigateTo({
    //     url: '../wxpay/wxpay',
    //   })
    // }
  },

  getFormId: function(e){
    saveFormId(e.detail.formId)
  }
})
