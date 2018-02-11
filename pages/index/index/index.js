//index.js
const app = getApp()
var vm = null
var util = require('../../../utils/util.js')
Page({
  data: {
    news:[],//新闻
    ads: [],//轮播图
    ads_farm: [], //农场实景 轮播图
    ads_us: [], //关于我们 轮播图
    class_list: [],//类别列表
    image: "http://dsyy.isart.me/tmp/wxa648f7ba502a5e59.o6zAJs3FFzas02nMmUHEIaQsPMXk.ea1116f9b46946278ac9dcbdccb9b021.png",//测试图片
    commendGoods: [],//今日推荐
    product: [
      {
        "new":"我拿着我的麦克风 唱出old school show you'll ready to roll",
        "minPrice": 2323,
        "name": "御泥坊男士黑茶清爽控油矿物泥浆面膜去黑头祛痘收缩毛孔补水新品",
        "pic": "https://cdn.it120.cc/apifactory/2017/11/27/1a7732cbf3980876238753939fc35b33.jpg",
      },
      {
        "new": "我拿着我的麦克风 唱出old school show you'll ready to roll2",
        "minPrice": 169,
        "name": "台湾欣兰黑里透白冻膜225g竹炭清洁收缩毛孔温和去黑白头面膜",
        "pic": "https://cdn.it120.cc/apifactory/2017/11/27/b0fa611cc1382f13020b2a9b9b84c935.jpg",
      },
      {
        "new": "我拿着我的麦克风 唱出old school show you'll ready to roll",
        "minPrice": 178,
        "name": "SHERO CHING",
        "pic": "https://cdn.it120.cc/apifactory/2017/11/27/ca35e9df6e0539c55b95804957d1c86d.jpg",
      },
      {
        "new": "我拿着我的麦克风 唱出old school show you'll ready to roll",
        "minPrice": 178,
        "name": "SHERO CHING",
        "pic": "https://cdn.it120.cc/apifactory/2017/11/27/ca35e9df6e0539c55b95804957d1c86d.jpg",
      },
    ],
    inputShowed: false,// 搜索
    inputVal: "",// 搜索
  },

  onLoad: function (options) {
  
    vm = this
    vm.getADs("1")
    vm.getADs("2")
    vm.getADs("3")
    vm.getList()
    vm.getByFlag()
    vm.getNews()
    
  },

  //获取推荐商品
  getByFlag: function () {
    var param = {
      offset : 0,
      page: 10
    }
    util.getByFlag(param, function (res) {
      console.log("commendGoods : " + JSON.stringify(res))
      vm.setData({
        commendGoods: res.data.ret
      })
    })
  },
  //获取新闻列表
  getNews: function () {

    var param = {

    }
    util.getNews(param, function (res) {
       console.log("getAds head : " + JSON.stringify(res))
        vm.setData({
          news: res.data.ret
        })
     
    })
  },
 
  //获取轮播图
  getADs: function (e) {
   
    var param = {
      position: e
    }
    util.getADs(param, function (res) {
      if (e === "1") {
        console.log("getAds head : " + JSON.stringify(res))
        vm.setData({
          ads: res.data.ret
        })
      } else if (e === "2") {
        console.log("getAds farm : " + JSON.stringify(res))
        vm.setData({
          ads_farm: res.data.ret
        })
      } else if (e === "3") {
        console.log("getAds us : " + JSON.stringify(res))
        vm.setData({
          ads_us: res.data.ret
        })
      }
    })
  },
  //获取首页商品类别
  getList: function () {
    util.getList({}, function (res) {
      console.log("class_list : " + JSON.stringify(res))
      vm.setData({
        class_list: res.data.ret
      })
    })
  },
  // 跳转到类别列表页
  jumpclassList: function (e) {
    // console.log(JSON.stringify(e))
    var type_id = e.currentTarget.dataset.type_id
    var pointer = e.currentTarget.dataset.pointer
    wx.navigateTo({
      url: '/pages/classList/classList?type_id=' + type_id + '&pointer=' + pointer,
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
 //跳转到农场
  farm: function () {
    wx.navigateTo({
      url: '/pages/navbar/navbar'
    })
  },
 //跳转到新闻
  news: function () {
    wx.navigateTo({
      url: '/pages/searchbar/searchbar'
    })
  }, 
  //跳转到公司介绍
  about: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  }, 
  //跳转到搜索结果页
  complete: function () {
    wx.navigateTo({
      url: '/pages/index/search/search?search_word=' + vm.data.inputVal,
    })
  },
  //根据id查询新闻

  getNewsByid: function (e) {
    console.log("传参 ： " + JSON.stringify(e))
    var newsId = e.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: '/pages/searchbar/article/article?id=' + newsId,
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
