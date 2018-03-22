// pages/my/my/my.js
const app = getApp()
var util = require('../../../utils/util.js')
var vm = null

Page({
  data: {
    userInfo: {},
    grids: [
      {
        navigator: '/pages/my/mymessage/mymessage',
        img: "../../../images/my/orders.png",
        text: "我的订单"
      }, {
        navigator: '/pages/my/member/member?id=1',
        img: "../../../images/my/gift.png",
        text: "礼品卡"
      }, {
        navigator: '/pages/my/member/member?id=2',
        img: "../../../images/my/member.png",
        text: "会员卡"
      }, {
        navigator: '/pages/my/select-address/index',
        img: "../../../images/my/adds.png",
        text: "收货地址"
      }, {
        navigator: '',
        img: "../../../images/my/service.png",
        text: "客服"
      }, {
        navigator: '',
        img: "../../../images/my/us.png",
        text: "关于我们"
      }
    ]
  },

  onLoad() {
    vm = this
  },

  onShow() {
    this.getUserInfo();
    this.getMember();    //获取会员信息
  },

  // 根据user_id获取会员信息
  getMember: function () {
    util.getMember({}, function (res) {
      console.log("会员信息 ： " + JSON.stringify(res));
    })
  },

  //获取缓存
  getUserInfo: function () {
    var test = util.Utils.numberToChinese(30000)

    var that = this
    var userInfo = app.globalData.userInfo
    var score = userInfo.score
    var userInfoType = userInfo.type
    if (userInfoType == 0) {
      vm.setData({ member: "非会员" })
      userInfo.score = 0
    } else if (userInfoType == 1) {
      if (isNaN(score)) {
        vm.setData({ member: "一级" })
      } else {
        var grade = parseInt(score / 100) + 1
        grade = util.Utils.numberToChinese(grade)
        grade = grade + "级"
        vm.setData({ member: grade })
      }
    }

    console.log("获取用户信息 ：" + JSON.stringify(userInfo))
    vm.setData({
      userInfo: userInfo
    })
  },

  // allOrder(e) {
  //   var _id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: "/pages/my/mymessage/mymessage?id=" + _id
  //   })
  // },

  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统由ISART艺术互联网公司设计制作，祝大家使用愉快！',
      showCancel: false
    })
  },

  getUserAmount: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/user/amount',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
            freeze: res.data.data.freeze,
            score: res.data.data.score
          });
        }
      }
    })
  },

  relogin: function () {
    var that = this;
    app.globalData.token = null;
    app.login();
    wx.showModal({
      title: '提示',
      content: '重新登陆成功',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.onShow();
        }
      }
    })
  },
  recharge: function () {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function () {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  }
})