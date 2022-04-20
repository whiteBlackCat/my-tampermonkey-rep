// ==UserScript==
// @name        自动显示京东、淘宝、聚划算、天猫、唯品会商品优惠券！双11购物助手！
// @version     7.4.5
// @description  专注寻找各平台优惠券，很实用的购物脚本。脚本介绍：1获取你要购买淘宝、天猫商品的优惠券  2获取你要购买的京东商品的优惠券 3如果有优惠券就展示再付款按钮旁边   4如果没有优惠券，页面什么也不展示，页面简洁   5后续还将开放苏宁。拼多多等平台的优惠券脚本  6新增整合全网购物功能，各平台价格一目了然     一键领券后再购物，价格更低！
// @author       xiaoshiyi

// @match        *://*.taobao.com/*

// @match        *://detail.vip.com/*
// @match        *://*.jd.com/*
// @match        *://npcitem.jd.hk/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @exclude    *://s.click.taobao.com/*
// @exclude    *://detail.tmall.com/item.htm?id=/*
// @exclude    *://uland.taobao.com/*
// @exclude       *://login.taobao.com/*
// @exclude       *://pages.tmall.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9.14.0/dist/sweetalert2.min.js
// @require      https://lib.baomitu.com/echarts/4.6.0/echarts.min.js
// @require      https://lib.baomitu.com/layer/2.3/layer.js
// @require      https://lib.baomitu.com/reflect-metadata/0.1.13/Reflect.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js
// @require      https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.0.0/crypto-js.js
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js

// @grant        GM_setClipboard
// @run-at       document-end
// @antifeature       referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！在此感谢大家的理解...】
// @connect      https://www.xiaoxiaodediyi.xyz
// @connect      shangxueba365.com
// @connect      api.wandhi.com
// @connect      cdn.jsdelivr.net
// @connect      tool.manmanbuy.com
// @connect      xbeibeix.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @namespace http://mmys.club
// ==/UserScript==

(function () {
  'use strict';




  // Your code here...
  var style = document.createElement('link');
  style.href = 'https://mmys.club/youhuiquan.css';
  style.rel = 'stylesheet';
  style.type = 'text/css';
  document.getElementsByTagName('head').item(0).appendChild(style);








  var obj = {};
  obj.initSearchHtml = function (selectorList) {
    setInterval(function () {
      selectorList.forEach(function (selector) {
        obj.initSearchItemSelector(selector);
      });
    }, 3000);
  };


  obj.basicQuery = function () {
    setInterval(function () {
      $(".tb-cool-box-wait").each(function () {
        obj.basicQueryItem(this);
      });
    }, 3000);
  };

  obj.initSearchItemSelector = function (selector) {
    $(selector).each(function () {
      obj.initSearchItem(this);
    });
  };



  obj.isDetailPageTaoBao = function (url) {
    if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 || url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf("//detail.tmall.hk/hk/item.htm") > 0) {
      return true;
    } else {
      return false;
    }
  };
  obj.isDetailPageJD = function (url) {
    if (url.indexOf("//item.jd.com") > 0) {
      return true;
    } else {
      return false;
    }
  };
  obj.isVailidItemId = function (itemId) {
    if (!itemId) {
      return false;
    }

    var itemIdInt = parseInt(itemId);
    if (itemIdInt == itemId && itemId > 10000) {
      return true;
    }
    else {
      return false;
    }
  };

  obj.isValidNid = function (nid) {
    if (!nid) {
      return false;
    }
    else if (nid.indexOf('http') >= 0) {
      if (obj.isDetailPageTaoBao(nid) || nid.indexOf("//detail.ju.taobao.com/home.htm") > 0) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  };
  obj.isDetailPageTaoBaoExtra = function (url) {
    if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 || url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf("//detail.tmall.hk/hk/item.htm") > 0) {
      return true;
    } else {
      return false;
    }
  };



  if (obj.isDetailPageTaoBaoExtra(location.href)) {
    if (location.href.indexOf('513160') > -1) {

      var couponArea2 = '<div class="coupon-wrap" ><div class="coupon" style="position: unset;padding-right: 0rem; display: block; color: gray;"><div class="coupon-info" style="position: unset;"><div class="coupon-desc">恭喜您！领取优惠券成功</div></div>';
      if (location.href.indexOf('//detail.tmall') != -1) {


        $('.tm-fcs-panel').after(couponArea2);

      }

    } else {
      var params = location.search.split('?')[1].split('&');
      var productId;

      for (var index in params) {
        if (params[index].split('=')[0] == 'id') {
          productId = params[index].split('=')[1];
          break;
        }
      }

      var df;


      $.get('https://www.xiaoxiaodediyi.xyz/tbs/' + productId, function (data, suscss) {


        if (data.data.coupon_click_url) {
          debugger;
          if (data.data.coupon > 0) {
            var couponArea = '<div class="coupon-wrap"><div class="coupon"><div class="coupon-info"><div class="coupon-desc">优惠券' + data.data.coupon + '元(限领一次)</div></div>' +
              '<a class="coupon-get" href="' + data.data.coupon_click_url + '">立即领取</a></div></div>';
          }
          if (location.href.indexOf('//detail.tmall') != -1) {

            $('.tm-fcs-panel').after(couponArea);
          }
          else {

            $('ul.tb-meta').after(couponArea);
          }
        } else {

          couponArea = '<div class="coupon-wrap" ><div class="coupon" style="position: unset;padding-right: 0rem; display: block; color: gray;"><div class="coupon-info" style="position: unset;"><div class="coupon-desc">未查询到优惠券</div></div>';
          if (location.href.indexOf('//detail.tmall') != -1) {


            $('.tm-fcs-panel').after(couponArea);
          }
          else {

            $('ul.tb-meta').after(couponArea);
          }



        }
      })

    }
  }

  else {


    if (location.href.indexOf('item.jd.') == -1 && location.href.indexOf('_source') == -1) {




      $("#J_goodsList li").each(function () {
        let a = $(this);
        var itemurl = a.find("a").attr('href');
        var skuid = a.attr('data-sku');
        $.get('https://www.xiaoxiaodediyi.xyz/jxx/' + skuid + '.html', function (dataaa, suscss) {

          if (dataaa.clickURL) {


            a.find("a").attr('href', 'https://www.xiaoxiaodediyi.xyz/details.html?a1=' + dataaa.clickURL)


          } else {



          }


        })
      })












    }






    else {
      var aaaa;
      if (location.href.indexOf('item.jd.') != -1 && location.href.indexOf('_source') == -1) {
        aaaa = true;
      }
      else {
        aaaa = false;
      }
      var bbbb;
      if (location.href.indexOf('item.jd.') != -1 && location.href.indexOf('_source') != -1 && location.href.indexOf('dediyi') == -1) {
        bbbb = true
      }
      else {
        bbbb = false;
      }

      if (aaaa || bbbb) {
        if (bbbb) {
          alert('检测到其他脚本可能存在爬虫风险,《一键领取》优惠券脚本查券受干扰！');
        }
        //var str = location.href.slice(20);

        var sss = location.href.split("/");
        var val = sss[sss.length - 1];
        var str;
        if (val.indexOf("?") != -1) {
          str = val.substr(0, val.indexOf("?"));
        } else {
          str = val.substr(0);
        }
        $.get('https://www.xiaoxiaodediyi.xyz/jxx/' + str + '', function (dataaa, suscss) {

          if (dataaa.clickURL) {


            //window.location.href ="https://www.xiaoxiaodediyi.xyz/details.html?a1="+ encodeURIComponent(dataaa.clickURL)  ;


            window.location.href = "https://www.xiaoxiaodediyi.xyz/details.html?a1=" + dataaa.clickURL;

            // window.open("https://www.xiaoxiaodediyi.xyz/details.html?a1="+ dataaa.clickURL);







          } else {
            var tb111 = $('#crumb-wrap').find('a[clstag="shangpin|keycount|product|mbNav-3"]').html();
            var tb211 = $('#crumb-wrap').find('a[clstag="shangpin|keycount|product|mbNav-5"]').html();
            var tb311 = tb111.replace("（", "");
            var tb411 = tb311.replace("）", "");
            var tb511 = tb211.replace("（", "");
            var tb611 = tb511.replace("）", "");

            var s222p = $(".sku-name").html().trim();

            var couponAreaeee = '<div class="coupon-wrap"><div class="coupon"  style="position: unset"><div class="coupon-info" style="margin-top: 6px;position: unset;border-right: 5px dashed white;"><div class="coupon-desc" >此商品暂无优惠券</div></div><a class="coupon-get" target="blank" href="https://a.jd.com/search.html?searchText=' + tb411 + '">点此处搜索相关优惠</a></div><div></div></div>';


            $('#choose-btns').after(couponAreaeee);



          }

        })

      }
      else {
        if (location.href.indexOf('_source') > -1) {
          var ssss = location.href.split("/");
          var val1 = ssss[ssss.length - 1];
          var strt;
          if (val1.indexOf("?") != -1) {
            strt = val1.substr(0, val1.indexOf("?"));
          } else {
            strt = val1.substr(0);
          }

          $.get('https://www.xiaoxiaodediyi.xyz/jds/' + strt + '', function (dataaa, suscss) {

            if (dataaa.data.couponInfo[0]) {
              var sp = dataaa.data.couponInfo[0].link;


              if (sp) {

                var money = dataaa.data.couponInfo[0].discount;

                var couponArea = '<div class="coupon-wrap"><div class="coupon"  style="position: unset"><div class="coupon-info" style="margin-top: 6px;position: unset;border-right: 5px dashed white;"><div class="coupon-desc" >查询到优惠券' + money + '元</div></div><a class="coupon-get" target="blank" href="' + sp + '">立即领取</a></div><div></div></div>';



                $('#choose-btns').after(couponArea);




              }

            } else {

              var tb11 = $('#crumb-wrap').find('a[clstag="shangpin|keycount|product|mbNav-3"]').html();
              var tb21 = $('#crumb-wrap').find('a[clstag="shangpin|keycount|product|mbNav-5"]').html();
              var tb31 = tb11.replace("（", "");
              var tb41 = tb31.replace("）", "");
              var tb51 = tb21.replace("（", "");
              var tb61 = tb51.replace("）", "");

              var s222p = $(".sku-name").html().trim();

              var couponAreaeee = '<div class="coupon-wrap"><div class="coupon"  style="position: unset"><div class="coupon-info" style="margin-top: 6px;position: unset;border-right: 5px dashed white;"><div class="coupon-desc" >此商品暂无优惠券</div></div><a class="coupon-get" target="blank" href="https://a.jd.com/search.html?searchText=' + tb41 + '">点此处搜索相关优惠</a></div><div></div></div>';


              $('#choose-btns').after(couponAreaeee);

            }
          })









































        }
      }




    }



  }
})();