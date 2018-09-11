// pages/allProduct/allProduct.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    Tab: 0,  //默认第一项显示为当前

    Index: 0,
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
    memberCard: [],     //会员卡商品
    giftCard: [],       //礼品卡商品
  },
  /**
 
* 点击tab切换
 
*/

  swichNav: function (e) {

    var that = this;

    //让被点击的项的currentTab与data-current对应

    if (that.data.Tab === e.target.dataset.current) {

      return false;

    } else {

      that.setData({

        Tab: e.target.dataset.current,

        Index: e.target.dataset.current,

      })

    }

  },
  onLoad: function (options) {
    vm = this
    vm.getGoods(0, 20)
    vm.getGoods(1, 10)
    vm.getGoods(2, 10)
    vm.getGoodsInfoByTypes(1)
    vm.getGoodsInfoByTypes(2)
  },

  getGoodsInfoByTypes: function (types) {
    var param = {
      types: types,
      offset: 0,
      page: 10
    }
    util.getGoodsInfoByTypes(param, function (res) {
      console.log("会员卡礼品卡商品 ： " + JSON.stringify(res))
      if (types == 1) {
        vm.setData({ memberCard: res.data.ret })
      } else {
        vm.setData({ giftCard: res.data.ret })
      }
    })

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