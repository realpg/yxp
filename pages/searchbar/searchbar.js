var vm = null;
var util = require('../../utils/util.js')
Page({
    data: {
        news: [],//新闻
        inputShowed: false,
        inputVal: ""
    },

    onLoad: function (options) {
      vm = this
      vm.getNews();
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
     news: function () {
      wx.navigateTo({
        url: '/pages/searchbar/article/article'
     })
    },
    
     getNewsByid:function(e){
       console.log("传参 ： " + JSON.stringify(e))
      var newsId= e.currentTarget.dataset.newsid;
      wx.navigateTo({
        url: '/pages/searchbar/article/article?id=' + newsId,
      })
     },
     getNews: function (e) {

       var param = {
       
       }
       util.getNews(param, function (res) {
         console.log("getAds head : " + JSON.stringify(res))
         vm.setData({
           news: res.data.ret
         })

       })
     },
});