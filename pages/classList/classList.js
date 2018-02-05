// pages/classList/classList.js
var util = require('../../utils/util.js')
var app = getApp();
var vm = null
var offset = 0
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    type_id: '',//类别id
    goods: [],//全部旅游数据
    class_list: [], //类别列表
    class_length: ''//列表长度
  },
  onLoad: function (options) {
    console.log("333333333" + JSON.stringify(options))
    vm = this
    var type_id = options.type_id// 类别id
    var currentTab = options.pointer// 指针   
    vm.setData({
      type_id: type_id,
      currentTab: currentTab
    })
    console.log("加载 currentTab ：" + vm.data.currentTab)
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        // console.log("11111111111" + JSON.stringify(res))
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        // var calc = clientHeight * rpxR - 180;
        var calc = clientHeight * rpxR;
        // console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    vm.getList()
    vm.getByGoodTypeId()
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    // console.log("滚动" + JSON.stringify(e))
    var currentTab = e.detail.current  //指针
    var type_id = vm.data.class_list[currentTab].id//类别id
    vm.setData({
      currentTab: currentTab,
      type_id: type_id
    })
    vm.getByGoodTypeId()
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    console.log("点击菜单" + cur)
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  //获取商品类别
  getList: function () {
    util.getList({}, function (res) {
      console.log("class_list : " + JSON.stringify(res.data.ret))
      vm.setData({
        class_list: res.data.ret,
        class_length: res.data.ret.length
      })
    })
  },
  //获取商品列表
  getByGoodTypeId: function () {
    // console.log("类别id" + JSON.stringify(vm.data.type_id))
    util.showLoading("加载列表")
    var param = {
      type_id: vm.data.type_id// 类别id
    }
    util.getByGoodTypeId(param, function (res) {
      // console.log("商品列表" + JSON.stringify(res.data.ret))
      vm.setData({
        goods: res.data.ret
      })
    })
  },

  jumpTravelDetails: function (e) {
    var travelid = e.currentTarget.dataset.travelid
    console.log("jumpTravelDetails is : " + JSON.stringify(travelid))
    wx.navigateTo({
      url: '/pages/travelDetails/travelDetails?travelid=' + travelid,
    })
  },

})