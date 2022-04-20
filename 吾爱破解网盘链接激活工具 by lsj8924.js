// ==UserScript==
// @name        吾爱破解网盘链接激活工具 by lsj8924
// @namespace   https://greasyfork.org/zh-CN/users/64266-lsj8924
// @description 激活吾爱破解论坛的百度和360网盘的链接，可以直接点击。
// @include     http://www.52pojie.cn/forum*
// @include     http://www.52pojie.cn/thread*
// @version     1.0.4
// @grant       unsafeWindow
// @require     http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// ==/UserScript==
function activelink(re, nre) {
  $('.t_f').each(function () {
    //console.log('info:'+ $(this).html());
    // var link = re.exec($(this).html());
    if (($(this).html()).match(nre)) return;
    var link = ($(this).html()).match(re);
    console.log(link);
    if (link) {
      var ss = $(this).html();
      ss = ss.replace(re, '<a target="_blank" href="$1" style="color: rgb(63, 211, 68); text-decoration:none;">$1</a>');
      $(this).html(ss);
    }
  });
}
var re_baidu = /((?:https?:\/\/)?(?:yun|pan|eyun).baidu.com\/(?:s\/\w*|share\/\S*\d))/g; //更直观的写法
var re_ex_baidu = /(href="https?:\/\/(yun|pan|eyun).baidu.com\/(?:s\/\w*|share\/\S*\d))/g;
activelink(re_baidu, re_ex_baidu);
//var re_360 = /(https?:\/\/yunpan.cn\/\w*)/g;
//var re_ex_360 = /href="https?:\/\/yunpan.cn\/\w*/g;
//activelink(re_360, re_ex_360);
var re_weiyun = /(https?:\/\/(share.weiyun.com|url.cn)\/\w*)/g;
var re_ex_weiyun = /href="https?:\/\/(share.weiyun.com|url.cn)\/\w*/g;
activelink(re_weiyun, re_ex_weiyun);

var temp = /(<\/font><font color="#\w*">h<\/font><font color="#\w*">t<\/font>.*font>)/g;
$('.t_f').each(function () {
  var link = ($(this).html()).match(temp);
  if (link) {
    link = link[0].replace(/<font color="#\w*">|<\/font>/g, "").match(/htt.*?(?=\s)/)[0];
    console.log(link);
  }
  var ss = $(this).html();
  var m = '<a target="_blank" href=' + link + ' style="color: rgb(63, 211, 68); text-decoration:none;">$1</a>';
  ss = ss.replace(temp, m);
  $(this).html(ss);

});