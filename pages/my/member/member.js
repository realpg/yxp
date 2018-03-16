// pages/my/member/member.js
var util = require('../../../utils/util.js')
var vm = null
Page({

  data: {
    member: []  //会员卡信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    vm.getMember();
  },

  // 根据user_id获取会员信息
  getMember: function () {
    util.getMember({}, function (res) {
      console.log("会员信息 ： " + JSON.stringify(res));
      var member = res.data.ret
      for (var i = 0; i < member.length; i++) {
        if (member[i].expiration_date == null) {
          member[i].expiration_date = "无限期"
        }
        console.log("到期时间 ：" + JSON.stringify(member[i]))
      }
      vm.setData({ member: res.data.ret })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})