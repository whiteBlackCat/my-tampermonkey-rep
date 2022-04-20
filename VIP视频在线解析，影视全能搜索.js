// ==UserScript==
// @name         VIP视频在线解析，影视全能搜索
// @namespace    xxxx
// @version      1.5.2
// @description  在视频标题旁上显示“vip解析”按钮和“搜索电影”按钮，在线播放vip视频；支持优酷vip，腾讯vip，爱奇艺vip，芒果vip，乐视vip等常用视频，显示优惠券查询。
// @author       xxxx
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/anime/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://detail.tmall.com/item.htm?*
// @match        *://item.taobao.com/item.htm?*
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @antifeature  referral-link 此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉。
// ==/UserScript==


(function () {
  'use strict';
  window.$ = $
  var curPlaySite = '';
  var curWords = '';
  var videoSite = window.location.href;
  var reYk = /youku/i;
  var reAqy = /iqiyi/i;
  var reTX = /qq/i;
  var reTD = /tudou/i;
  var reMG = /mgtv/i;
  var reSH = /sohu/i;
  var reAF = /acfun/i;
  var reBL = /bilibili/i;
  var reYJ = /1905/i;
  var rePP = /pptv/i;
  var reYYT = /yinyuetai/i;
  var reTM = /tmall/i;
  var reTB = /taobao/i;
  var vipBtn = '<a id="czjx8VipBtn" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">vip解析</a>';
  var mSearchBtn = '<a id="czjx8SearchBtn" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">搜索电影</a>';
  var tmBtn = '<div class="tb-btn-buy tb-btn-sku" style="margin-top: 10px"><a id="togetnice" href="javascript:;" target="_blank">领取优惠券</a></div>';
  var tbBtn = '<div class="tb-btn-buy" style="margin-top: 10px;"><a id="togetTbnice" href="javascript:;" target="_blank">领取优惠券</a></div>';

  if (reYk.test(videoSite)) {
    var youkuTitle = $('#left-title-content-wrap').find('.subtitle');
    if (youkuTitle.length !== 0) {
      youkuTitle.after(mSearchBtn).after(vipBtn);
      $('#czjx8VipBtn').css({ 'font-size': '17px', 'display': 'inline-block', 'height': '22px', 'line-height': '22px', 'margin': '0 5px', 'vertical-align': 'bottom' });
      $('#czjx8SearchBtn').css({ 'font-size': '17px', 'display': 'inline-block', 'height': '22px', 'line-height': '22px', 'margin': '0 5px', 'vertical-align': 'bottom' });
      if ($('#left-title-content-wrap').find('.subtitle').length !== 0) {
        curWords = $('#left-title-content-wrap').find('.subtitle').attr('title');
      }
      $('#czjx8SearchBtn').attr('href', 'http://ifkdy.com/search?key=' + curWords + '&p=1');
    }
  }

  if (reTX.test(videoSite)) {
    var qqTitle = $('.mod_intro').find('.video_title');
    qqTitle.eq(0).after(mSearchBtn).after(vipBtn);
    $('#czjx8VipBtn').css({ 'font-size': '24px', 'display': 'inline-block', 'height': '36px', 'line-height': '36px', 'margin': '0 5px' });
    $('#czjx8SearchBtn').css({ 'font-size': '24px', 'display': 'inline-block', 'height': '36px', 'line-height': '36px', 'margin': '0 5px' });
    if ($('.player_title').length !== 0 && $('.player_title').find('a').length === 0) {
      curWords = $('.player_title').text();
    } else {
      curWords = $('._base_title').text();
    }
    if (curWords === '') {
      curWords = $('.player_title').text();
    }
    $('#czjx8SearchBtn').attr('href', 'http://ifkdy.com/search?key=' + curWords + '&p=1');
  }

  if (reTD.test(videoSite)) {
    var tdTitle = $('#videoKw');
    tdTitle.parent('.fix').append(vipBtn);
    $('#czjx8VipBtn').css({ 'font-size': '18px', 'display': 'inline-block', 'height': '22px', 'line-height': '22px', 'margin': '14px 5px 0' });
  }

  if (reMG.test(videoSite)) {
    var mgTitle = $('.control-left').find('.title');
    mgTitle.after(mSearchBtn).after(vipBtn);
    mgTitle.css({ 'float': 'left', 'margin-right': '0' });
    $('#czjx8VipBtn').css({ 'font-size': '22px', 'display': 'inline-block', 'height': '40px', 'line-height': '40px', 'margin': '0 5px' });
    $('#czjx8SearchBtn').css({ 'font-size': '22px', 'display': 'inline-block', 'height': '40px', 'line-height': '40px', 'margin': '0 5px' });
    curWords = mgTitle.text();
    $('#czjx8SearchBtn').attr('href', 'http://ifkdy.com/search?key=' + curWords + '&p=1');
  }

  if (reSH.test(videoSite)) {
    var shTitle = $('.player-top-info-name');
    shTitle.append(vipBtn).append(mSearchBtn);
    shTitle.find('h2').css({ 'float': 'left' });
    $('#czjx8VipBtn').css({ 'font-weight': 'bold', 'font-size': '16px', 'display': 'inline-block', 'height': '36px', 'line-height': '36px', 'margin': '0 5px' });
    $('#czjx8SearchBtn').css({ 'font-weight': 'bold', 'font-size': '16px', 'display': 'inline-block', 'height': '36px', 'line-height': '36px', 'margin': '0 5px' });
    curWords = shTitle.find('h2').text();
    $('#czjx8SearchBtn').attr('href', 'http://ifkdy.com/search?key=' + curWords + '&p=1');
  }

  if (reTM.test(videoSite)) {
    var curTmTitle = encodeURI($.trim($('.tb-detail-hd').children('h1').text()));
    console.log(curTmTitle)
    $('.tb-action').append(tmBtn);
    $('#togetnice').attr('href', 'http://mall.yhm11.com/index.php?input=2&r=l&kw=' + curTmTitle);
  }

  if (reTB.test(videoSite)) {
    var curTbTitle = encodeURI($.trim($('.tb-main-title').attr('data-title')));
    console.log(curTbTitle)
    $('.tb-action').append(tbBtn);
    $('#togetTbnice').attr('href', 'http://mall.yhm11.com/index.php?input=2&r=l&kw=' + curTbTitle);
  }

  if (reYYT.test(videoSite)) {
    var yytTitle = $('.videoName');
    yytTitle.append(vipBtn);
    $('#czjx8VipBtn').css({ 'font-weight': 'bold', 'font-size': '14px', 'display': 'inline-block', 'height': '32px', 'line-height': '32px', 'margin': '0 5px' });
  }

  if (reAqy.test(videoSite)) {
    const iqiyiTitle = $('.qy-player-title')
    console.log('iqiyiTitle ==> ', iqiyiTitle);
    iqiyiTitle.append(`<a id="czjx8VipBtnIqiyi" href="http://czjx8.com/?url=${window.location.href}" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">vip解析</a>`);
    $('#czjx8VipBtnIqiyi').css({ 'font-size': '22px', 'display': 'inline-block', 'height': '40px', 'line-height': '40px', 'margin': '0 5px' });
  }

  $('#czjx8VipBtn').on('click', function () {
    curPlaySite = window.location.href;
    window.location.href = 'http://czjx8.com/?url=' + curPlaySite;
  });
})();