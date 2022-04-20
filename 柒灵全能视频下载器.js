// ==UserScript==
// @name         柒灵全能视频下载器
// @namespace    https://weibo.com/guoxuebiji/profile?is_all=1
// @version      2.4.4
// @description  (目前支持)哔哩哔哩(bilibili)/优酷网(youku)/腾讯视频(qq)/爱奇艺(iqiyi)/国家中小学网络云课堂(ykt.eduyun.cn)视频批量下载, 加速下载, 随时随地想看就看. 支持微元素/微博图片批量下载
// @author       东风
// @date         2020-04-25
// @modified     2021-08-23
// @match        http*://*.bilibili.com/video/*
// @match        http*://*.bilibili.com/bangumi/play/*
// @match        http*://*.bilibili.com/*/favlist*
// @match        http*://v.youku.com/v_show/*
// @match        http*://m.youku.com/alipay_video/*
// @match        http*://v.qq.com/x/cover/*
// @match        http*://m.v.qq.com/x/cover/*
// @match        http*://v.qq.com/x/page/*
// @match        http*://m.v.qq.com/x/page/*
// @match        http*://m.v.qq.com/*
// @match        http*://www.iqiyi.com/v*
// @match        http*://m.iqiyi.com/*
// @match        http*://www.iqiyi.com/*
// @match        http*://m.iqiyi.com/kszt/*
// @match        http*://www.iqiyi.com/kszt/*
// @match        http*://www.element3ds.com/*
// @match        http*://tongbu.eduyun.cn/tbkt/*
// @match        http*://photo.weibo.com/*/talbum/index*
// @icon         http*://space.bilibili.com/favicon.ico
// @license      BSD 3-Clause License
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// ==/UserScript==

(function () {
  'use strict';
  //==========utils=====================================================================
  //加载css文件
  function addCSS(href) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = href;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  //加载js文件
  function addJS(src, cb, onerror) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    console.log("addJS", script)
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = typeof cb === "function" ? cb : function () { };
    script.onerror = typeof onerror === "function" ? onerror : function () { };
  }

  // 加载css字符串
  function GMaddStyleString(css) {
    var myStyle = document.createElement('style');
    myStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
  }

  function AddHtml(html) {
    document.body.insertAdjacentHTML('afterEnd', html);
  }



  // 改用ZUI //https://www.openzui.com/
  addJS("https://libs.baidu.com/jquery/2.0.0/jquery.min.js", function () {

    console.log("-------------------load jq-------------------")
    window.$ = $.noConflict();
    // addCSS("https://cdn.bootcdn.net/ajax/libs/zui/1.9.2/css/zui.min.css");
    // addJS("https://cdn.bootcdn.net/ajax/libs/zui/1.9.2/js/zui.min.js", function () {
    addCSS("https://lib.baomitu.com/zui/1.9.2/css/zui.min.css");
    addJS("https://lib.baomitu.com/zui/1.9.2/js/zui.min.js", function () {

      console.log("-------------------load bootcdn zui.min.js-------------------")

    })
  });


  function GetFileName(url) {
    var Business = url.split("/");
    return Business[Business.length - 1];
  }

  // String.prototype.TextFilter=function(){
  //     var pattern=new RegExp("[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、]"); //[]内输入你要过滤的字符
  //     var rs="";
  //     for(var i=0;i<this.length;i++){
  //         rs+=this.substr(i,1).replace(pattern,'');
  //     }
  //     return rs;
  // }

  // 把空格和斜杠转换成下划线
  function Trim(str, limit) {
    // str = str.TextFilter()
    console.log(str)
    var result = str.replace(/\s+/g, "_");
    result = result.replace(/\//g, "-");
    result = result.replace(/\\/g, "_");
    result = result.replace(/&/g, "-");
    result = result.replace(/"/g, "");
    result = result.replace(/:/g, "_");
    result = result.replace(/\|/g, "_");
    if (limit) {
      result = result.substring(0, limit);
    }
    console.log(result)
    return result;
  }

  // 去掉标题后缀
  function FormatTitle(str) {
    var title = Trim(document.title)
    var n = title.lastIndexOf(str);
    if (n >= 0) {
      title = title.substring(0, n);
    }
    return title;
  }

  function ShowTips(str) {
    new $.zui.Messager(str, {
      type: 'success', // 定义颜色主题
      time: 2000
    }).show();
  }
  function ShowDialog(str) {
    // (new $.zui.ModalTrigger({custom: str})).show();
    // console.log("ShowDialog"+str)
    alert(str)
  }

  //字符串是否包含子串
  function isContains(str, substr) {
    //str是否包含substr
    return str.indexOf(substr) >= 0;
  }

  // 把网页获取的对象转换成数组
  function objToArray(x) {
    var list = [];
    console.log(x)
    for (var i = 0; i < x.length; i++) {
      list[i] = x[i];
    }
    return list
  }

  // 补零
  function PrefixZero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }

  // 文件加前缀
  function AddPreFilename(fileName, index, max) {
    var len = (max + "").length
    return "P" + PrefixZero(index, len) + "." + fileName
  }

  function ShowSelect(senddata) {
    window.g_senddata = senddata
    console.log("ShowSelect", JSON.stringify(senddata))
    var select_window = $("#select_window")
    console.log(select_window)

    console.log("解决插件冲突", $(".cssobj-jiangxiaobai"))
    var ocss = $(".cssobj-jiangxiaobai").removeClass(".cssobj-jiangxiaobai")
    for (var i = 0; i < ocss.length; i++) {
      ocss[i].innerHTML = ""
    }

    if (!select_window[0]) {
      var html =
        `
          <div class="modal fade" id="select_window" style="z-index:10000">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                  <h4 class="modal-title">请选择要下载的视频</h4>
                </div>
                <div class="modal-body">
                      <form id='select_form' class="layui-form" action="" lay-filter="example">
                      </form>
                </div>
                <div class="modal-footer center">

                  <div class="select" style="width:100px;display:inline-block;display:none">
                      <select class="form-control">
                        <option value="">清晰度</option>
                        <option value="80">1080p</option>
                        <option value="64">720p</option>
                        <option value="32">480p</option>
                        <option value="16">360p</option>
                      </select>
                  </div>

                  <div class="switch" style="width:100px;display:inline-block">
                      <input type="checkbox" id='checkbox_index'>
                      <label>添加序号</label>
                  </div>

                  <button type="button" class="btn btn-primary" id="btn_download_all">下载选中</button>
                  <button type="button" class="btn btn-primary" id="btn_select_all">取消/全选</button>
                  <button type="button" class="btn btn-primary" id="btn_download_self">仅下载本视频</button>
                  <button type="button" class="btn btn-default" data-dismiss="modal" >关闭</button>
                </div>
              </div>
            </div>
          </div>
          `
      AddHtml(html)//style="display:none"    
      // select_form = $("#select_form") 

      // $(function() {
      //     $("#checkbox_index").click(function(){
      //         // var obj = $("#checkbox_index")
      //         // if(obj.checked){
      //         //     console.log("selected");
      //         // }else{
      //         //     console.log("unselected");
      //         // }
      //         $("#select_window").hide()
      //         Download(senddata)
      //     });
      // }); 

      $(function () {
        $("#btn_download_self").click(function () {
          RealDownload(DownloadSelfInfo())
        });
      });

      $(function () {
        $("#btn_download_all").click(function () {
          var list = $("[id='listItem']:checkbox")
          var checkbox = $("#checkbox_index")[0]
          console.log("checkbox_index", checkbox.checked)
          var res = []
          for (var i = 0; i < list.length; i++) {
            if (list[i].checked) {

              if (checkbox.checked) {
                window.g_senddata[i].fileName = AddPreFilename(window.g_senddata[i].fileName, i + 1, list.length)
              }
              res.push(window.g_senddata[i])
            }
          }
          console.log(res)
          RealDownload(res)
        });
      });

      $(function () {
        $("#btn_select_all").click(function () {
          var list = $("[id='listItem']:checkbox")
          var flag = true
          if (list[0] && list[0].checked) {
            flag = false
          }
          console.log("flag", flag)
          console.log(list)
          for (var i = 0; i < list.length; i++) {
            list[i].checked = flag
          }
        });
      });

    }
    else {
      if ($("#select_window").is(":visible")) {
        $("#select_window").hide()
        // alert("存在")
        return
      }
    }
    var select_form = $("#select_form")

    //弹出表格
    var s_content = `
          <form class="layui-form" action="" lay-filter="example">
            <div class="layui-form-item" pane="">
              <label class="layui-form-label">视频列表</label>`

    for (var i = 0; i < senddata.length; i++) {
      if (senddata[i]) {
        senddata[i].id = i + 1
        var checkboxid = "select_checkbox_id" + i
        s_content = s_content + `<div class="checkbox-primary"><input type="checkbox" checked="checked" id="listItem"><label for="` + checkboxid + `">` + senddata[i].fileName + `</label></div>`
      }

    }

    s_content = s_content + `</div></form>`
    console.log(s_content)
    select_form[0].innerHTML = s_content

    console.log($('#select_window'))
    $('#select_window').modal({
      scrollInside: true,
      moveable: "inside",
      show: true
    })
  }

  function Download(urls) {
    ShowSelect(urls)
  };

  function WebGet(url, success) {
    jQuery.ajax({
      url: url,
      async: false,
      success: success,
      omplete: function (data) {
        if (data.status === 200) {
        }
        else {
          ShowTips("系统错误:暂时无法连接服务器")
        }
      }
    });
  }

  //==========以下是与下载器通讯=====================================================================
  var host = '127.0.0.1'
    , port = '5678';

  function wsmessage(evt) {
    console.log(evt);
    var received_msg = evt.data;
    console.log("收到服务器的信息", received_msg);
    // ws.send(JSON.stringify(["https://www.bilibili.com/video/BV19E411D78Q?p=6","https://www.bilibili.com/video/BV19E411D78Q?p=3"]));
    // console.log(JSON.parse(received_msg));
    // 发送成功{id: 2333333, jsonrpc: "2.0", result: "a6ff40d33524229a"}
    // 开始下载{jsonrpc: "2.0", method: "aria2.onDownloadStart", params: [[gid: "a6ff40d33524229a"]]}
    // 下载完成{jsonrpc: "2.0", method: "aria2.onDownloadComplete", params: [[gid: "a6ff40d33524229a"]]}
    // 下载出错{jsonrpc: "2.0", method: "aria2.onDownloadError", params: [[gid: "a6ff40d33524229a"]]}

    ShowTips("任务发送成功");
  };

  function wsclose() {
    console.log("连接关闭");
    // layui.use('layer', function(){
    //   var layer = layui.layer;
    //     layer.msg("连接关闭", {
    //         icon: 1
    //     });
    // }); 
  };

  function RealDownload(url, out, dir) {
    console.log("RealDownload", url)
    console.log(JSON.stringify(url))
    // var json = MakeSendData(url, out, dir)
    var ws = new WebSocket("ws://" + host + ":" + port + "/jsonrpc");

    function wsopen() {
      console.log("连接下载服务器");
      // var json = MakeSendData("http://aria2c.com/usage.html", "test.html", "./dow")
      // ws.send(JSON.stringify(["https://www.bilibili.com/video/BV19E411D78Q?p=5","https://www.bilibili.com/video/BV19E411D78Q?p=3"]));
      ws.send(JSON.stringify(url));

      setTimeout(function () {
        ws.close()
      }, 10000)

    };

    setTimeout(function () {
      if (ws.readyState === 1) {
        //连接成功什么事情都不用处理
      } else {
        ShowTips("连接下载器失败,请确认开启下载器");
      }
    }, 1000)

    ws.onopen = wsopen;
    ws.onmessage = wsmessage;
    ws.onclose = wsclose;
  };

  function CreateWs(cb) {
    var ws = new WebSocket("ws://" + host + ":" + port + "/jsonrpc");
    function wsopen() {
      console.log("连接下载服务器");
      if (cb) { cb() }
      // var json = MakeSendData("http://aria2c.com/usage.html", "test.html", "./dow")
      // ws.send(JSON.stringify(["https://www.bilibili.com/video/BV19E411D78Q?p=5","https://www.bilibili.com/video/BV19E411D78Q?p=3"]));
      // ws.send(JSON.stringify(url));
    };

    setTimeout(function () {
      if (ws.readyState === 1) {
        //连接成功什么事情都不用处理
      } else {
        ShowTips("连接下载器失败,请确认开启下载器");
      }
    }, 1000)

    ws.onopen = wsopen;
    ws.onmessage = wsmessage;
    ws.onclose = wsclose;

    return ws
  }

  function SendMsg(ws, data, isclose) {
    console.log("SendMsg readyState", ws.readyState)
    if (ws.readyState != 1) {
      ws = CreateWs(function () {
        SendMsg(ws, data, isclose)
      })
      return
    }
    ws.send(JSON.stringify(data));
    if (isclose) {
      setTimeout(function () {
        ws.close()
      }, 1000)
    }
  }

  var g_ws = CreateWs()


  //===============================================================================

  // 拷贝我的收藏视频网址
  function CopyFavlistUrls() {

    var title = "我的收藏"

    var x = document.getElementsByClassName("fav-video-list clearfix content")[0].children;
    console.log(title)

    var list = [];
    console.log(x)
    for (var i = 0; i < x.length; i++) {
      console.log(i, x[i].attributes["class"].nodeValue)

      if (x[i].attributes["class"].nodeValue != "small-item disabled") { //失效
        //list[i] = x[i];
        list.push(x[i])
      }
    }

    console.log(list)
    // zoomfile
    if (list) {

      // GM_setClipboard( list.map(function (pin) {
      //     return "https:" + pin.children[0].attributes["href"].nodeValue + "\r\n";
      // }).join(""));

      return list.map(function (pin) {
        var item = { "url": "https:" + pin.children[1].attributes["href"].nodeValue };
        item.folder = "我的收藏"
        item.islist = false;
        item.fileName = Trim(pin.children[1].title)
        return item;
      })
    } else {
      ShowTips("找不到视频");
    }
  }

  // 拷贝播放列表视频网址
  function CopyVedioUrls() {
    var title = Trim(document.querySelector('meta[property="og:title"]').getAttribute('content'));//FormatTitle("_哔哩哔哩(゜-゜)つロ干杯~-bilibili")

    var list_box = document.getElementsByClassName("list-box")
    if (list_box.length == 0) {
      return DownloadSelfInfo()
    }

    var x = document.getElementsByClassName("list-box")[0].children;
    console.log(title)

    var list = [];
    console.log(x)
    for (var i = 0; i < x.length; i++) {
      list[i] = x[i];
    }

    console.log(list)
    if (list) {
      return list.map(function (pin, index) {
        var item = { "url": "https://www.bilibili.com" + pin.children[0].attributes["href"].nodeValue }
        item.folder = Trim(title, 30)
        item.fileName = Trim(pin.children[0].title)
        item.islist = false;
        return item;
      })
    } else {
      ShowTips("找不到视频");
    }
  }
  // 拷贝番剧播放列表视频网址
  function CopyBangumiUrls() {
    jQuery.ajax({
      url: window.location.href,
      async: false,
      success: function (res) {
        // console.log(res);
        var info = res

        var n = info.lastIndexOf("<script>window.__INITIAL_STATE__");
        if (n >= 0) {
          info = info.substring(n + "<script>window.__INITIAL_STATE__=".length);
          var n2 = info.indexOf(";(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());</script>");
          // console.log("1111",n, n2,info)
          info = info.substring(0, n2);
        }
        var bili_state = JSON.parse(info)
        if (bili_state) {

          console.log(bili_state)
          var epList = bili_state.epList
          var title = bili_state.mediaInfo.title
          var ssType = bili_state.ssType
          // console.log(bili_state.epList)
          // console.log("epList =", epList, "mediaInfo = ", mediaInfo)
          // for (var i = 0; i < epList.length; i++) {
          //     console.log(i, epList[i])
          // }

          // if (ssType==1) { //番剧

          var urls = epList.map(function (ep) {
            var item = {
              "url": "https://www.bilibili.com/bangumi/play/ep" + ep.id,
              "titleFormat": Trim(ep.titleFormat),
              "longTitle": Trim(ep.longTitle),
              "fileName": Trim(ep.titleFormat + "_" + ep.longTitle)
            }
            if (ep.longTitle == "") {
              item.fileName = Trim(ep.titleFormat)
            }
            item.folder = Trim(title, 30)
            item.islist = false;
            return item;
          })
          Download(urls)
          // }else
          // {// 电影
          //     DownloadSelf(title, false)
          // }
        } else {
          var title = document.querySelector('meta[property="og:title"]').getAttribute('content');
          DownloadSelf(title, true)
        }
      },
      omplete: function (data) {
        if (data.status === 200) {
        }
        else {
          ShowTips("系统错误:暂时无法连接服务器")
          var title = document.querySelector('meta[property="og:title"]').getAttribute('content');
          DownloadSelf(title, true)
        }
      }
    });
  }

  function DownloadSelf(title, islist, youtube) {
    Download(DownloadSelfInfo(title, islist, youtube))
  }

  function DownloadSelfInfo(title, islist, youtube) {
    var item = { "url": window.location.href }
    // item.folder = Trim(title); // 不能有空格,有时候下载失败是因为有空格
    if (!title) {
      title = Trim(document.title)
    }
    if (!islist) {
      islist = false
    }
    item.fileName = Trim(title)
    item.islist = islist;
    var host = getEffectiveHost()
    if (host == "youku" || host == "eduyun") {
      item.youtube = true
    }
    return [item]
  }


  // 解析bilibili网站
  function ParseBilibiliUrl() {
    var arrUrl = window.location.pathname.split('/');
    console.log("arrUrl = ", arrUrl);
    if (!arrUrl[1]) return;
    if (arrUrl[1] == "video")
      return CopyVedioUrls();
    else if (arrUrl[1] == "bangumi")
      return CopyBangumiUrls();
    else if (arrUrl[2] == "favlist")
      return CopyFavlistUrls();
    else {
      return DownloadSelfInfo()
    }
  }

  // 解析优酷网站
  function ParseYoukuUrl() {
    var arrUrl = window.location.pathname.split('/');
    console.log("arrUrl = ", arrUrl);

    if (!arrUrl[1]) return;
    if (arrUrl[1] == "v_show") {
      var title = Trim(document.querySelector('meta[name="irAlbumName"]').getAttribute('content'));
      var l = document.getElementsByClassName("anthology-content")
      if (l.length == 2) {
        var x = document.getElementsByClassName("anthology-content")[0].children;
        var list = objToArray(x)
        if (list) {
          return list.map(function (pin) {
            var item = { "url": pin.children[0].attributes["href"].nodeValue }
            item.saveFileName = Trim(pin.title) //优酷下载的名称没有第几集, 所以需要重命名
            item.fileName = Trim(item.saveFileName)
            item.folder = Trim(title, 30)
            item.islist = false;
            item.youtube = true
            return item;
          })
        }
      }
    }

    return DownloadSelfInfo(null, false, true)
  }

  // 解析腾讯视频网站
  function ParseQQUrl() {
    var arrUrl = window.location.pathname.split('/');
    console.log("arrUrl = ", arrUrl);

    if (!arrUrl[1]) return;
    if (arrUrl[1] == "x") {
      var player_title = document.getElementsByClassName("player_title")
      if (player_title.length == 0) {

      } else {
        var x
        var title = Trim(document.getElementsByClassName("player_title")[0].children[0].text); //player_title
        var items = document.getElementsByClassName("figure_list _hot_wrapper")
        var item_detail_half = document.getElementsByClassName("item_detail_half")
        var mod_episode = document.getElementsByClassName("mod_episode")

        if (items.length > 0) {
          x = items[0].children;
          var list = objToArray(x)
          // console.log(list)
          if (list) {
            return list.map(function (pin) {
              // console.log(pin)
              var item = { "url": "https://v.qq.com" + pin.children[0].attributes["href"].nodeValue }
              item.fileName = Trim(pin.attributes["data-title"].nodeValue)
              item.folder = Trim(title, 30)
              item.islist = false;
              return item;
            })
          }
        }

        if (item_detail_half.length > 0) {
          x = document.getElementsByClassName("item_detail_half")
          var list = objToArray(x)
          // console.log(list)
          if (list) {
            return list.map(function (pin) {
              console.log(pin)
              var item = { "url": "https://v.qq.com" + pin.children[0].attributes["href"].nodeValue }
              item.fileName = Trim(pin.children[0].attributes["title"].nodeValue)
              item.folder = Trim(title, 30)
              item.islist = false;
              return item;
            })
          }
        }
        if (mod_episode.length > 0) {
          x = mod_episode[0].children;
          var list = objToArray(x)
          // console.log(list)
          if (list) {
            return list.map(function (pin) {
              // console.log(pin)
              if (pin.children[0].attributes["href"]) {
                var item = { "url": "https://v.qq.com" + pin.children[0].attributes["href"].nodeValue }
                item.fileName = "第" + Trim(pin.innerText) + "集"
                item.folder = Trim(title, 30)
                item.islist = false;
                return item;
              }
            })
          }
        }
        // innerText
      }
    }

    return DownloadSelfInfo()
  }

  // 解析爱奇艺网站
  function ParseIqiyiUrl() {
    var title = Trim(document.querySelector('meta[name="irAlbumName"]').getAttribute('content'));
    var x = document.getElementsByClassName("select-title"); //专辑
    var list = objToArray(x)

    if (list.length > 0) {
      return list.map(function (pin) {
        var item = { "url": "https:" + pin.children[1].attributes["href"].nodeValue }
        item.saveFileName = Trim(pin.children[0].innerText + "_" + pin.children[1].text)
        item.fileName = Trim(item.saveFileName)
        item.folder = Trim(title, 30)
        item.islist = false;
        return item;
      })
    } else {
      return DownloadSelfInfo()
    }
  }

  function GetEduyunCaseObj(caseCode) {
    // var obj2 = eval(xueduanJson);
    var caseobj = eval(caseJson);
    var caseobjlen = caseobj.clist.length;
    for (var a = 0; a < caseobjlen; a++) {
      var caseobjcode = caseobj.clist[a].caseCode;

      if (caseobjcode == caseCode) {
        return caseobj.clist[a]
      }
    }
  }

  // 解析国家中小学网络云课堂网站
  function ParseEduyunUrl() {
    var obj2 = eval(xueduanJson);
    var caseobj = eval(caseJson);

    var xdnum = $("#xdnum").val();
    var njnum = $("#njnum").val();
    var xknum = $("#xknum").val();

    var xdname = obj2.xueDuan[xdnum].xueDuanName
    var njname = obj2.xueDuan[xdnum].nianJiList[njnum].njName
    var xkname = obj2.xueDuan[xdnum].nianJiList[njnum].subjectsList[xknum].xkName
    var title = xdname + "_" + njname + "_" + xkname
    console.log(xdname, njname, xkname)

    var len = obj2.xueDuan[xdnum].nianJiList[njnum].subjectsList[xknum].danYuanList.length;
    var obj3 = obj2.xueDuan[xdnum].nianJiList[njnum].subjectsList[xknum].danYuanList;

    console.log(obj2, caseobj, obj3, obj2.xueDuan[xdnum].nianJiList[njnum].subjectsList[xknum])

    // var title = Trim(document.querySelector('meta[name="irAlbumName"]').getAttribute('content')); 
    // var x = document.getElementsByClassName("select-title"); //专辑
    // var list = objToArray(x)
    var ret = []
    if (obj3.length > 0) {
      for (var i = 0; i < obj3.length; i++) {
        var index = 0
        var danyuan = obj3[i]
        for (var j = 0; j < danyuan.caseList.length; j++) {
          // danyuan.caseList[j].caseCode
          var caseCode = danyuan.caseList[j].caseCode
          var code = caseCode.substring(0, 6);//截取6位
          var caseitem = GetEduyunCaseObj(caseCode)
          if (caseitem) {
            console.log(caseitem)
            index = index + 1
            var item = { "url": "http://tongbu.eduyun.cn/tbkt/tbkthtml/wk/weike/" + code + "/" + caseCode + ".html" }
            item.saveFileName = index.toString() + "." + Trim(caseitem.caseBeanList[0].caseName)
            item.fileName = Trim(item.saveFileName)
            item.folder = Trim(title + "/" + obj3[i].danyuanName, 30)
            item.islist = false;
            item.youtube = true
            ret.push(item)
          }
        }
      }
      return ret
    } else {
      return DownloadSelfInfo()
    }
  }

  // 解析微元素
  function ParseElement3ds() {
    var json = {};
    var title = document.title
    var n = title.lastIndexOf("-微元素");
    if (n >= 0) {
      title = title.substring(0, n);
      var n2 = title.lastIndexOf("-");
      if (n2 >= 0) {
        title = title.substring(0, n2);
      }
    }
    // title = "#title:" + title + "\n"

    var x = document.getElementsByClassName("zoom");
    console.log(title)

    var list = objToArray(x)
    console.log(list)

    if (list) {
      var res = list.map(function (pin) {
        var url = pin.attributes["zoomfile"].nodeValue
        var n = url.lastIndexOf("?");
        if (n >= 0) {
          url = url.substring(0, n);
        }
        var item = { "url": url }
        item.saveFileName = Trim(GetFileName(url))
        item.fileName = Trim(item.saveFileName)
        item.folder = Trim(title, 30)
        item.islist = false;
        item.image = true
        return item;
      })

      RealDownload(res) // 图片直接下载就是了, 不提供选择
      ShowDialog("获取到" + res.length + "张图片,已经发送到下载器")
    } else {
      ShowTips("找不到图片")
    }
  }

  // 解析微博相册
  function ParseWeiboPhoto() {
    // $GLOBAL_INFO.owner_uid //拥有者id
    // $GLOBAL_DETAIL.page_album_id //相册id
    // $GLOBAL_DETAIL.album_info.count.photos //图片数量
    var count = $GLOBAL_DETAIL.album_info.count.photos
    var page = Math.floor(count / 30 + 1)
    var owner_data = $GLOBAL_INFO.owner_data
    var totalcount = 0

    function download(i) {
      setTimeout(function () {
        var t = new Date().getTime()
        var url = "https://photo.weibo.com/photos/get_all?uid=" + $GLOBAL_INFO.owner_uid + "&album_id=" + $GLOBAL_DETAIL.page_album_id + "&count=30&page=" + i + "&type=3&__rnd=" + t
        console.log(url)
        WebGet(url, function (res) {
          console.log(res)
          if (res.code == 0) {
            var list = res.data.photo_list
            var arr = list.map(function (pin) {
              // var node = pin.children[0].href
              var url = "https://wx3.sinaimg.cn/large/" + pin.pic_name
              var item = { "url": url }
              item.saveFileName = pin.pic_name
              item.fileName = Trim(item.saveFileName)
              item.folder = Trim(owner_data.name + "-" + $GLOBAL_DETAIL.album_info.caption, 30)
              item.islist = false;
              item.image = true
              return item;
            })
            // console.log(arr)
            totalcount = totalcount + arr.length
            // console.log("----------------------------------------------", i, totalcount, arr.length)
            // RealDownload(arr) // 图片直接下载就是了, 不提供选择
            SendMsg(g_ws, arr)
            if (i + 1 == page) {
              ShowDialog("获取到" + totalcount + "张图片,已经发送到下载器")
            }
          }//if (res.code == 0)
        })//WebGet
      }, 1000 * i)//setTimeout            
    }

    for (var i = 0; i < page; i++) {
      //https://photo.weibo.com/photos/get_all?uid=5538396801&album_id=3814561462485240&count=30&page=2&type=3&__rnd=1621934381145
      // https://photo.weibo.com/photos/get_all?uid=5538396801&album_id=3814561462485240&count=30&page=11&type=3&__rnd=1621998700612
      download(i + 1)
    }
  }


  //获取可使用域名
  function getEffectiveHost() {
    var host = window.location.host;
    if (!host) {
      host = document.domain;
    }
    if (!host) {
      host = "bilibili.com";
    }
    if (isContains(host, "bilibili")) {
      host = "bilibili";
    } else if (isContains(host, "youku")) {
      host = "youku";
    } else if (isContains(host, "iqiyi")) {
      host = "iqiyi";
    } else if (isContains(host, "qq.com")) {
      host = "qq";
    } else if (isContains(host, "element3ds")) {
      host = "element3ds";
    } else if (isContains(host, "eduyun")) {
      host = "eduyun";
    } else if (isContains(host, "photo.weibo")) {
      host = "photo_weibo";
    }

    else {
      host = "bilibili";
    }
    return host;
  }

  function ParseUrl() {
    // console.log("----------------------222222",$.fn.jquery)
    var host = getEffectiveHost()
    if (host == "bilibili") {
      return ParseBilibiliUrl()
    } else if (host == "youku") {
      return ParseYoukuUrl()
    } else if (host == "iqiyi") {
      return ParseIqiyiUrl()
    } else if (host == "qq") {
      return ParseQQUrl()
    } else if (host == "element3ds") {
      return ParseElement3ds()
    } else if (host == "eduyun") {
      return ParseEduyunUrl()
    } else if (host == "photo_weibo") {
      return ParseWeiboPhoto()
    }
    else {
      return DownloadSelfInfo()
    }
  }

  var isInit = 0;
  function DoInit() {

    // isInit ++;
    // if (isInit != 2 ) {return}
    // console.log("----------------DoInit-------------")
    var btn = document.getElementsByClassName("btnDownload")
    if (btn.length > 0) {
      return
    }

    GMaddStyleString(`#download_movie_box {cursor:pointer; position:fixed; top:` + 60 + `px; left:` + 0 + `px; width:0px; background-color:#2E9AFE; z-index:2147483647; font-size:20px; text-align:left;}
          #download_movie_box .item_text {width:28px; padding:4px 0px; text-align:center;}
          #download_movie_box .item_text img {width:35px; height:35px; display:inline-block; vertical-align:middle;}
          `);

    // var $ = $ || window.$;
    var ImgBase64Data = "data:image/png;base64,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"

    var html =
      `<div id='download_movie_box' class="btnDownload">
          <div class='item_text'>
              <img src='`+ ImgBase64Data + `' title='下载视频' id="downloadVideos"/>
          </div>
      </div>`;

    document.body.insertAdjacentHTML('afterEnd', html);

    document.getElementById("downloadVideos").onclick = function () {
      var urls = ParseUrl();
      console.log("urls = ", urls)
      if (urls) {
        Download(urls)
      }
    };
  }
  /*
      主入口，分出不同模块：用户、画板，监听并刷新URL
  */
  window.onload = function () {
    DoInit()
  }

  // GM_setValue("mytset","mytset---------------------------")
  // console.log(GM_getValue("mytset"))
})();

