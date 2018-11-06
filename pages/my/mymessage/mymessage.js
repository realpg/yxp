// pages/my/my/mymessage.js
const {
  extend,
  Tab
} = require('../../../bower_components/zanui-weapp/dist/index');
var vm = null
var util = require('../../../utils/util.js')

Page(extend({}, Tab, {
  data: {
    tab: {
      list: [{
        id: 'all',
        title: '全部'
      },
      {
        id: 'tosend',
        title: '待支付'
      }, {
        id: 'send',
        title: '待收货'
      }, {
        id: 'sign',
        title: '已完成'
      },{
        id:'lose',
        title:'过期'
      }
      ],
      selectedId: 'all'
    },

    allOrders: [], //全部订单
    allLogistics: [], //物流状态

  },

  onLoad: function (options) {
    console.log("onLoad_options" + JSON.stringify(options))
    vm = this
    vm.getOrdersByUserId()

  },
  //删除订单
  deleteOrder: function(e){
    wx.showModal({
      title: '删除',
      content: '您确定要删除吗？',
    success: function (res) {
    if (res.confirm) {
    console.log("deleteOrder_e" + JSON.stringify(e))
    var param = {
      order_id: e.currentTarget.dataset.order_id
    }
    util.deleteOrder(param,function(res){
      console.log("deleteOrder" + JSON.stringify(res))
      if (res.data.result) {
        vm.getOrdersByUserId();
        vm.getGoodsInfoByTypes();
      }
      })
    } else if (res.cancel) {} 
  }
    })},
  //确认收货
  affirmAccomplish: function (e) {
    console.log("confirmReceipt_e" + JSON.stringify(e))
    var param = {
      trade_no: e.currentTarget.dataset.trade_no
    }
    util.confirmReceipt(param, function (res) {
      console.log("confirmReceipt" + JSON.stringify(res))
      if (res.data.result) {
        vm.getOrdersByUserId();
        vm.getGoodsInfoByTypes();
      }
    })
  },
  //继续支付跳转到商品页
  goGoods: function (){
    wx.switchTab({
      url: '/pages/index/index/index'
    })
  },
  //跳转到物流
  logistics: function (e) {
    console.log("获取物流id" + JSON.stringify(e))
    var wl_np = e.currentTarget.dataset.wl_np
    var com = e.currentTarget.dataset.com
    var wl_status = e.currentTarget.dataset.wl_status
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '/pages/my/logistics/logistics?wl_np=' + wl_np + '&&com=' + com + '&&wl_status=' + wl_status + '&&status=' + status,
    })
  },
  //左滑删除
  // touchS: function (e) {
  //   if (e.touches.length == 1) {
  //     this.setData({
  //       //设置触摸起始点水平方向位置
  //       startX: e.touches[0].clientX
  //     });
  //   }
  // },
  // touchM: function (e) {
  //   if (e.touches.length == 1) {
  //     //手指移动时水平方向位置
  //     var moveX = e.touches[0].clientX;
  //     //手指起始点位置与移动期间的差值
  //     var  disX = this.data.startX - moveX;
  //     var  delBtnWidth = this.data.delBtnWidth;
  //     var  txtStyle = "";
  //     if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
  //       txtStyle = "left:0px";
  //     } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
  //         txtStyle = "left:-" + disX + "px";
  //         if (disX >= delBtnWidth) {
  //           //控制手指移动距离最大值为删除按钮的宽度
  //           txtStyle = "left:-" + delBtnWidth + "px";
  //         }}
  //     //获取手指触摸的是哪一项
  //     var index = e.target.dataset.index;
  //     var allOrders = this.data.allOrders;
  //     allOrders[index].txtStyle = txtStyle;
  //     //更新列表的状态
  //     this.setData({
  //       allOrders: allOrders
  //     });
  //   }
  // },
  // touchE: function (e) {
  //   if (e.changedTouches.length == 1) {
  //     //手指移动结束后水平位置
  //     var endX = e.changedTouches[0].clientX;
  //     //触摸开始与结束，手指移动的距离
  //     var disX = this.data.startX - endX;
  //     var delBtnWidth = this.data.delBtnWidth;
  //     //如果距离小于删除按钮的1/2，不显示删除按钮
  //     var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
  //     //获取手指触摸的是哪一项
  //     var index = e.target.dataset.index;
  //     var allOrders = this.data.allOrders;
  //     allOrders[index].txtStyle = txtStyle;
  //     //更新列表的状态
  //     this.setData({
  //       lisallOrderst: allOrders
  //     });
  //   }
  // },
  //获取全部订单列表
  getOrdersByUserId: function () {
    util.showLoading("加载中")
    util.getOrdersByUserId({}, function (res) {
      console.log("获取全部订单列表" + JSON.stringify(res))
      vm.setData({
        allOrders: res.data.ret
      })
    })
  },
  //根据user_id和订单状态获取订单信息
  getGoodsInfoByTypes: function (wl_status, status) {
    var param = {
      wl_status: wl_status,
      status: status,
    }
    util.showLoading("加载中")
    util.getOrdersByUserIdAndOrderStatus(param, function (res) {
      console.log("根据状态查询接口 : " + JSON.stringify(res))
      vm.setData({
        allOrders: res.data.ret
      })
    })
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    console.log("导航id : " + JSON.stringify(selectedId))
    // var send_satatus = [0, 1]

    if (selectedId == "all") {
      vm.getOrdersByUserId()
    } else if (selectedId == "tosend") {
      vm.getGoodsInfoByTypes(0, 0)
    } else if (selectedId == "send") {
      vm.getGoodsInfoByTypes("0,1", 1)
      // vm.getGoodsInfoByTypes(1, 1)
    } else if (selectedId == "sign") {
      vm.getGoodsInfoByTypes(2, 2)
    } else if (selectedId == "lose") {
      vm.getGoodsInfoByTypes(0, 6)
    }

  },

}))