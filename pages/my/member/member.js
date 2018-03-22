// pages/my/member/member.js
var util = require('../../../utils/util.js')
var vm = null
Page({

  data: {
    member: [],    //会员卡信息
    isNall: false,  //判断是否有数据

    image: 'https://s10.mogucdn.com/p2/161213/upload_76h1c5hjc8heecjehlfgekjdl2ki0_514x260.png',
    title: '数据为空',
    tip: '您现在没有可以使用的礼品卡或会员卡',
    button: '去购买'
  },

  onAbnorTap() {
    wx.switchTab({
      url: '/pages/allProduct/allProduct',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    if (options.id == 1) {
      vm.getGiftCard()
    } else {
      vm.getMember();
    }
    wx.setNavigationBarTitle({
      title: '',
    })
  },
  // 根据user_id获取会员信息
  getMember: function () {
    util.getMember({}, function (res) {
      console.log("会员信息 ： " + JSON.stringify(res));
      var member = res.data.ret
      if (member.length == 0) {
        vm.setData({ isNall: true })
      }
      for (var i = 0; i < member.length; i++) {
        if (member[i].expiration_date == null) {
          member[i].expiration_date = "无限期"
        }
        console.log("到期时间 ：" + JSON.stringify(member[i]))
      }
      vm.setData({ member: res.data.ret })
    })
  },
  // 获取礼品卡信息
  getGiftCard: function () {
    util.getGiftCard({}, function (res) {
      console.log("礼品卡信息 ： " + JSON.stringify(res));
      var member = res.data.ret
      if (member.length == 0) {
        console.log("礼品卡数据为空 ：")
        vm.setData({ isNall: true })
      }
      for (var i = 0; i < member.length; i++) {
        if (member[i].expiration_date == null) {
          member[i].expiration_date = "无限期"
        }
        console.log("到期时间 ：" + JSON.stringify(member[i]))
      }
      vm.setData({ member: res.data.ret })
    })
  },

  //跳转到首页
  getToIndex: function () {
    wx.switchTab({
      url: '/pages/index/index/index',
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