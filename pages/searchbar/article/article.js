var vm = null;
var util = require('../../../utils/util.js')
// pages/jkhkj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: [],
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    vm = this
    var id = options.id
    vm.setData({id:id})
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
      id:vm.data.id
    }
    util.getNewsByid(param, function (res) {
      vm.setData({
        news: res.data.ret
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