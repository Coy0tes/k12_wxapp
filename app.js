//app.js
import { ToastPannel } from 'compoment/toast/toast'
const service = require('/utils/base.js')
const countActive = require('/utils/countActive.js')
const Promise = require('/utils/promise.js')
App({
  ToastPannel,
  onLaunch: function () {
    // debugger
    const app = this

    wx.login({
      success: function(res){
        console.log(res.code)
      }
    })

    //版本更新提示
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本更新失败，请检查您的网络环境后重启小程序'
      })
    })

    app.vessionIf()
    

    //定时发送formid
    let timer = setInterval(function(){
      if (app.globalData.gloabalFomIds && app.globalData.gloabalFomIds.length != 0) {
        var data = JSON.stringify(app.globalData.gloabalFomIds)
        wx.request({
          url: service.service.baseUrl + '/wxLogin/getPushCode',
          header: {
            Authorization: 'Bearer ' + wx.getStorageSync('userToken')
          },
          method: 'post',
          data: data,
          success: function(res){
            // console.log(res)
          }
        })
        app.globalData.gloabalFomIds = []
      } else {
        // console.log("空的")
      }
    },3000)

  },
  globalData: {
    userInfo: null
  },
  Login: function () {
    const app = this
    // 登录
    return new Promise(function(resolve, reject){
      wx.login({
        success: res => {
          const ActiveType = 'LOGIN'
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: service.service.baseUrl + '/wxLogin/web/wxTokens?code=' + res.code,
            method: 'post',
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              console.log(res)
              res.statusCode = 500
              wx.showToast({
                title: '登录中',
                icon: 'loading'
              })
              if (res.statusCode != 500) {
                wx.setStorageSync('resData', res.data)
                
                const loginTime = new Date().getTime()
                wx.setStorageSync('loginTime', loginTime)
                app.globalData.schoolId = res.data.schools[0].id
                wx.setStorageSync('schoolId', res.data.schools[0].id)
                wx.request({
                  url: service.service.baseUrl + '/tokens/school/' + app.globalData.schoolId,
                  header: {
                    Authorization: 'Bearer ' + res.data.token
                  },
                  method: 'post',
                  success: function (res) {
                    // console.log(res)
                    if (res.data.patriarch != null) {
                      if (res.data.patriarch.guardians.length != 0) {
                        wx.setStorageSync('klassId', res.data.patriarch.guardians[0].klass.id)
                      }
                      wx.setStorageSync('userToken', res.data.token)
                      wx.setStorageSync('actorId', res.data.patriarch.actor.id)
                      wx.setStorageSync('studentId', res.data.patriarch.guardians[0].student.id)
                      wx.setStorageSync('studentName', res.data.patriarch.guardians[0].student.name)
                      app.globalData.userToken = res.data.token
                      countActive(ActiveType, res.data.token)
                      wx.hideToast()
                      wx.switchTab({
                        url: '../index/index',
                      })
                      // wx.redirectTo({
                      //   url: '../login/login',
                      // })
                      resolve(res)
                    } else if (res.data.teacher != null) {
                      wx.setStorageSync('klassId', res.data.teacher.klass[0].id)
                      wx.setStorageSync('userToken', res.data.token)
                      // countActive(res)
                      countActive(ActiveType, res.data.token)
                      wx.hideToast()
                      wx.switchTab({
                        url: '../index/index',
                      })
                      resolve(res)
                    } else {
                      wx.hideToast()
                      wx.showModal({
                        title: '温馨提示',
                        content: '此程序仅限家长与老师使用',
                        showCancel: false,
                        success: function () {
                          wx.setStorageSync('userToken', res.data.token)
                          // countActive(res)
                          countActive(ActiveType, res.data.token)
                          wx.switchTab({
                            url: '../index/index',
                          })
                        }
                      })
                      resolve(res)
                    }
                  }
                })
              } else {
                wx.hideToast()
                wx.showModal({
                  title: '提示',
                  content: '登录失败，请重新登录',
                  showCancel: false,
                  confirmText: '好的',
                  success: function (res) {
                    if(res.confirm){
                      wx.redirectTo({
                        url: '/pages/login/login',
                      })
                    }
                  }
                })
                reject("error")
              }
            }
          })
        }
      })
    })
  },
  vessionIf: function(){
    const app = this
    return new Promise(function (resolve, reject){
      //判断是否需要提示用户
      if (wx.getStorageSync('nowarning')) {
        resolve()
        return
      }

      //由于操作系统安卓4.x.x时可能会出现某些闪现的bug
      //因此在此处加入更新或更换提示
      wx.getSystemInfo({
        success: function (res) {
          // res.system = 'Android 4.8.0'
          //操作系统为安卓的时候
          if (res.system.substring(0, 7) == 'Android') {
            let v = res.system.substring(8, res.system.length)
            v = v.split('.')
            if (v[0] < 5) {   //版本号为5.0.0以下的时候
              wx.showModal({
                title: '温馨提示',
                content: '由于您的机型操作系统过低，小程序可能会出现闪退或闪回前一界面等问题，如出现此类问题导致不能正常使用，请您更新机型系统或更换机型后使用，给您带来的不便，敬请谅解。',
                confirmText: '知道了',
                cancelText: '不再提示',
                success: function (res) {
                  if (res.confirm) {
                    resolve(res)
                  } else if (res.cancel) {
                    wx.setStorageSync('nowarning', true)
                    resolve(res)
                  }
                }
              })
            } else {
              resolve(res)
            }
          } else {
            resolve(res)
          }
        },
      })
    })
  }
})