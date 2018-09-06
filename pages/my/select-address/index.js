var util = require('../../../utils/util.js')
var vm = null
//获取应用实例
var app = getApp()
Page({

  data: {
    address: [],
    show: true
  },
  onLoad: function(options) {
    vm = this

    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2]
    // console.log("上一个页面PAGE : " + JSON.stringify(prePage))
    if (prePage.__route__ == "pages/to-pay-order/index") {
      vm.setData({
        show: false
      })
    }


  },

onShow:function(){
  vm.getAdds(); //根据user_id查询收货地址
  
},

  //用户选择收货地址
  chooseAddress: function() {
    var that = this;
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function(res) {
          console.log(JSON.stringify(res));
          console.log(res);
          that.setData({
            "add_userName": res.userName,
            "add_telNumber": res.telNumber,
            "add_provinceName": res.provinceName,
            "add_cityName": res.cityName,
            "add_countyName": res.countyName,
            "add_detailInfo": res.detailInfo,
            "add_postalCode": res.postalCode,
            //具体收货地址显示
            flag: false,
          })

          var param = {
            rec_name: res.userName,
            rec_tel: res.telNumber,
            province: res.provinceName,
            city: res.cityName,
            detail: res.detailInfo,
            zip_code: res.postalCode
          }

          util.setAddress(param,function(res) {
            console.log("查看收货地址" + JSON.stringify(res))
          })

        },
        fail: function(err) {
          console.log(JSON.stringify(err));
          console.info("收货地址授权失败");
          wx.showToast({
            title: '授权失败',
            icon: 'success',
            duration: 20000
          })
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
  },


  //根据user_id查询收货地址
  getAdds: function() {
    util.getAdds({}, function(res) {
      console.log("获取收获地址 : " + JSON.stringify(res.data.ret.adds))
      vm.setData({
        address: res.data.ret.adds
      })
    })
  },
  clickAdds: function(e) {
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
  //跳转到微信地址页
  addAddess: function() {
    wx.navigateTo({
      url: ""
      // url: "/pages/my/address-add/index"
    })
    vm.chooseAddress()
  },
  // //跳转到编辑地址页
  // editAddess: function(e) {
  //   wx.navigateTo({
  //     url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
  //   })
  // },
  //设置默认地址
  setAddsDefFlag: function(e) {
    var param = {
      id: e.target.dataset.userid
    }
    util.setAddsDefFlag(param, function(res) {
      console.log("设置默认地址 ： " + JSON.stringify(res))
      util.getAdds({}, function(res) {
        console.log("获取收获地址 : " + JSON.stringify(res.data.ret.adds))
        vm.setData({
          address: res.data.ret.adds
        })
      })
    })


  },
  //删除地址
  delete: function(e) {
    wx.showModal({
      title: '删除',
      content: '您确定要删除吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var param = {
            id: e.target.dataset.deleteid
          }
          util.delAdds(param, function(res) {
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
