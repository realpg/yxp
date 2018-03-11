// pages/productDetail/productDetail.js
//获取应用实例
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail: {},
    swiperCurrent: 0,
    hasMoreSelect: false,
    hasCoupons: false,
    couponsList: [],
    couponsList1: [],
    selectSize: "选择：",
    selectSizePrice: 0,
    shopNum: 0,
    hideShopPopup: true,
    hideCouponPopup: true,
    buyNumber: 0,   //规格数量
    buyNumMin: 1,
    buyNumMax: 0,
    propertyChildIds: "",

    goods_details: [],//商品详情

    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo: {},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
    content: "<p><img src=\"https://cdn.it120.cc/apifactory/2017/11/27/24cd472b18b9eeabe17a1c061b35c64b.jpg\" style=\"\" title=\"apifactory/2017/11/27/24cd472b18b9eeabe17a1c061b35c64b.jpg\"/></p><p><img src=\"https://cdn.it120.cc/apifactory/2017/11/27/213077e0344967fe6befbdbcb98e778f.jpg\" style=\"\" title=\"apifactory/2017/11/27/213077e0344967fe6befbdbcb98e778f.jpg\"/></p><p><img src=\"https://cdn.it120.cc/apifactory/2017/11/27/51e649288f385043b4e04ddafc407dc1.jpg\" style=\"\" title=\"apifactory/2017/11/27/51e649288f385043b4e04ddafc407dc1.jpg\"/></p><p><img src=\"https://cdn.it120.cc/apifactory/2017/11/27/efe8eaa72e72957445bd839a77248deb.jpg\" style=\"\" title=\"apifactory/2017/11/27/efe8eaa72e72957445bd839a77248deb.jpg\"/></p><p><img src=\"https://cdn.it120.cc/apifactory/2017/11/27/1ec84754b3fc8afb4127997a36f0dd5f.jpg\" style=\"\" title=\"apifactory/2017/11/27/1ec84754b3fc8afb4127997a36f0dd5f.jpg\"/></p><p><br/></p>"
  },
  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad: function (e) {
    vm = this
    console.log("商品详情页id : " + JSON.stringify(e.id))
    var param = {
      id: e.id
    }
    util.getGoodsDetails(param, function (res) {
      console.log("商品详情信息 ： " + JSON.stringify(res.data.ret))
      vm.setData({
        goods_details: res.data.ret
      })
    })
    WxParse.wxParse('datail', 'html', vm.data.content, vm, 5);

    // vm.payOrder()

    if (e.inviter_id) {
      wx.setStorage({
        key: 'inviter_id_' + e.id,
        data: e.inviter_id
      })
    }
    var that = this;
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        });
      }
    })
    wx.request({
      url: app.globalData.baseUrl + '/shop/goods/detail',
      data: {
        // id: e.id
        id: 12316
      },
      success: function (res) {
        console.log("返回数据 ：" + JSON.stringify(res))
        var selectSizeTemp = "";
        if (res.data.data.properties) {
          for (var i = 0; i < res.data.data.properties.length; i++) {
            selectSizeTemp = selectSizeTemp + " " + res.data.data.properties[i].name;
          }
          that.setData({
            hasMoreSelect: true,
            selectSize: that.data.selectSize + selectSizeTemp,
            selectSizePrice: res.data.data.basicInfo.minPrice,
          });
        }
        that.data.goodsDetail = res.data.data;
        that.setData({
          goodsDetail: res.data.data,
          selectSizePrice: res.data.data.basicInfo.minPrice,
          buyNumMax: res.data.data.basicInfo.stores,
          buyNumber: (res.data.data.basicInfo.stores > 0) ? 1 : 0
        });
        // WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
      }
    })
    this.reputation(e.id);
    this.getCoupons(e.id);
  },

  //获取商品优惠券
  getCoupons(id) {
    var self = this;
    wx.request({
      url: app.globalData.baseUrl + '/discounts/coupons',
      data: {
        refId: id
      },
      success: function (res) {
        if (res.data.code == 0) {
          self.setData({
            hasCoupons: true,
            couponsList: res.data.data
          })
        }
      }
    })
    wx.request({
      url: app.globalData.baseUrl + '/discounts/coupons',
      data: {},
      success: function (res) {
        if (res.data.code == 0) {
          self.setData({
            hasCoupons: true,
            couponsList1: res.data.data
          })
        }
      }
    })
  },
  //用户领取优惠券
  receiveCoupons(e) {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '错误',
            content: '来晚了',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '错误',
            content: '你领过了，别贪心哦~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 30001) {
          wx.showModal({
            title: '错误',
            content: '您的积分不足',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '错误',
            content: '已过期~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  goShopCar: function () {
    // wx.reLaunch({
    //   url: "/pages/shop-cart/index"
    // });
    wx.reLaunch({
      url: "/pages/shop-cart/shop-cart"
    });
  },
  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
    /*    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
          this.bindGuiGeTap();
          return;
        }
        if(this.data.buyNumber < 1){
          wx.showModal({
            title: '提示',
            content: '暂时缺货哦~',
            showCancel:false
          })
          return;
        }
        this.addShopCar();
        this.goShopCar();*/
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },
  /**
   * 优惠券弹出框
   */
  bindCouponTap: function () {
    this.setData({
      hideCouponPopup: false
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true,
      hideCouponPopup: true
    })
  },
  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  labelItemTap: function (e) {
    var that = this;
    /*
    console.log(e)
    console.log(e.currentTarget.dataset.propertyid)
    console.log(e.currentTarget.dataset.propertyname)
    console.log(e.currentTarget.dataset.propertychildid)
    console.log(e.currentTarget.dataset.propertychildname)
    */
    // 取消该分类下的子栏目所有的选中状态
    var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
    }
    // 设置当前选中状态
    that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
    // 获取所有的选中规格尺寸数据
    var needSelectNum = that.data.goodsDetail.properties.length;
    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    for (var i = 0; i < that.data.goodsDetail.properties.length; i++) {
      childs = that.data.goodsDetail.properties[i].childsCurGoods;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ":" + childs[j].id + ",";
          propertyChildNames = propertyChildNames + that.data.goodsDetail.properties[i].name + ":" + childs[j].name + "  ";
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {
      wx.request({
        url: app.globalData.baseUrl + '/shop/goods/price',
        data: {
          goodsId: that.data.goodsDetail.basicInfo.id,
          propertyChildIds: propertyChildIds
        },
        success: function (res) {
          that.setData({
            selectSizePrice: res.data.data.price,
            propertyChildIds: propertyChildIds,
            propertyChildNames: propertyChildNames,
            buyNumMax: res.data.data.stores,
            buyNumber: (res.data.data.stores > 0) ? 1 : 0
          });
        }
      })
    }


    this.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit: canSubmit
    })
  },
  /**
  * 加入购物车
  */
  addShopCar: function () {
    var param = {
      good_id: vm.data.goods_details.id,
      number: vm.data.buyNumber
    }
    util.addShoppingCart(param, function (res) {
      console.log("加入购物车 ： " + JSON.stringify(res))
      if (res.data.result == true) {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }
      vm.closePopupTap()
    })
  },
	/**
	  * 立即购买
	  */
  buyNow: function () {
    if (vm.data.goods_details.count == 0) {
      wx.showModal({
        title: '库存不足',
        content: '抱歉,剩余数量不足',
        showCancel: false
      })
      return
    }

    var goods_list = [] //数组形式的商品列表
    var total_fee = vm.data.goods_details.price * vm.data.buyNumber//总金额
    var goods = {
      goods_id: vm.data.goods_details.id,   //商品id
      count: vm.data.buyNumber,             //商品数量
      total_fee: total_fee                  //当前商品价格
    }
    // goods_list.push(goods)
    var to_pay_order = {
      total_fee: total_fee,
      goods: goods
    }
    wx.setStorage({
      key: 'to_pay_order',
      data: to_pay_order,
    })
    wx.setStorage({
      key: 'goods_details',
      data: vm.data.goods_details,
    })
    wx.navigateTo({
      url: '/pages/to-pay-order/index',
    })

    // var param = {
    //   total_fee: total_fee,
    //   address_id: 1,
    //   invoice_id: 1,
    //   goods: goods_list
    // }
    // util.payOrder(param, function (res) {
    //   console.log("支付成功回掉" + JSON.stringify(res))
    //   wx.requestPayment({
    //     timeStamp: res.data.ret.timeStamp,
    //     nonceStr: res.data.ret.nonceStr,
    //     package: res.data.ret.package,
    //     signType: res.data.ret.signType,
    //     paySign: res.data.ret.paySign,
    //   })
    // })
  },
  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function () {
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    return shopCarInfo;
  },
	/**
	 * 组建立即购买信息
	 */
  // buliduBuyNowInfo: function () {
  //   var shopCarMap = {};
  //   shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
  //   shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
  //   shopCarMap.name = this.data.goodsDetail.basicInfo.name;
  //   shopCarMap.propertyChildIds = this.data.propertyChildIds;
  //   shopCarMap.label = this.data.propertyChildNames;
  //   shopCarMap.price = this.data.selectSizePrice;
  //   shopCarMap.left = "";
  //   shopCarMap.active = true;
  //   shopCarMap.number = this.data.buyNumber;
  //   shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
  //   shopCarMap.logistics = this.data.goodsDetail.logistics;
  //   shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;
  //   var buyNowInfo = {};
  //   if (!buyNowInfo.shopNum) {
  //     buyNowInfo.shopNum = 0;
  //   }
  //   if (!buyNowInfo.shopList) {
  //     buyNowInfo.shopList = [];
  //   }
  //   buyNowInfo.shopList.push(shopCarMap);
  //   return buyNowInfo;
  // },
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + app.globalData.uid,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },
  reputation: function (goodsId) {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/shop/goods/reputation',
      data: {
        goodsId: goodsId
      },
      success: function (res) {
        if (res.data.code == 0) {
          //console.log(res.data.data);
          that.setData({
            reputation: res.data.data
          });
        }
      }
    })
  }
})
