//index.js
//获取应用实例
const {
  Field,
  extend
} = require('../../bower_components/zanui-weapp/dist/index');

var app = getApp()
var util = require('../../utils/util.js')
var vm = null
var showInvoice = true
Page(extend({}, Field, {
  data: {
    to_pay_order: {}, //获取本地缓存数据  订单数据
    goods_details: {}, //商品详情
    adds: {
      isNall: true
    }, //返回的地址
    showAdds: '请选择收货地址', //展示地址
    showInvoice: true, //展示发票
    defaultAdds: {
      isNall: true
    }, //默认地址

    goodsList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，

    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null // 当前选择使用的优惠券
  },

  // 输入框内容更改时触发
  handleZanFieldChange({
    componentId,
    detail
  }) {
    // console.log("11111" + JSON.stringify(detail.value))
    if (componentId == 'name') {
      vm.setData({
        company: detail.value
      })
      console.log("单位名字" + JSON.stringify(detail.value))
    } else if (componentId == 'num') {
      vm.setData({
        num: detail.value
      })
      console.log("纳税人识别号" + JSON.stringify(detail.value))
    }
    /*
     * componentId 即为在模板中传入的 componentId
     * 用于在一个页面上使用多个 tab 时，进行区分
     * detail 即输入框中的内容
     */
    /*
     * 处理函数可以直接 return 一个字符串，将替换输入框的内容。
     */
  },
  // 输入框聚焦时触发
  handleZanFieldFocus({
    componentId,
    detail
  }) {},
  // 输入框失焦时触发
  handleZanFieldBlur({
    componentId,
    detail
  }) {},

  onLoad: function(e) {
    vm = this;
    var orderType = e.orderType
    //显示收货地址标识
    vm.setData({
      isNeedLogistics: 1,
      orderType: orderType
    });
    // if (orderType == "buyNow") {
    vm.getStorage()
    vm.getInvoice()
    // } else if (orderType == "shopCar") {
    // }
  },
  //获取缓存数据  By Acker
  getStorage: function() {
    wx.getStorage({
      key: 'to_pay_order',
      success: function(res) {
        console.log("11" + JSON.stringify(res))
        vm.setData({
          to_pay_order: res.data
        })
      }
    })
    wx.getStorage({
      key: 'goods_details',
      success: function(res) {
        console.log("11" + JSON.stringify(res))
        vm.setData({
          goods_details: res.data
        })

        console.log("商品数据：" + JSON.stringify(res.data))

      }
    })
  },

  onShow: function() {
    var vm = this;
    var shopList = [];
    //立即购买下单
    if ("buyNow" == vm.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    vm.setData({
      goodsList: shopList,
    });
    // vm.initShippingAddress(); by Acker
  },
  //获取发票名头输入框的值
  getInput: function(e) {
    console.log("发票名头" + JSON.stringify(e.detail.value))
    // this.setData({
    //   inputValue: e.detail.value
    // })
  },
  //添加发票信息
  addInvoice: function(e) {
    var param = {
      type: 0,
      cu_name: ""
    }
    util.addInvoice(param, function(res) {
      console.log("添加发票" + JSON.stringify(res))
    })
  },
  //获取默认地址
  getInvoice: function() {
    util.defaultAdds({}, function(res) {
      console.log("获取默认地址 : " + JSON.stringify(res.data.ret))
      vm.setData({
        adds: res.data.ret
      })
    })
  },
  //发票开关
  switch2Change: function(e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    // showInvoice = !showInvoice
    if (!e.detail.value) {
      vm.setData({
        company: '',
        num: ''
      })
    }
    vm.setData({
      showInvoice: showInvoice = !showInvoice,
    })
  },

  order: function() {
    if (vm.data.adds.isNall) {
      console.log("2222")
      wx.showModal({
        title: '错误',
        content: '请先设置您的收货地址！',
        showCancel: false
      })
      return
    }
    if (showInvoice == false) {
      if (util.judgeIsAnyNullStr(vm.data.company) || util.judgeIsAnyNullStr(vm.data.num)) {
        wx.showToast({
          title: '发票信息不能为空',
          icon: "none"
        })
        return
      }
      var param = {
        type:0,
        cu_name: vm.data.company,
        tax_code: vm.data.num
      }
      util.addInvoices(param, function(res) {
        console.log("添加发票 ：" + JSON.stringify(res))
        vm.payOrder()
      })
      return
    }
    vm.payOrder()
  },

  //支付
  payOrder: function() {
    var to_pay_order = vm.data.to_pay_order
    var param = {}
    if (vm.data.orderType == "shopCar") {

      var goods = []
      //如果在购物车中下单
      for (var i = 0; i < to_pay_order.goods.length; i++) {
        var paramIndex = {
          goods_id: to_pay_order.goods[i].goods_id.id,
          count: to_pay_order.goods[i].count,
          total_fee: to_pay_order.goods[i].total_fee,
        }
        goods.push(paramIndex)
      }

      param = {
        total_fee: to_pay_order.total_fee,
        address_id: vm.data.adds.id,
        invoice_id: "",
        goods: goods
      }

      //如果立即购买
    } else {
      var goods_details = vm.data.goods_details
      // var goods_list = []
      // goods_list.push(to_pay_order.goods)
      param = {
        total_fee: to_pay_order.total_fee,
        address_id: vm.data.adds.id,
        invoice_id: "",
        goods: to_pay_order.goods
      }
    }

    console.log("支付参数" + JSON.stringify(param))

    util.payOrder(param, function(res) {
      if (res.data.result) {

        console.log("支付成功回掉" + JSON.stringify(res))
        wx.requestPayment({
          timeStamp: res.data.ret.timeStamp,
          nonceStr: res.data.ret.nonceStr,
          package: res.data.ret.package,
          signType: res.data.ret.signType,
          paySign: res.data.ret.paySign,
          success: function(res) {
            wx.navigateTo({
              url: '/pages/paySucceed/paySucceed',
            })
          },
          fail: function(res) {}
        })
      } else {
        util.showToast("支付错误 请联系管理员")
        console.log("支付错误" + JSON.stringify(res.data))
      }

    })


    //   if (res.data.result) {
    //     console.log("支付成功回掉" + JSON.stringify(res))
    //     wx.requestPayment({
    //       timeStamp: res.data.ret.timeStamp,
    //       nonceStr: res.data.ret.nonceStr,
    //       package: res.data.ret.package,
    //       signType: res.data.ret.signType,
    //       paySign: res.data.ret.paySign,
    //     })
    //   } else {
    //     util.showToast("支付错误 请联系管理员")
    //     console.log("支付错误" + JSON.stringify(res.data))
    //   }
    // }, function(err) {
    //   console.log("支付失败回掉" + JSON.stringify(err))
    // })


  },

  //设置地址 By Acker
  setAdds: function(adds) {
    console.log("返回的地址 ：" + JSON.stringify(adds))
    vm.setData({
      adds: adds,
      showAdds: adds.province
    })
  },


  getDistrictId: function(obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder: function(e) {
    wx.showLoading();
    var vm = this;
    var loginToken = app.globalData.token // 用户登录 token
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }

    var postData = {
      token: loginToken,
      goodsJsonStr: vm.data.goodsJsonStr,
      remark: remark
    };
    if (vm.data.isNeedLogistics > 0) {
      if (!vm.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
      postData.provinceId = vm.data.curAddressData.provinceId;
      postData.cityId = vm.data.curAddressData.cityId;
      if (vm.data.curAddressData.districtId) {
        postData.districtId = vm.data.curAddressData.districtId;
      }
      postData.address = vm.data.curAddressData.address;
      postData.linkMan = vm.data.curAddressData.linkMan;
      postData.mobile = vm.data.curAddressData.mobile;
      postData.code = vm.data.curAddressData.code;

    }
    if (vm.data.curCoupon) {
      postData.couponId = vm.data.curCoupon.id;
    }
    if (!e) {
      postData.calculate = "true";
    }
    postData.payOnDelivery = 1;

    wx.request({
      url: app.globalData.baseUrl + '/order/create',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: postData, // 设置请求的 参数
      success: (res) => {
        wx.hideLoading();
        if (res.data.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }

        if (e && "buyNow" != vm.data.orderType) {
          // 清空购物车数据
          wx.removeStorageSync('shopCarInfo');
        }
        if (!e) {
          vm.setData({
            isNeedLogistics: res.data.data.isNeedLogistics,
            allGoodsPrice: res.data.data.amountTotle,
            allGoodsAndYunPrice: res.data.data.amountLogistics + res.data.data.amountTotle,
            yunPrice: res.data.data.amountLogistics
          });
          vm.getMyCoupons();
          return;
        }
        // 配置模板消息推送
        var postJsonString = {};
        postJsonString.keyword1 = {
          value: res.data.data.dateAdd,
          color: '#173177'
        }
        postJsonString.keyword2 = {
          value: res.data.data.amountReal + '元',
          color: '#173177'
        }
        postJsonString.keyword3 = {
          value: res.data.data.orderNumber,
          color: '#173177'
        }
        postJsonString.keyword4 = {
          value: '订单已关闭',
          color: '#173177'
        }
        postJsonString.keyword5 = {
          value: '您可以重新下单，请在30分钟内完成支付',
          color: '#173177'
        }
        app.sendTempleMsg(res.data.data.id, -1,
          'uJQMNVoVnpjRm18Yc6HSchn_aIFfpBn1CZRntI685zY', e.detail.formId,
          'pages/index/index', JSON.stringify(postJsonString));
        postJsonString = {};
        postJsonString.keyword1 = {
          value: '您的订单已发货，请注意查收',
          color: '#173177'
        }
        postJsonString.keyword2 = {
          value: res.data.data.orderNumber,
          color: '#173177'
        }
        postJsonString.keyword3 = {
          value: res.data.data.dateAdd,
          color: '#173177'
        }
        app.sendTempleMsg(res.data.data.id, 2,
          'GeZutJFGEWzavh69savy_KgtfGj4lHqlP7Zi1w8AOwo', e.detail.formId,
          'pages/order-details/index?id=' + res.data.data.id, JSON.stringify(postJsonString));
        // 下单成功，跳转到订单管理界面
        wx.redirectTo({
          url: "/pages/order-list/index"
        });
      }
    })
  },
  initShippingAddress: function() {
    var vm = this;
    wx.request({
      url: app.globalData.baseUrl + '/user/shipping-address/default',
      data: {
        token: app.globalData.token
      },
      success: (res) => {
        if (res.data.code == 0) {
          vm.setData({
            curAddressData: res.data.data
          });
        } else {
          vm.setData({
            curAddressData: null
          });
        }
        vm.processYunfei();
      }
    })
  },
  processYunfei: function() {
    var vm = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;

    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number;

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }


      let inviter_id = 0;
      let inviter_id_storge = wx.getStorageSync('inviter_id_' + carShopBean.goodsId);
      if (inviter_id_storge) {
        inviter_id = inviter_id_storge;
      }


      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0, "inviter_id":' + inviter_id + '}';
      goodsJsonStr += goodsJsonStrTmp;


    }
    goodsJsonStr += "]";
    //console.log(goodsJsonStr);
    vm.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: goodsJsonStr
    });
    vm.createOrder();
  },
  addAddress: function() {
    wx.navigateTo({
      url: "/pages/my/address-add/index"
    })
  },
  selectAddress: function() {
    wx.navigateTo({
      url: "/pages/my/select-address/index"
    })
  },
  // 选择发票
  selectInvoice: function() {
    wx.showToast({
      icon: "none",
      title: '未开发 敬请期待',
    })
  },
  getMyCoupons: function() {
    var vm = this;
    wx.request({
      url: app.globalData.baseUrl + '/discounts/my',
      data: {
        token: app.globalData.token,
        status: 0
      },
      success: function(res) {
        if (res.data.code == 0) {
          var coupons = res.data.data.filter(entity => {
            return entity.moneyHreshold <= vm.data.allGoodsAndYunPrice;
          });
          if (coupons.length > 0) {
            vm.setData({
              hasNoCoupons: false,
              coupons: coupons
            });
          }
        }
      }
    })
  },
  bindChangeCoupon: function(e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex == -1) {
      this.setData({
        youhuijine: 0,
        curCoupon: null
      });
      return;
    }
    //console.log("selIndex:" + selIndex);
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex]
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.removeStorage({
      key: 'to_pay_order',
      success: function(res) {
        console.log(res.data)
      }
    })
    wx.removeStorage({
      key: 'goods_details',
      success: function(res) {
        console.log(res.data)
      }
    })
  },


}))