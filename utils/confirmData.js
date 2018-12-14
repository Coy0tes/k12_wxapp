/**
   * 整理数据
   */
const confirmData = function (arr1, arr2) {
  let newArr = arr1
  if(arr2.length != 0){
    for (var i = 0; i < arr2.length - 1; i++) {
      newArr.push(arr2[i])
    }
  }
  let temp
  for (var i = 0; i < newArr.length - 1; i++) {
    for (var j = i + 1; j < newArr.length; j++) {
      if (newArr[i] == null || newArr[j] == null) continue
      if (newArr[i].id == newArr[j].id && newArr[i].title == newArr[j].title) {
        newArr.splice(j, 1)
      }
    }
  }
  for (var i = 0; i < newArr.length; i++) {
    for (var j = i + 1; j < newArr.length; j++) {
      if (newArr[i] == null || newArr[j] == null) continue
      if (newArr[i].id < newArr[j].id) {
        temp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = temp
      }
    }
  }
  return newArr
}

module.exports = confirmData