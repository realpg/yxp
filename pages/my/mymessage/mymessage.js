// pages/my/my/mymessage.js
const { extend, Tab } = require('../../../bower_components/zanui-weapp/dist/index');
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
        title: '待发货'
      }, {
        id: 'send',
        title: '待收货'
      }, {
        id: 'sign',
        title: '已完成'
      }],
      selectedId: 'all'
    },

    order: [
      {
        "name": "华府",
        "img": "https://cdn.it120.cc/apifactory/2017/11/27/1a7732cbf3980876238753939fc35b33.jpg",
        "way": "礼品卡",
        "num": "22",
        "price": "323",
        "time": "2017-10-15  14：33",
        "order_num": "BK25254114"
      },
      {
        "name": "特曼",
        "img": "https://cdn.it120.cc/apifactory/2017/11/27/1a7732cbf3980876238753939fc35b33.jpg",
        "way": "期货",
        "num": "23",
        "price": "323",
        "time": "2017-10-15  14：33",
        "order_num": "BK25254114"
      },
      {
        "name": "阿斗",
        "img": "https://cdn.it120.cc/apifactory/2017/11/27/1a7732cbf3980876238753939fc35b33.jpg",
        "way": "礼品卡",
        "num": "212",
        "price": "323",
        "time": "2017-10-15  14：33",
        "order_num": "BK25254114"
      },
      {
        "name": "死法",
        "img": "https://cdn.it120.cc/apifactory/2017/11/27/1a7732cbf3980876238753939fc35b33.jpg",
        "way": "期货",
        "num": "2122",
        "price": "323",
        "time": "2017-10-15  14：33",
        "order_num": "BK25254114"
      },
    ],
    allOrders: [],  //全部订单
  },

  onLoad: function (options) {
    vm = this
    vm.getOrdersByUserId()
  },

  //跳转到物流
  logistics: function (e) {
    console.log("获取物流id" + JSON.stringify(e.currentTarget.dataset.logisticsid))
    var id = e.currentTarget.dataset.logisticsid
    wx.navigateTo({
      url: '/pages/my/logistics/logistics?id=' + id,
    })
  },

  //获取全部订单列表
  getOrdersByUserId: function () {
    util.getOrdersByUserId({}, function (res) {
      console.log("获取全部订单列表" + JSON.stringify(res))
      vm.setData({ allOrders: res.data.ret })
    })
  },

  //根据user_id和订单状态获取订单信息
  getGoodsInfoByTypes: function (wl_status) {
    var param = {
      wl_status: wl_status,
      status: 1,
    }
    util.getOrdersByUserIdAndOrderStatus(param, function (res) {
      console.log("根据状态查询接口 : " + JSON.stringify(res))
      vm.setData({ allOrders: res.data.ret })
    })
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    console.log("导航id : " + JSON.stringify(selectedId))

    if (selectedId == "all") {
      vm.getOrdersByUserId()
    } else if (selectedId == "tosend") {
      vm.getGoodsInfoByTypes(0)
    } else if (selectedId == "send") {
      vm.getGoodsInfoByTypes(1)
    } else if (selectedId == "sign") {
      vm.getGoodsInfoByTypes(2)
    }

  },

}))