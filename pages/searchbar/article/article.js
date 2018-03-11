var vm = null;
var util = require('../../../utils/util.js')
// pages/jkhkj.js
Page({
  data: {
    news: [],        //全部数据
    id: '',
    news_details: [],    //新闻图片 文字 视频详情数据
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    vm = this
    var id = options.id
    vm.setData({ id: id })
    vm.getNewsByid()
  },
  // setTitle:function(){
  //   var title = vm.data.news.title
  //   console.log("title  ： " + JSON.stringify(title))    
  //   wx.setNavigationBarTitle({
  //     title: title
  //   })
  // },
  getNewsByid: function () {
    var param = {
      id: vm.data.id
    }
    util.getNewsByid(param, function (res) {
      console.log("获取新闻详情 ：" + JSON.stringify(res))
      var news = res.data.ret
      wx.setNavigationBarTitle({
        title: news.title
      })
      news.created_at = util.convertDateFormateM(news.created_at);
      vm.setData({
        news: news,
        news_details: news.news_details
      })
    })
  },

  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    // vm.setTitle()
  },

})