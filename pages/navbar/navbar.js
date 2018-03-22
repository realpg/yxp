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
    // tabs: [
    //   {
    //     "pic": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
    //     "name": "农场图片",
    //   }, {
    //     "pic": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
    //     "name": "农场视频",
    //   }, {
    //     "pic": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
    //     "name": "农场地图",
    //   }],
    // activeIndex: 1,
    // sliderOffset: 0,
    // sliderLeft: 0,
    "lon": 123.467797,
    "lat": 41.744135,

    markers: [{
      iconPath: "../../images/location.png",
      id: 0,
      latitude: 41.744135,
      longitude: 123.467797,
      width: 30,
      height: 30
    }],
    
    controls: [{
      id: 1,
      iconPath: '../../images/me.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],


    tabs: ["农场图片", "农场视频", "查看地图"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    array: [],         //单列选择器
    index: 0,          //索引值
    farmList: [],      //农场数据
    FarmsDetails: {}   //农场详情
  },
  // 地图
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  //根据id获取农场详情
  getFarmsDetails: function () {
    console.log("11111" + vm.data.farmList)
    var param = {
      id: vm.data.farmList[vm.data.index].id
    }
    util.getFarmsDetails(param, function (res) {
      console.log("根据id获取农场信息 :" + JSON.stringify(res.data.ret))
      var markers = vm.data.markers
      markers.latitude = res.data.ret.lat
      markers.longitude = res.data.ret.lon
      // console.log("markers :" + JSON.stringify(res.data.ret.lat))
      vm.setData({
        markers: markers,
        FarmsDetails: res.data.ret.farm_detail
      })
    })
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
      console.log("获取生效的农场列表 : " + JSON.stringify(res))
      var farmList = res.data.ret
      var array = []
      for (var i = 0; i < farmList.length; i++) {
        array.push(farmList[i].name)
      }
      vm.setData({
        array: array,
        farmList: farmList
      })
      // console.log("111" + vm.data.farmList)
      vm.getFarmsDetails()
    })
  },
  //
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    vm.getFarmsDetails()
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
  },
  onShow: function () {
  }
});