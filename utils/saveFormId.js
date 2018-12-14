const app = getApp()

const saveFormId = function (formId){
  let formIds = app.globalData.gloabalFomIds
  if (!formIds) formIds = []
  let data = {
    formId: formId,
    timeOut: JSON.stringify((parseInt(new Date().getTime() / 1000) + 604800) * 1000)
  }
  formIds.push(data)
  app.globalData.gloabalFomIds = formIds
  // console.log(app.globalData.gloabalFomIds)
}

module.exports = saveFormId