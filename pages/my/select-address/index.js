var util = require('../../../utils/util.js')
var vm = null
//获取应用实例
var app = getApp()
Page({
  data: {
    address: [],
  },
  onLoad: function (options) {
    vm = this
    vm.getAdds();   //根据user_id查询收货地址
  },

  //根据user_id查询收货地址
  getAdds: function () {
    util.getAdds({}, function (res) {
      console.log("获取收获地址 : " + JSON.stringify(res.data.ret.adds))
      vm.setData({
        address: res.data.ret.adds
      })
    })
  },
  clickAdds: function (e) {
    var addsindex = e.currentTarget.dataset.addsindex   
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2]
    // console.log("上一个页面PAGE : " + JSON.stringify(prePage))
    if (prePage.__route__ == "pages/to-pay-order/index") {
      prePage.setAdds(vm.data.address[addsindex]);
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //跳转到添加地址页
  addAddess: function () {
    wx.navigateTo({
      url: "/pages/my/address-add/index"
    })
  },
  //跳转到编辑地址页
  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },
  //设置默认地址
  setAddsDefFlag: function (e) {
    var param = {
      id: e.target.dataset.userid
    }
    util.setAddsDefFlag(param, function (res) {
      console.log("设置默认地址 ： " + JSON.stringify(res))
      util.getAdds({}, function (res) {
        console.log("获取收获地址 : " + JSON.stringify(res.data.ret.adds))
        vm.setData({
          address: res.data.ret.adds
        })
      })
    })


  },
  //删除地址
  delete: function (e) {
    wx.showModal({
      title: '删除',
      content: '您确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var param = {
            id: e.target.dataset.deleteid
          }
          util.delAdds(param, function (res) {
            console.log("删除地址 : " + JSON.stringify(res))
            if (res.data.result) {
              vm.getAdds();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // selectTap: function (e) {
  //   var id = e.currentTarget.dataset.id;
  //   wx.request({
  //     url: app.globalData.baseUrl + '/user/shipping-address/update',
  //     data: {
  //       token: app.globalData.token,
  //       id: id,
  //       isDefault: 'true'
  //     },
  //     success: (res) => {
  //       wx.navigateBack({})
  //     }
  //   })
  // },

  // onShow : function () {
  //   this.initShippingAddress();
  // },
  // initShippingAddress: function () {
  //   var that = this;
  //   wx.request({
  //     url: app.globalData.baseUrl +'/user/shipping-address/list',
  //     data: {
  //       token:app.globalData.token
  //     },
  //     success: (res) =>{
  //       if (res.data.code == 0) {
  //         that.setData({
  //           addressList:res.data.data
  //         });
  //       } else if (res.data.code == 700){
  //         that.setData({
  //           addressList: null
  //         });
  //       }
  //     }
  //   })
  // }
})