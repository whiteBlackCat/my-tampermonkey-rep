// ==UserScript==
// @name         CustomADBlocker
// @name:cn      广告拦截,可添加自定义拦截目标
// @namespace    https://gitee.com/yp_program/
// @version      0.1.3
// @description  广告拦截,比起一般的预设,可以自定添加指定网址的拦截对象
// @iconURL ADBlocker.png
// @license MIT
// @updateURL my-tampermonkey-rep/raw/master/ADBlocker.js
// @author       youhou999
// @include http*://*
// @resource defaultConfigUrl 
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  let isDebugMode = localStorage.getItem('isDebugMode') === 'true'
  const log = (...args) => {
    if (isDebugMode) {
      args.forEach(arg => {
        if (typeof arg === 'string') {
          console.log(`%c${arg}`, 'background-color: yellow; font-size: 16px;')
        } else {
          console.log(arg)
        }
      })
    }
  }
  log('CustomADBlocker testing')
  const getConfig = (name = 'ADBlockConfigList') => {
    if (!localStorage) return []
    let configList = localStorage.getItem(name)
    if (configList) {
      configList = JSON.parse(configList)
    } else {
      // 默认配置
      configList = [{
        site: '//www.hacg.cat/wp/',
        selector: '#custom_html-2',
        guid: guid()
      }, {
        site: '*',
        selector: '[id|=ad],[class|=ad],[id|=Ad],[class|=Ad],[id|=tuiguang],[class|=tuiguang],[id~=ads],[class~=ads],[id~=ADV],[class~=ADV],[id~=ggad],[class~=ggad],[id~=topad],[class~=topad],[id~=aswift],[class~=aswift],[id~=abox],[class~=abox],[id~=sponsor],[class~=sponsor],[id~=spread],[class~=spread]',
        guid: guid()
      }, {
        site: '//www.baidu.com',
        selector: '',
        filter(el) {
          const wrapper_wrapperEl = document.getElementById('wrapper_wrapper')
          const result_logoEl = document.getElementById('result_logo')
          if (result_logoEl) {
            function rmad() {
              var results = [...(document.querySelectorAll('#content_left')[0] || {
                children: []
              }).children]
              results.filter(el => el.querySelector('[data-tuiguang]')).forEach(el => el.remove())
              document.getElementById('content_right').remove()
            }
            wrapper_wrapperEl.addEventListener('DOMSubtreeModified', () => {
              rmad()
            })
            rmad()
          }
        },
        guid: guid()
      }]

      localStorage.setItem('ADBlockConfigList', JSON.stringify(configList))
    }
    return configList
  }
  window.addEventListener('load', function () {
    let href = window.location.href
    let configList = getConfig()
    log('configList', configList)
    configList.forEach(item => {
      if (item.site) {
        try {
          let siteReg = new RegExp(item.site.trim().replace(/\*|\?/, val => '.' + val), 'gm')
          let selectEl = []
          log('siteReg', siteReg, 'href', href)
          if (siteReg.test(href)) {
            let filter = el => true
            if (item.filter) {
              filter = new Function(`return ${item.filter.strim()}`)()
            }
            if (item.selector) {
              let selector = item.selector.trim().replace(/;/g, ',')
              selectEl = [...document.querySelectorAll(selector)]
              log('selectEl', selectEl)
              selectEl.filter(filter).forEach(el => el.remove())
            } else {
              filter()
            }
          }
        } catch (error) {

        }
      }
    })
  })

  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }


})();