// ==UserScript==
// @name         哔哩哔哩bilibili辅助脚本解析大会员
// @namespace    zzy，q82664730
// @version      13.3
// @description  解析大会员视频，播放页去广告，自动全屏，自动最高画质(根据是否为大会员，然后选择对应的最高画质)，默认1.5倍速（可选）,自动发送弹幕（可选）,自定义弹幕内容，自动展开简介，自动开启弹幕，移除顶部的下载app选项等。
// @author       zzy
// @license MIT
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @match        https://vip.parwix.com:4433/*
// @match        https://z1.m1907.cn/*
// @match        https://api.yueliangjx.com/*
// @match        https://showxi.xyz/*
// @match        https://okjx.cc/*
// @match        https://www.cuan.la/*
// @match        https://www.mtosz.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// ==/UserScript==

(function () {
  //'use strict';
  var $div = $(`
    <div id="fcd" style="z-index:9999999;padding-left:15px;position: fixed; top: 5px; right: 5px;background-color:#e5f5f5;color: #0e8e88;font-weight: bolder;font-size: 1.1em;width: 400px; height: 350px;display:block;">
      <span style="line-height:30px;">是否为大会员：<input type="checkbox" id="isVip" /></span><br>
      <span style="line-height:30px;">是否去广告及其它：<input type="checkbox" id="isAd" /></span><br>
      <span style="line-height:30px;">是否自动开启弹幕：<input type="checkbox" id="isDm" /></span><br>
      <span style="line-height:30px;">是否自动展开详情：<input type="checkbox" id="isXq" /></span><br>
      <span style="line-height:30px;">是否开启最高画质：<input type="checkbox" id="isZg" /></span><br>
      <span style="line-height:30px;">是否开启自动全屏：<input type="checkbox" id="isQp" /></span><br>
      <span style="line-height:30px;">
        播放速度：
        <input type="radio" name="speed" class="sprd" value="2.0"/>2.0
        <input type="radio" name="speed" class="sprd" value="1.5"/>1.5
        <input type="radio" name="speed" class="sprd" value="1.25"/>1.25
        <input type="radio" name="speed" class="sprd" value="1.0"/>1.0
        <input type="radio" name="speed" class="sprd" value="0.75"/>0.75
        <input type="radio" name="speed" class="sprd" value="0.5"/>0.5
      </span><br>
      <span style="line-height:30px;">是否自动发送弹幕：<input type="checkbox" id="isAutoSend" /></span><br>
      <span style="line-height:30px;">弹幕内容：<input type="text" id="dmNr" placeholder="不填默认发送：‘打卡’" /></span><br>
      <span style="line-height:30px;">自动发送弹幕间隔：<input type="number" id="asjg" style="width:45px;" />&nbsp;秒</span><br>
      <div style="text-align: center; margin-top:10px;display:flex;justify-content: center;">
        <input type="button" id="save" value="保存"></input>
        <input type="button" style="margin-left:40px;" id="narrow" value="缩小"></input>
      </div>
      <div style="text-align:right;">
          <span style="color:red;font-size:1.0em">@zzy</span>
      </div>
    </div>
    <div id="cd" style="z-index:999999;position: fixed; top: 5px; right: 5px; color: white;text-align: center;cursor: pointer; border-radius: 50%;width: 22px;height: 22px; background-color:rgb(252, 157, 154);font-weight: bolder;display:none;">
      <span style="line-height:22px;">B</span>
    </div>
  `);

  function opHighestQuality() {
    localStorage.setItem("isZg", $("#isZg")[0].checked);
    if ($("#isZg")[0].checked) {
      let isVip = $("#isVip")[0].checked;
      var hz = $(".bui-select-item");
      if (isVip) {
        hz[0].click();
      } else {
        for (let i = 0; i < hz.length; i++) {
          if (hz[i].innerHTML.indexOf("大会员") == -1) {
            hz[i].click();
            break;
          }
        }
      }
    }
  }
  function changePlaySpeed() {
    var spradio = $(".sprd");
    var speed = null;
    for (var i = 0; i < spradio.length; i++) {
      if (spradio[i].checked) {
        localStorage.setItem("speedIndex", i);
        if ($(".bilibili-player-video-btn-speed-menu-list").length > 0) {
          $(".bilibili-player-video-btn-speed-menu-list")[i].click();
        } else if ($(".squirtle-select-item").length > 0) {
          $(".squirtle-select-item")[i].click();
        }
      }
    }
  }
  function removeAds() {
    localStorage.setItem("isAd", $("#isAd")[0].checked);
    console.log(1100);
    if ($("#isAd")[0].checked) {
      if ($("#bannerAd").length > 0) {
        $("#bannerAd").remove();
      }
      if ($("#activity_vote").length > 0) {
        $("#activity_vote").remove();
      }
      if ($(".ad-report").length > 0) {
        $(".ad-report").each(function () {
          $(this).remove();
        });
      }
      if ($(".video-page-special-card").length > 0) {
        $(".video-page-special-card").each(function () {
          $(this).remove();
        });
      }
      if ($("#slide_ad").length > 0) {
        $("#slide_ad").remove();
      }
      if ($(".nav-link-item span").length > 0) {
        $(".nav-link-item span").each(function () {
          if ($(this)[0].innerText == "下载APP") {
            $(this).remove();
          }
        });
      }
    }
  }
  function auDm() {
    localStorage.setItem("isDm", $("#isDm")[0].checked);
    var ev = new Event('mouseover', {
      bubbles: false, // 默认值false, 事件是否冒泡
      cancelable: false,  // 默认值false, 事件能否被取消
      composed: false  // 默认值false, 事件是否会在影子DOM根节点之外触发侦听器。
    });
    if ($(".bilibili-player-video-danmaku-switch").length > 0) {
      $(".bilibili-player-video-danmaku-switch")[0].dispatchEvent(ev);
    } else {
      //$(".bpx-player-dm-switch")[0].dispatchEvent(ev);
    }
    if ($("#isDm")[0].checked) {
      $(".nav-link-item")[$(".nav-link-item").length - 1].remove();
      if (document.querySelector("span.choose_danmaku") && document.querySelector("span.choose_danmaku").innerText == "开启弹幕") {
        $(".bui-switch-input")[0].click();
      }
    }
  }
  function zkXq() {
    localStorage.setItem("isXq", $("#isXq")[0].checked);
    if ($("#isXq")[0].checked) {
      if ($(".desc-info").length > 0) {
        if ($(".desc-info")[0].getAttribute('class').indexOf('open') < 0) {
          $(".toggle-btn")[0].click()
        }
      } else {
        if (document.querySelector("a.media-desc i").innerText = "展开") {
          document.querySelector("a.media-desc i").click()
        }
      }
    }
  }
  function auQp() {
    localStorage.setItem("isQp", $("#isQp")[0].checked);
    if ($("#isQp")[0].checked) {
      $(".bilibili-player-iconfont.bilibili-player-iconfont-fullscreen-off.player-tooltips-trigger").click();
    }
  }
  function auSend() {
    localStorage.setItem("isAutoSend", $("#isAutoSend")[0].checked);
    var jtime = parseInt($("#asjg")[0].value) * 1000;
    localStorage.setItem("jtime", jtime);
    if ($("#isAutoSend")[0].checked && $("#asjg")[0].value && $("#asjg")[0].value > 10) {
      setInterval(function () {
        var ev = new Event('input', { bubbles: true });
        ev.simulated = true;
        if ($("#dmNr")[0].value.length > 0) {
          $(".bilibili-player-video-danmaku-input")[0].value = $("#dmNr")[0].value;
        } else {
          $(".bilibili-player-video-danmaku-input")[0].value = "打卡";
        }
        $(".bilibili-player-video-danmaku-input")[0].dispatchEvent(ev);
        $(".bilibili-player-video-btn-send")[0].click();
      }, jtime);
    } else if ($("#isAutoSend")[0].checked && $("#asjg")[0].value && $("#asjg")[0].value < 10) {
      alert("自动发送弹幕间隔必须大于10！");
    }
  }
  function addDiv() {
    var div = document.createElement("div");
    div.innerHTML = "解";
    var css = "position:fixed;top:30px;right:5px;z-index:999999999;line-height:22px;color: white;text-align: center;cursor: pointer;border-radius: 50%;width: 22px;height: 22px;background-color: rgb(252, 157, 154);font-weight: bolder;display: block;";
    div.style.cssText = css;
    div.title = "点击解析此视频！";
    if (window.self === window.top) { document.body.appendChild(div); }
    if (window.location.href.search("bilibili") != -1) {
      div.addEventListener("click", function () {
        let url = window.location.href;
        url = url.replace(url, 'https://z1.m1907.cn/?jx=' + url);
        window.open(url, "_blank");
      });
    } else {
      div.addEventListener("click", function () {
        let url = window.location.href;
        url = url.replace(url, 'https://z1.m1907.cn/?jx=' + url);
        window.open(url, "_blank");
      });
    }
  }
  function loadF() {
    $("#isZg")[0].checked = localStorage.getItem("isZg") == "true" ? true : false;
    $("#isQp")[0].checked = localStorage.getItem("isQp") == "true" ? true : false;
    if (localStorage.getItem("speedIndex")) {
      $(".sprd")[parseInt(localStorage.getItem("speedIndex"))].checked = true;
    }
    $("#isAd")[0].checked = localStorage.getItem("isAd") == "true" ? true : false;
    $("#isDm")[0].checked = localStorage.getItem("isDm") == "true" ? true : false;
    $("#isXq")[0].checked = localStorage.getItem("isXq") == "true" ? true : false;
    $("#isVip")[0].checked = localStorage.getItem("isVip") == "true" ? true : false;
    $("#isAutoSend")[0].checked = localStorage.getItem("isAutoSend") == "true" ? true : false;
    if (localStorage.getItem("jtime")) {
      $("#asjg")[0].value = parseInt(localStorage.getItem("jtime") / 1000);
    }
    opHighestQuality();
    changePlaySpeed();
    removeAds();
    auDm();
    zkXq();
    auQp();
    auSend();
    addDiv();
  }
  setTimeout(function () { loadF(); }, 4000);
  $(document).ready(function () {
    $('body').append($div);
    $style = `
      <style type="text/css">
        input[type=checkbox]{
          width: 13px;
          height: 13px;
          -webkit-appearance:checkbox;
          appearance:checkbox;
        }
        input[type=radio]{
          width: 13px;
          height: 13px;
          appearance:radio;
          -webkit-appearance:radio;
        }
        input[type=button]{
          width: 13px;
          height: 13px;
          appearance:button;
          -webkit-appearance:button;
        }
        input[type=text],input[type=number]{
          display: inline-block;
          line-height: 1.5;
          padding: 4px 7px;
          font-size: 14px;
          border: 1px solid #dcdee2;
          border-radius: 4px;
          color: #515a6e;
          background-color: #fff;
          background-image: none;
          position: relative;
          cursor: text;
          transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
        }
        input[type=text]:focus, input[type=text]:hover,input[type=number]:focus,input[type=number]:hover {
          border-color: #57a3f3;
        }
        #narrow:hover,#save:hover{
          background-color: #57a3f3;
          border-color: #57a3f3;
        }
        #narrow,#save{
          text-align: center;
          border: 1px solid transparent;
          height:32px;
          width:65px;
          background-color: #2d8cf0;
          border-color: #2d8cf0;
          font-weight: 400;
          cursor: pointer;
          padding: 0 15px;
          border-radius: 32px;
          color:#fff;
        }
      </style>
    `
    $('head').append($style);
    if (!localStorage.getItem("isFirst")) {
      alert("当前为首次打开脚本，请配置好后点击保存！");
      $("#fcd").css("display", "");
      $("#cd").css("display", "none");
    } else {
      $("#fcd").css("display", "none");
      $("#cd").css("display", "");
    }
    $("#isZg")[0].checked = localStorage.getItem("isZg") == "true" ? true : false;
    $("#isQp")[0].checked = localStorage.getItem("isQp") == "true" ? true : false;
    if (localStorage.getItem("speedIndex")) {
      $(".sprd")[parseInt(localStorage.getItem("speedIndex"))].checked = true;
    }
    $("#isAd")[0].checked = localStorage.getItem("isAd") == "true" ? true : false;
    $("#isDm")[0].checked = localStorage.getItem("isDm") == "true" ? true : false;
    $("#isXq")[0].checked = localStorage.getItem("isXq") == "true" ? true : false;
    $("#isAutoSend")[0].checked = localStorage.getItem("isAutoSend") == "true" ? true : false;
    if (localStorage.getItem("jtime")) {
      $("#asjg")[0].value = parseInt(localStorage.getItem("jtime") / 1000);
    }
    $("#save").click(function () {
      localStorage.setItem("isZg", $("#isZg")[0].checked);
      localStorage.setItem("isAd", $("#isAd")[0].checked);
      localStorage.setItem("isDm", $("#isDm")[0].checked);
      localStorage.setItem("isXq", $("#isXq")[0].checked);
      localStorage.setItem("isQp", $("#isQp")[0].checked);
      localStorage.setItem("isVip", $("#isVip")[0].checked);
      localStorage.setItem("isAutoSend", $("#isAutoSend")[0].checked);
      localStorage.setItem("isFirst", "none");
      var spradio = $(".sprd");
      var speed = null;
      for (var i = 0; i < spradio.length; i++) {
        if (spradio[i].checked) {
          localStorage.setItem("speedIndex", i);
        }
      }
      loadF();
      $("#fcd").css("display", "none");
      $("#cd").css("display", "");
    });
    $("#cd").click(function () {
      $("#fcd").css("display", "");
      $("#cd").css("display", "none");
    });
    $("#narrow").click(function () {
      loadF();
      $("#fcd").css("display", "none");
      $("#cd").css("display", "");
    });
    $(".video-page-card .info>a span").click(function () {
      setTimeout(function () { loadF(); }, 3000);
    });
  });
})();