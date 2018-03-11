// pages/myMaterial/mymaterial.js
var app = getApp()
var vm = null
var util = require('../../../utils/util.js')
Page({
  data: {
    userInfo: [],
  },
  open: function () {
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (res) {
        // console.log("11111" + JSON.stringify(res))
        if (!res.cancel) {
          console.log(res.tapIndex)
          vm.setData({
            'userInfo.gender': res.tapIndex + 1
          })
          // console.log("11111" + JSON.stringify(vm.data.userInfo.gender))
        }
      }
    });
  },

  onLoad: function (options) {
    vm = this
    app.login()
    var userInfo = app.globalData.userInfo
    console.log('userInfo' + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
    })
  },

  card_id: function (e) {
    vm.setData({
      'userInfo.card_id': e.detail.value
    })
  },
  nick_name: function (e) {
    vm.setData({
      'userInfo.nick_name': e.detail.value
    })
    console.log("1111" + vm.data.userInfo.telephone)
  },
  email: function (e) {
    vm.setData({
      'userInfo.email': e.detail.value
    })
  },
  saveUserInfo: function () {
    var param = {
      gender: vm.data.userInfo.gender,//性别
      nick_name: vm.data.userInfo.nick_name,//电话
      card_id: vm.data.userInfo.id_card,//身份证号
      email: vm.data.userInfo.email,//电子邮箱
    }
    util.updateUserInfo(param, function (res) {
      console.log("更新用户信息：" + JSON.stringify(res))
      getApp().login()
      // wx.setStorage({
      //   key: "userInfo",
      //   data: res.data.ret
      // });
      // app.globalData.userInfo = res.data.ret;
      wx.showModal({
        title: '成功',
        content: '资料修改成功',
        confirmColor: "#DF9E2D",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var vm = this
    var userInfo = app.globalData.userInfo
    console.log("userInfo" + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
    })
  },
})