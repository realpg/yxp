var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    // 三级联动
    // 普通选择器列表设置,及初始化
    countryList: ['中国', '美国', '英国', '日本', '韩国', '巴西', '德国'],
    countryIndex: 6,
    // 省市区三级联动初始化
    region: ["四川省", "广元市", "苍溪县"],
    // 多列选择器(二级联动)列表设置,及初始化
    multiArray: [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9]],
    multiIndex: [3, 5],
    // 多列选择器(三级联动)列表设置,及初始化
    multiArray3: [[1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9]],
    multiIndex3: [3, 5, 4],
    tabs: [
      {
        "pic": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
        "name": "农场图片",
      }, {
        "pic": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
        "name": "农场视频",
      }, {
        "pic": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
        "name": "农场地图",
      }],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    vm = this;
    wx.getSystemInfo({
      success: function (res) {
        vm.setData({
          sliderLeft: (res.windowWidth / vm.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / vm.data.tabs.length * vm.data.activeIndex
        });
      }
    });
    vm.getFarmList()
  },
  //获取生效的农场信息
  getFarmList: function () {
    util.getFarmList({}, function (res) {
      console.log("获取生效的农场信息 : " + JSON.stringify(res))
      vm.setData({
        farmList: res.data.ret
      })
    })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 选择国家函数
  changeCountry(e) {
    this.setData({ countryIndex: e.detail.value });
  },
  // 选择省市区函数
  changeRegin(e) {
    this.setData({ region: e.detail.value });
  },
  // 选择二级联动
  changeMultiPicker(e) {
    this.setData({ multiIndex: e.detail.value })
  },
  // 选择三级联动
  changeMultiPicker3(e) {
    this.setData({ multiIndex3: e.detail.value })
  }
});