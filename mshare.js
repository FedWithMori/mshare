/*
 *  移动端分享插件  v0.1
 *  author mori
 *  兼容程度： 兼容各类主流手机浏览器
 */ 

 (function(){
  //默认属性值
 	var defaults = {
 		url: "",
 		title: "",
 		img: "",
 		desc: "",
    from: ""
 	};
  var UA = navigator.appVersion,
      isucBrowser = (UA.split("UCBrowser/").length > 1) ? 1 : 0,
      oWrap = document.querySelector(".share-container"),
      oShare,
      oCopy;
  //渲染结构
  function createHtml(){
    var sHtml = '<div class="layer-share">'
                +'  <ul class="share-icon-wrap">'
                +'      <li data-type="kWeixin" data-app="WechatFriends" class="share-icon-item" id="wx">'
                +'          <span class="img-box">'
                +'              <img src="images/wx.png">'
                +'          </span>'
                +'          <span class="text-box">微信好友</span>'
                +'      </li>'
                +'      <li data-type="kWeixinFriend" data-app="WechatTimeline" class="share-icon-item" id="wx-zone">'
                +'          <span class="img-box">'
                +'              <img src="images/wx_zone.png">'
                +'          </span>'
                +'          <span class="text-box">朋友圈</span>'
                +'      </li>'
                +'      <li data-type="kSinaWeibo" data-app="SinaWeibo" class="share-icon-item" id="wb">'
                +'          <span class="img-box">'
                +'              <img src="images/wb.png">'
                +'          </span>'
                +'          <span class="text-box">新浪微博</span>'
                +'      </li>'
                +'      <li data-type="kQQ" data-app="QQ" class="share-icon-item" id="qq">'
                +'          <span class="img-box">'
                +'              <img src="images/qq.png">'
                +'          </span>'
                +'          <span class="text-box">QQ好友</span>'
                +'      </li>'
                +'      <li data-type="kQZone" data-app="QZone" class="share-icon-item" id="qq-zone">'
                +'          <span class="img-box">'
                +'              <img src="images/qq_zone.png">'
                +'          </span>'
                +'          <span class="text-box">QQ空间</span>'
                +'      </li>'
                +'  </ul>'
                +'  <div class="cory-link-wrap">'
                +'      <span class="cory-tit">长按复制下方链接，去粘贴给好友吧：</span>'
                +'      <span class="cory-cont">'
                +'          <a href="'+defaults.url+'" target="_blank" class="cory-cont-link">'+ defaults.url +'</a>'
                +'      </span>'
                +'  </div>'
                +'  <span class="btn-close">取消</span>'
                +'</div>'
                +'<div class="layer-shade"></div>';
    oWrap.innerHTML = sHtml;
    oShare = document.querySelector(".share-icon-wrap"),
    oCopy = document.querySelector(".cory-link-wrap");
  }
  // 事件委托
  function bind(dom,name,fn,e) {
    //dom为绑定事件的元素
    //name是待执行的事件对象
    //fn回调函数
    var e = e || window.event,
        t = e.target || e.srcElement,
        klass,
        nameArr = name ? name.split(",") : [];
    //当前dom元素等于事件绑定的dom元素的时候，停止“冒泡”
    for(var i=0; i<nameArr.length; i++){
      var k = t;
      while(k && k !== dom) {
        klass = k.className;
        if(klass == nameArr[i]) {
          fn(k);
          break;
        }
        //获取当前dom元素的父元素节点
        k = k.parentNode;
      }
    }
  };
  // 注册事件
  function registerEvent(){
    oWrap.onclick = function(){
      // 绑定分享目标的点击事件
      bind(oWrap,"share-icon-item",checkShareAction);
      // 绑定取消分享事件
      bind(oWrap,"layer-shade,btn-close",cancelShare);
    }
  }
  // 分享操作判断,target为目标元素
  function checkShareAction(target){
    var id = target.attributes["data-type"].value,
        toApp = target.attributes["data-app"].value;
    if(isucBrowser){
      ucShare(toApp);
    }else{
      switch(id){
        case "kWeixin" :
        case "kWeixinFriend" :
          oShare.style.display = "none";
          oCopy.style.display = "block";
          break;
        case "kSinaWeibo" :
          var wbLink = 'http://v.t.sina.com.cn/share/share.php?title='+ defaults.title+'&url='+defaults.url+'&content=utf-8&sourceUrl='+defaults.url+'&pic='+defaults.img;
          window.open(wbLink); 
          break;
        case "kQQ" :
          var qqLink = 'http://connect.qq.com/widget/shareqq/index.html?url=' + defaults.url + '&title=' + defaults.title + '&description=' + '' + '&charset=utf-8';
          window.open(qqLink); 
          break;
        case "kQZone" :
          var qzLink = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?site=www.tuan2.com&title=' + defaults.title + '&desc=' + defaults.desc + '&summary=' + '分享分享' + '&url=' + defaults.url + 'pic' + defaults.img;
          window.open(qzLink);
          break;
        default:;
      }
    }
  }
  // 调用uc浏览器内置的分享接口
  function ucShare(toApp){
    if (toApp == 'QZone') {
        B = "mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url="+defaults.img+"&title="+defaults.title+"&description="+defaults.desc+"&url="+defaults.url+"&app_name="+defaults.from;
        k = document.createElement("div"), k.style.visibility = "hidden", k.innerHTML = '<iframe src="' + B + '" scrolling="no" width="1" height="1"></iframe>', document.body.appendChild(k), setTimeout(function () {
            k && k.parentNode && k.parentNode.removeChild(k)
        }, 5E3);
    }
    if (typeof(ucweb) != "undefined") {
        ucweb.startRequest("shell.page_share", [defaults.title, defaults.img, defaults.url, toApp, "", "@" + defaults.from, ""])
    } else {
        if (typeof(ucbrowser) != "undefined") {
            ucbrowser.web_share(defaults.title, defaults.img, defaults.url, toApp, "", "@" + defaults.from, '')
        }
    }
  }
  // 取消分享
  function cancelShare(){
    oWrap.style.display = "none";
    oShare.style.display = "block";
    oCopy.style.display = "none";
  }
  //对外提供的方法集
  var api = {
    init: function(config){
      config = config ? config : "";
      defaults.url = config.url || window.location.href;
      defaults.title = config.title || document.title || "";
      defaults.img = config.img || document.getElementsByName("img")[0] && document.getElementsByName("img")[0].src || "";
      defaults.desc = config.desc || document.getElementsByName("description") || "";
      defaults.from = config.from || window.location.host;
      createHtml();
      registerEvent();
      // 阻止a标签的点击事件
      var link = document.querySelector(".cory-cont-link");
      link.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();
      }
      // 分享按钮事件
      var btnShare = document.querySelector(".btn-share");
      btnShare.onclick = function(){
        oWrap.style.display = "block";
      }
    }
  }
  this.mshare = api;
 })()






















