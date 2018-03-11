// pages/allProduct/allProduct.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    product: [
      {
        "minPrice": 2323,
        "name": "御泥坊男士黑茶清爽控油矿物泥浆面膜去黑头祛痘收缩毛孔补水新品",
        "pic": "https://cdn.it120.cc/apifactory/2017/11/27/1a7732cbf3980876238753939fc35b33.jpg",
      },
      {
        "minPrice": 169,
        "name": "台湾欣兰黑里透白冻膜225g竹炭清洁收缩毛孔温和去黑白头面膜",
        "pic": "https://cdn.it120.cc/apifactory/2017/11/27/b0fa611cc1382f13020b2a9b9b84c935.jpg",
      },
      {
        "minPrice": 178,
        "name": "SHERO CHING",
        "pic": "https://cdn.it120.cc/apifactory/2017/11/27/ca35e9df6e0539c55b95804957d1c86d.jpg",
      },
      {
        "minPrice": 178,
        "name": "SHERO CHING",
        "pic": "https://cdn.it120.cc/apifactory/2017/11/27/ca35e9df6e0539c55b95804957d1c86d.jpg",
      },
    ],
    commonProduct: [],  //普通商品列表
    hotProduct: [],     //热卖商品列表
    specialProduct: [], //特别商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    vm.getGoods(0, 20)
    vm.getGoods(1, 10)
    vm.getGoods(2, 10)
  },
  //查询商品列表
  getGoods: function (sales_status, page) {
    util.showLoading("加载中")
    var param = {
      sales_status: sales_status,
      offset: 0,
      page: page
    }
    util.getGoods(param, function (res) {
      console.log("商品列表" + sales_status + JSON.stringify(res))

      if (sales_status == 0) {
        vm.setData({
          commonProduct: res.data.ret
        })
      } else if (sales_status == 1) {
        vm.setData({
          hotProduct: res.data.ret
        })
      } else {
        vm.setData({
          specialProduct: res.data.ret
        })
      }

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