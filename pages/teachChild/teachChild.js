// pages/teachChild/teachChild.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topNav: [
      {
        imageSrc: 'https://bdhead.oss-cn-beijing.aliyuncs.com/1543479653072.jpg',
        title1: 'Bo',
        title2: '故事',
        url: ''
      },
      {
        imageSrc: 'https://bdhead.oss-cn-beijing.aliyuncs.com/1543479684068.jpg',
        title1: '育儿',
        title2: '知识',
        url: ''
      },
      {
        imageSrc: 'https://bdhead.oss-cn-beijing.aliyuncs.com/1543479694580.jpg',
        title1: '点播',
        url: ''
      },
    ],
    imgUrls: [
      'https://bdhead.oss-cn-beijing.aliyuncs.com/1543481968298.jpg',
      'https://bdhead.oss-cn-beijing.aliyuncs.com/1543481983324.jpg',
      'https://bdhead.oss-cn-beijing.aliyuncs.com/1543481996965.jpg'
    ],
    indicatorDots: true,
    indicatorColor: 'rgba(195, 195, 195, 1)',
    indicatorActiveColor: "#ffffff",
    autoplay: true,
    interval: 3000,
    duration: 500,
    boStory: [
      {
        name: '《夏天》'
      },
      {
        name: '《猜猜我有多爱你》'
      },
      {
        name: '《活了一万次的猫》'
      },
      {
        name: '《不是圆的不是方的》'
      },
      {
        name: '《和甘伯伯游河》'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})