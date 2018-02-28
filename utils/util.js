 var TESTMODE = false;

//服务器地址
var SERVER_URL = "https://yxp.isart.me/api";
var DEBUG_URL = "http://localhost/DSYYServer";
var SERVER_URL = (TESTMODE) ? DEBUG_URL : SERVER_URL;

///////七牛相关///////
//根据key值获取图片真实链接
function getImgRealUrl(key_v) {
  return "http://dsyy.isart.me/" + key_v;
}

//获取七牛URL，进行图片剪裁
function qiniuUrlTool(img_url, type) {
  if ((img_url == undefined || img_url == null) && type == "head_icon") {
    return "../../images/jiazai.png";
  }
  if (img_url == undefined || img_url == null) {
    return "";
  }
  var pos = img_url.indexOf("?");
  //alert(pos);
  if (pos != -1) {
    img_url = img_url.substr(0, pos);
  }
  var qn_img_url;
  switch (type) {
    case "top_ad":      //广告图片
      qn_img_url = img_url + "?imageView2/2/w/640/h/330/interlace/1";
      break;
    case "folder_index":        //首页图片
      qn_img_url = img_url + "?imageView2/2/w/450/q/75/interlace/1";
      break;
    case "message_hi":        //首页图片
      qn_img_url = img_url + "?imageView2/2/w/710/h/360/interlace/1";
      break;
    case "work_step":           //编辑的画夹步骤
      qn_img_url = img_url + "?imageView2/2/w/750/interlace/1";
      break;
    case "user_hi":  //头像
      qn_img_url = img_url + "?imageView2/1/w/200/h/200/interlac12e/1";
    case "bar_detail":  //书吧详情页
      qn_img_url = img_url + "?imageView2/1/w/750/h/384/interlace/1";
    case "user_bg":  //我的背景
      qn_img_url = img_url + "?imageView2/1/w/750/interlace/1";
      break;
  }
  return qn_img_url;
}

//获取真实的七牛云存储链接
function getRealImgUrl(img_url) {
  //如果img_url为空
  if (judgeIsAnyNullStr(img_url)) {
    return img_url
  }
  var pos = img_url.indexOf("?");
  return img_url.substring(0, pos)
}

//是否还有本地图片
function isLocalImg(img) {
  if (judgeIsAnyNullStr(img)) {
    return false;
  }
  if (img.indexOf("wxfile") >= 0) {
    return true;
  }
  return false;
}

// 获取头像
function getHeadIconA(dir, hi) {
  // console.log(hi);
  if (hi == undefined || hi.length < 15) {
    if (dir == "html") {
      return "../image/default_head_logo.png";
    } else {
      return "../image/default_head_logo.png";
    }
  }
  if (hi.indexOf('7xku37.com') < 0) {
    return hi;
  }
  return qiniuUrlTool(hi, "head_icon");
}

///接口调用相关方法///////////////////////////////////////////

//进行接口调用的基本方法
function wxRequest(url, param, method, successCallback, errorCallback) {
  console.log("wxRequest url:" + JSON.stringify(url) + " param:" + JSON.stringify(param));
  // console.log("globalData userInfo:" + JSON.stringify(getApp().globalData.userInfo))
  if (!judgeIsAnyNullStr(getApp().globalData.userInfo)) {
    //user_id未设置
    if (judgeIsAnyNullStr(param.user_id)) {
      param.user_id = getApp().globalData.userInfo.id;
      // console.log("user_id" + getApp().globalData.userInfo.id);
    }
    param.token = getApp().globalData.userInfo.token;
  }
  console.log("param：" + JSON.stringify(param))
  wx.request({
    url: url,
    data: param,
    header: {
      "Content-Type": "application/json"
    },
    method: method,
    success: function (res) {
      successCallback(res)
      hideLoading()
    },
    fail: function () {
      console.log("wxRequest fail:" + JSON.stringify())
      // errorCallback(err)
      hideLoading()
    }
  });
}

//http://localhost/yxpSrv/public/api/goodsInfo/getGoods

//获取热卖特卖商品
function getGoods(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/goodsInfo/getGoods', param, "GET", successCallback, errorCallback);
}

//获取所有生效的农场信息
function getFarmsDetails(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/farm/getFarmsDetails', param, "GET", successCallback, errorCallback);
}

//获取所有生效的农场信息
function getFarmList(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/farm/getFarmList', param, "GET", successCallback, errorCallback);
}

//删除购物车商品
function deletedShoppingCart(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/shoppingCart/deletedShoppingCart', param, "POST", successCallback, errorCallback);
}

//下单接口
function payOrder(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/wechat/payOrder', param, "POST", successCallback, errorCallback);
}

//根据user_id查购物车信息
function getShoppingCart(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/shoppingCart/getShoppingCart', param, "GET", successCallback, errorCallback);
}
//添加商品到购物车
function addShoppingCart(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/shoppingCart/addShoppingCart', param, "POST", successCallback, errorCallback);
}
//根据id获取商品详情
function getGoodsDetails(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/goodsInfo/getGoodsDetails', param, "GET", successCallback, errorCallback);
}
// 新闻所有信息
function getNews(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/news/getNews', param, "GET", successCallback, errorCallback);
}
//根据新闻id查询详情页
function getNewsByid(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/news/getNewsDetails', param, "GET", successCallback, errorCallback);
}

//根据type_id获取商品信息
function getByGoodTypeId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/goodsInfo/getByGoodTypeId', param, "GET", successCallback, errorCallback);
}

//搜索生效商品接口
function searchGoods(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/goodsInfo/searchGoods', param, "GET", successCallback, errorCallback);
}

//获取轮播图
function getADs(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/ad/getADs', param, "GET", successCallback, errorCallback);
}

//获取推荐商品接口
function getByFlag(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/goodsInfo/getByFlag', param, "GET", successCallback, errorCallback);
}

//获取商品分类列表
function getList(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/goodType/getList', param, "GET", successCallback, errorCallback);
}

//根据id获取分类详情
function getById(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/goodType/getById', param, "GET", successCallback, errorCallback);
}

//获取七牛Token
function getQiniuToken(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/getQiniuToken', param, "GET", successCallback, errorCallback);
}

//根据code获取openid
function getOpenId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/getXCXOpenId', param, "GET", successCallback, errorCallback);
}

//小程序登录
function login(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/login', param, "POST", successCallback, errorCallback);
}

//更新用户信息
function updateUserInfo(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/updateById', param, "POST", successCallback, errorCallback);
}

//返回
function navigateBack(delta) {
  wx.navigateBack({
    delta: delta
  })
}
//判断是否有空字符串
function judgeIsAnyNullStr() {
  if (arguments.length > 0) {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] == null || arguments[i] == "" || arguments[i] == undefined || arguments[i] == "undefined" || arguments[i] == "未设置") {
        return true;
      }
    }
  }
  return false;
}

//获取日期 2017-06-13
function getDateStr(str) {
  if (judgeIsAnyNullStr(str)) {
    return str
  }
  var pos = str.indexOf(' ');
  if (pos < 0) {
    return str
  }
  return str.substr(0, pos)
}
//格式化日期时间
// function formatTime(date) {
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate()
//   var hour = date.getHours()
//   var minute = date.getMinutes()
//   var second = date.getSeconds()
//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

//格式化日期时间
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//展示toast
function showToast(msg, img) {
  console.log(img);
  if (judgeIsAnyNullStr(img)) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
    })
  } else {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
      image: img
    })
  }
}
//展示modal
function showModal(title, content) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    confirmColor: "#ffcc00",
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        // confirmCallBack(res)
      } else if (res.cancel) {
        console.log('用户点击取消')
        // cancelCallBack(res)
      }
    }
  })
}
//错误modal
function showErrorModal(msg) {
  wx.showModal({
    title: '调用失败',
    content: msg,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
//展示loadding
function showLoading(msg) {
  if (!wx.canIUse('showLoading')) {
    return;
  }
  wx.showLoading({
    title: msg,
  })
}

//隐藏loadding
function hideLoading() {
  if (!wx.canIUse('hideLoading')) {
    return;
  }
  wx.hideLoading();
}
//优化字符串输出，如果str为空，则返回r_str
function conStr(str, r_str) {
  if (judgeIsAnyNullStr(str)) {
    return r_str;
  }
  return str;
}

function judgeIsAnyNullStrImp(obj) {
  if (obj.length > 0) {
    for (var i = 0; i < obj.length; i++) {
      var value = obj[i].value;
      var name = obj[i].name;
      if (value == null || value == "" || value == undefined || value == "未设置") {
        showToast("请设置" + convertEnNameToChiName(name), "../../images/close_icon.png");
        return true;
      }
    }
  }
  return false;
}

//util.js
function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片原始高
  var originalScale = originalHeight / originalWidth;//图片高宽比
  console.log('originalWidth: ' + originalWidth)
  console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比
      console.log('windowWidth: ' + windowWidth)
      console.log('windowHeight: ' + windowHeight)
      //图片缩放后的宽为屏幕宽
      imageSize.imageWidth = windowWidth;
      imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}

module.exports = {
  getADs: getADs,// 获取轮播图
  getList: getList, //获取商品分类列表
  getById: getById, //根据id获取分类详情
  getGoodsDetails: getGoodsDetails,//根据id获取商品详情
  getByFlag: getByFlag,//获取推荐商品接口
  searchGoods: searchGoods,//搜索生效商品接口
  getByGoodTypeId: getByGoodTypeId,//根据type_id获取商品信息
  getNews: getNews,//获取新闻
  getNewsByid: getNewsByid,//根据新闻id获取详情页
  updateUserInfo: updateUserInfo,           // 更新用户信息
  
  formatTime: formatTime,                   //格式化时间
  showLoading: showLoading,
  getOpenId: getOpenId,
  login: login,                             //登陆
  judgeIsAnyNullStr: judgeIsAnyNullStr,     //判断是否有空字符串
  getShoppingCart: getShoppingCart,         //根据user_id查购物车信息
  addShoppingCart: addShoppingCart,         //添加商品到购物车
  deletedShoppingCart: deletedShoppingCart, //删除购物车商品
  payOrder: payOrder,                       //下单接口
  getFarmList: getFarmList,                 //获取所有生效的农场信息
  getFarmsDetails: getFarmsDetails,         //根据农场id获取农场详情
  getGoods: getGoods,                       //获取热卖特卖商品
}
