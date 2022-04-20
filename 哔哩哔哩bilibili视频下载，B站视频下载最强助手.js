// ==UserScript==
// @name         哔哩哔哩bilibili视频下载，B站视频下载最强助手👇👇👇
// @namespace    http://tampermonkey.net/
// @version      2.0.7
// @description  1. 哔哩哔哩/bilibili视频封面下载，2. 哔哩哔哩/bilibili视频下载
// @author       franztutu
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @icon         https://static.hdslb.com/images/favicon.ico
// @include      *://*.bilibili.com/video/*
// @grant        none
// @license MIT
// ==/UserScript==

(function () {
  'use strict';
  var html = "<div href='javascript:void(0)' target='_blank' style='z-index:999999;position: absolute;left: 5px;top: 160px;color: #fff;background-color: #e40e0e;width: 50px;text-align: center;cursor: pointer;padding: 6px 0px;border-width: 1px;border-style: solid;border-color: #e40e0e;border-image: initial;border-radius: 2px;font-size: 12px;' class='80497718'>下载</div><div class='90545623' style='z-index:999999;width: 133px;min-height: 100px;background-color:#fff;box-shadow: rgb(0 0 0 / 15%) 0px 2px 8px;border-radius: 4px;padding: 5px 10px; position: absolute; left: 68px; top: 160px;display:none;' role='tooltip'><div>";
  var data = window.__INITIAL_STATE__.videoData;
  var cid = data.cid;
  var href = window.location.href;
  if (href && href.split("?")[1]) {
    var params = href.split("?")[1].split("&");
    for (var i = 0; i < params.length; i++) {
      if (params[i].includes("p=")) {
        var page = parseInt(params[i].split("=")[1])
        cid = data.pages[page - 1].cid;
        break;
      }
    }
  }
  var quality = 32;
  if (data) {
    setTimeout(function () {
      var cover = data.pic;
      $("body").append(html);
      $.ajax({
        url: "https://api.bilibili.com/x/player/playurl?cid=" + cid + "&avid=" + data.aid + "&qn=" + quality + "&otype=json&fourk=1",
        timeout: 1000
      }).then(res => {
        var accept_quality = res.data.accept_quality;
        var accept_description = res.data.accept_description;
        for (let i = 0; i < accept_quality.length; i++) {
          if (accept_quality[i] === 16) {
            continue;
          }
          var item = {};
          item["quality"] = accept_quality[i];
          item["desc"] = accept_description[i];
          if (accept_quality[i] == quality) {
            var url = res.data.durl[0].url;
            $(".90545623").append("<div style='font-size: 12px;color: rgb(1, 161, 214);height: 20px;margin-bottom: 10px;cursor: pointer;'><a style='color: rgb(1, 161, 214);' target='_blank' class='112556875-" + item.quality + "' href='" + url + "'>" + item.desc + "</a></div>");
          } else {
            $(".90545623").append("<div style='font-size: 12px;color: rgb(1, 161, 214);height: 20px;margin-bottom: 10px;cursor: pointer;'><a style='color: rgb(1, 161, 214);' class='112556875-" + item.quality + "' href='javascript:void(0)'>" + item.desc + "</a></div>");
          }
        }
        for (let i = 0; i < accept_quality.length; i++) {
          if (accept_quality[i] === 16 || accept_quality[i] === quality) {
            continue;
          }
          $(".112556875-" + accept_quality[i]).on("click", () => {
            if (!$(".112556875-" + accept_quality[i]).attr("target")) {
              $.ajax({
                url: "https://api.bilibili.com/x/player/playurl?cid=" + cid + "&avid=" + data.aid + "&qn=" + accept_quality[i] + "&otype=json&fourk=1",
                timeout: 1000
              }).then(res => {
                $(".112556875-" + accept_quality[i]).attr("href", res.data.durl[0].url);
                $(".112556875-" + accept_quality[i]).attr("target", '_blank');
                var a = document.createElement('a');
                a.href = res.data.durl[0].url;
                a.target = "_blank";
                a.click();
              }, xhr => {
                console.log(accept_quality[i] + " error");
              })
            }
          })
        }
        $(".90545623").append("<div style='font-size: 12px;color: rgb(1, 161, 214);height: 20px;margin-bottom: 10px;cursor: pointer;'><a style='color: rgb(1, 161, 214);' referrerPolicy='unsafe-url' target='_blank' href=" + cover + ">封面</a></div>");
      }, xhr => {
        console.log(quality + " error");
      })
      $(".80497718").on("click", () => {
        var value = $(".90545623").css("display");
        if (value === "none") {
          $(".90545623").css("display", "block");
        } else if (value === "block") {
          $(".90545623").css("display", "none");
        }
        event.stopPropagation();
      });
      $("body").on("click", () => {
        var value = $(".90545623").css("display");
        if (value === "block") {
          $(".90545623").css("display", "none");
        }
      })
    }, 1000);
  }
})();