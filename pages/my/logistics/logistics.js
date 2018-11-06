// pages/my/logistics/logistics.js
var util = require('../../../utils/util.js')
var vm = null
Page({
  data: {
    steps: [{
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
    order: [], //订单数据
    showNan: false, //物流是否为空
    company: [], //物流公司
    getLogisticsber: [], //物流信息
    list: [], //物流过程
    datetime: [], //物流时间
    remark: [], //物流地点
    wl_status: [], //物流状态（默认运输中）
    goods: [], //商品
    getOrdersByUserIdAndOrderStatus: [], //根据user_id和订单状态获取订单信息


    // image: 'https://s10.mogucdn.com/p2/161213/upload_76h1c5hjc8heecjehlfgekjdl2ki0_514x260.png',
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
  onLoad: function(options) {
    //页面标题
    wx.setNavigationBarTitle({
      title: '物流信息' //页面标题为路由参数 
    })
    vm = this
    var wl_np = options.wl_np
    var com = options.com
    var wl_status = options.wl_status
    var status = options.status
    vm.setData({
      wl_np: wl_np,
      com: com,
      wl_status: wl_status,
      status: status,
    })
    if (wl_np == 'null' || com == 'null') {
      console.log("物流公司为空")
      vm.setData({
        showNan: true
      })
    } else {
      // console.log("com:" + order.)
      vm.getLogisticsber(com, wl_np)
    }
    // vm.getOrders()
    vm.getLogisticsber(com, wl_np)
    vm.getOrdersByUserIdAndOrderStatus(wl_status, status)
  },

  //根据user_id和订单状态获取订单信息
  getOrdersByUserIdAndOrderStatus: function(wl_status, status) {
    var param = {
      wl_status: wl_status,
      status: status
    }
    console.log("订单----" + JSON.stringify(param))
    util.getOrdersByUserIdAndOrderStatus(param, function(res) {
      console.log("订单" + JSON.stringify(res))
      var ret = res.data.ret;
      vm.setData({
        goods: ret[0].goods
      })
    })
  },
  //查询商品物流接口
  getLogisticsber: function(com, wl_np) {
    var param = {
      com: com,
      wl_np: wl_np
    }
    console.log("查询物流------:" + JSON.stringify(param))
    util.getLogistics(param, function(res) {
      console.log("查询物流:" + JSON.stringify(res))
      var list = res.data.ret.result.list
      list.reverse()
      vm.setData({
        company: res.data.ret.result.company,
        list: list,
        wl_status: res.data.ret.result.status,
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})