// pages/my/logistics/logistics.js
var util = require('../../../utils/util.js')
var vm = null
Page({
  data: {
    steps: [
      {
        // 此步骤是否当前完成状态
        current: true,
        // 此步骤是否已经完成
        done: true,
        // 此步骤显示文案
        text: '步骤一',
        // 此步骤描述语
        desc: '10.01'
      },
      {
        done: true,
        current: false,
        text: '步骤二',
        desc: '10.02'
      },
      {
        done: true,
        current: false,
        text: '步骤三',
        desc: '10.03'
      }
    ],
    order: [],       //订单数据
    showNan: false,   //物流是否为空

    image: 'https://s10.mogucdn.com/p2/161213/upload_76h1c5hjc8heecjehlfgekjdl2ki0_514x260.png',
    title: '正在备货中',
    tip: '请您耐心等候',
    button: '返回上一页'
  },

  onAbnorTap() {
    // wx.showToast({
    //   title: 'custom',
    //   duration: 2000
    // });
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    console.log(options)
    vm.getOrders(options.id)
  },

  getOrders: function (id) {
    var param = {
      id: id
    }
    util.getOrders(param, function (res) {
      console.log("订单数据 ：" + JSON.stringify(res))
      var order = res.data.ret
      vm.setData({ order: order })
      if (isNaN(order.com)) {
        console.log("物流公司为空")
        vm.setData({ showNan: true })
      } else {
        vm.getLogistics(res.com, res.wl_np)
      }
    })
  },
  //查询商品物流接口
  getLogistics: function (com, wl_np) {
    var param = {
      com: com,
      wl_np: wl_np
    }
    util.getLogistics(param, function (res) {
      console.log("查询物流:" + JSON.stringify(res))
      vm.setData({})
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