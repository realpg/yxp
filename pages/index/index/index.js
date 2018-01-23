//index.js
const app = getApp()
var vm = null
Page({
  data: {
    swipers: [{ img: "http://dsyy.isart.me/tmp_175941487o6zAJs9QROCRLgaZb8TvqB113ZzE58966f0b773a8b9c88c3ec3d4f30bff9.jpg" },
    { img: "http://dsyy.isart.me/tmp_175941487o6zAJs9QROCRLgaZb8TvqB113ZzE58966f0b773a8b9c88c3ec3d4f30bff9.jpg" },
    { img: "http://dsyy.isart.me/tmp_175941487o6zAJs9QROCRLgaZb8TvqB113ZzE58966f0b773a8b9c88c3ec3d4f30bff9.jpg" }
    ],
    menus: [
      {
        "name": "土猪",
        "image": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
      },
      {
        "name": "土鸡",
        "image": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
      },
      {
        "name": "土鸡蛋",
        "image": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
      },
      {
        "name": "野鸡",
        "image": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
      },
      {
        "name": "野鸡蛋",
        "image": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
      },
      {
        "name": "品牌街",
        "image": "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",
      }
    ],
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
    inputShowed: false,// 搜索
    inputVal: "",// 搜索
  },

  onLoad: function () {
    vm = this
  },

  // 跳转到类别列表页
  jumpclassList: function (e) {
    // console.log(JSON.stringify(e))
    // var scrollLeft = e.currentTarget.dataset.scrollleft
    wx.navigateTo({
      url: '/pages/classList/classList',
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  complete: function () {
    wx.navigateTo({
      url: '/pages/index/search/search?input=' + vm.data.inputVal,
    })
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {

  },

})
