// ==UserScript==
// @name         AD Block
// @name:cn      广告阻拦
// @namespace    http://tampermonkey.net/
// @version      1.2.9
// @description  【使用前先看介绍/有问题可反馈】广告阻拦 (AD Block): 移除常见网站广告，优化百度系网站使用体验，增加快捷键开启辅助功能。
// @author       cc
// @include      *
// @noframes
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const DEBUG = false
  const VERSION = "1.2.9";
  function inform(msg, debug) {
    debug = typeof debug === 'boolean' ? debug : DEBUG
    if (debug) console.log(`%c${msg}`, 'background-color: yellow; font-size: 16px;')
  }
  function addShortcut() {
    function addPageController() {
      var container = document.createElement('div')
      var up_btn = document.createElement('div')
      var down_btn = document.createElement('div')
      container.id = 'notad-block-page-controller'
      container.style = 'border-radius: 15px; overflow: auto; box-shadow: 2px 2px 4px #ccc; position: fixed; bottom: 20px; right: 20px; z-index: 1000000;'
      up_btn.innerHTML = '<div style="margin-top: 5px; width: 8px; height: 8px; transform: rotate(-135deg); border-right: 2px solid #666; border-bottom: 2px solid #666;"></div>'
      up_btn.style = 'width: 30px; height: 30px; background-color: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer;'
      up_btn.title = '回到顶部'
      up_btn.onclick = () => { window.scroll({ top: 0, left: 0, behavior: 'smooth' }) }
      down_btn.innerHTML = `<div style="margin-bottom: 5px; width: 8px; height: 8px; transform: rotate(45deg); border-right: 2px solid #666; border-bottom: 2px solid #666;"></div>`
      down_btn.style = 'width: 30px; height: 30px; background-color: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer;'
      down_btn.title = '到达底部'
      down_btn.onclick = () => {
        var h = document.body.scrollHeight
        window.scroll({ top: h, left: 0, behavior: 'smooth' })
      }
      container.appendChild(up_btn)
      container.appendChild(down_btn)
      document.body.appendChild(container)
    }
    function removePageController() {
      var el = document.getElementById('notad-block-page-controller')
      if (el) el.remove()
    }
    function existsPageController() {
      return Boolean(document.getElementById('notad-block-page-controller'))
    }
    document.addEventListener('keydown', (event) => {
      if (event.key === 'S') {
        if (!existsPageController()) addPageController()
        else removePageController()
      }
    })
    inform('AD Block has added shortcut.', true)
  }
  inform(`AD Block version: ${VERSION}`, true)
  addShortcut()
  window.onload = function () {
    inform('AD Block has loaded.', true)
    var rmad
    function rmCommonAd() {
      var ad_key = ['ad', 'Ad', 'AD', 'ads', 'ADV', 'ggad', 'topad', 'aswift', 'abox', 'sponsor', 'spread']
      ad_key.forEach((key) => {
        if (key === 'ad') {
          Array.from(document.querySelectorAll(`[class*=${key}]`)).filter(el => {
            if (typeof el.className !== 'string') return false
            if (el.className.match(/[a-z]?ad[a-z]?/)[0] !== 'ad') return false
            return true
          }).forEach(el => el.style.display = 'none')
        } else if (key === 'Ad') {
          Array.from(document.querySelectorAll(`[id*=${key}]`)).filter(el => {
            if (['G_IMG'].includes(el.tagName)) return false
            if (el.id.match(/Ad[a-z]?/)[0] !== 'Ad') return false
            return true
          }).forEach(el => el.style.display = 'none')
          Array.from(document.querySelectorAll(`[class*=${key}]`)).filter(el => {
            if (['G_IMG'].includes(el.tagName)) return false
            if (typeof el.className !== 'string') return false
            if (el.className.match(/Ad[a-z]?/)[0] !== 'Ad') return false
            return true
          }).forEach(el => el.style.display = 'none')
        } else {
          document.querySelectorAll(`[id*=${key}]`).forEach(el => el.style.display = 'none')
          document.querySelectorAll(`[class*=${key}]`).forEach(el => el.style.display = 'none')
        }
      })
      Array.from(document.querySelectorAll('*')).filter(el => Boolean([...el.attributes].find(attr => {
        var m = attr.name.match(/[a-z]?ad[a-z]?/)
        if (m && m[0] === 'ad') return true
        m = attr.name.match(/[a-z]?ads[a-z]?/)
        if (m && m[0] === 'ad') return true
        return false
      }))).forEach(el => el.style.display = 'none')
      Array.from(document.querySelectorAll(`iframe`)).filter(el => {
        if (typeof el.src !== 'string') return false
        var m = el.src.match(/[a-zA-Z0-9]?ad[a-zA-Z0-9]?/)
        if (m && m[0] === 'ad') return true
        m = el.src.match(/[a-zA-Z0-9]?ads[a-zA-Z0-9]?/)
        if (m && m[0] === 'ads') return true
        var keys = ['googleads']
        for (let key of keys) if (el.src.includes(key)) return true
        return false
      }).forEach(el => el.style.display = 'none')
      inform('AD Block has removed common ads.', true)
    }
    rmCommonAd()
    if (location.host === 'www.baidu.com') {
      if (document.getElementById('result_logo') && document.getElementById('wrapper_wrapper')) {
        function rmad() {
          var results = [...document.querySelectorAll('[id]')].filter(el => el.id.match(/^\d+$/))
          results.filter(el => el.querySelector('[data-tuiguang]')).forEach(el => el.remove())
          results = results.filter(el => document.contains(el))
          results.filter(el => el.querySelector('[class*=tuiguang]')).forEach(el => el.remove())
          var content_right = document.getElementById('content_right')
          if (content_right) Array.from(content_right.children).filter(el => el.tagName !== 'TABLE').forEach(el => el.remove())
        }
        var wrapper_wrapper = document.getElementById('wrapper_wrapper')
        wrapper_wrapper.addEventListener('DOMSubtreeModified', () => {
          var content_left = document.getElementById('content_left')
          if (content_left) {
            content_left.addEventListener('DOMSubtreeModified', rmad)
            rmad()
          }
        })
        rmad()
      }
    } else if (location.host === 'wenku.baidu.com') {
      if (location.href.indexOf('wenku.baidu.com/search') >= 0) {
        rmad = () => {
          var fcad = document.getElementById('fengchaoad')
          if (fcad) fcad.remove()
        }
        rmad()
      } else if (location.href.indexOf('wenku.baidu.com/view') >= 0) {
        rmad = () => {
          document.querySelectorAll('[class*=hx]').forEach(el => el.remove())
          document.querySelectorAll('[class*=vip]').forEach(el => el.remove())
        }
        var expand = () => {
          var read_all = document.querySelector('.read-all')
          if (read_all) {
            read_all.click()
            rmad()
          }
        }
        var observe = () => {
          var content = document.getElementById('reader-container')
          while (content.childElementCount === 1) content = content.firstElementChild
          content.addEventListener('DOMSubtreeModified', expand)
          expand()
        }
        observe()
      }
    } else if (location.host === 'tieba.baidu.com') {
      var content = document.querySelector('#container>.content')
      if (content) {
        rmad = () => document.querySelectorAll('#j_p_postlist>.j_l_post[ad-dom-img]').forEach(el => el.remove())
        content.addEventListener('DOMSubtreeModified', rmad)
        rmad()
      }
      var pgpt = document.getElementById('pagelet_frs-list/pagelet/thread')
      if (pgpt) {
        rmad = () => {
          document.querySelectorAll('.fengchao-wrap-feed').forEach(el => el.remove())
          Array.from(thread_list.children).filter(el => (el.tagName === 'LI') && (typeof el.className === 'string') && (el.className.indexOf('j_thread_list') < 0)).forEach(el => el.remove())
        }
        pgpt.addEventListener('DOMSubtreeModified', () => {
          var thread_list = document.querySelector('#thread_list')
          if (thread_list) {
            thread_list.addEventListener('DOMSubtreeModified', rmad)
            rmad()
          }
        })
        rmad()
      }
    } else if (location.host === 'jingyan.baidu.com') {
      document.querySelectorAll('#aside, #wgt-like, #fresh-share-exp-e, #wgt-exp-share, .task-panel-entrance').forEach(el => el.remove())
      document.getElementById('main-content').style.width = 'inherit'
    } else if (location.href.includes('csdn.net')) {
      document.title = document.title.replace(/^\(\d+条消息\)\s/, '').replace(/_.+?\-CSDN博客$/, '') + ' - CSDN'
    } else if (location.host === 'paste.ubuntu.com') {
      if (document.getElementById('id_syntax')) {
        var select_el = document.getElementById('id_syntax')
        var main_values = ["c", "cpp", "csharp", "css", "delphi", "fortran", "go", "groovy", "html", "java", "js", "json", "kotlin", "matlab", "objective-c", "objective-c++", "php", "python", "rb", "sql", "swift", "text", "vb.net"]
        var less_options = [...select_el.children].filter(option => !main_values.includes(option.value))
        less_options.forEach(e => e.style.display = 'none')
        var insert_p = document.createElement('p')
        insert_p.style = 'display: flex; align-items: center; margin-left: 10px; min-width: max-content;'
        var checkbox = document.createElement('input')
        checkbox.name = 'concise'
        checkbox.type = 'checkbox'
        checkbox.checked = true
        var label = document.createElement('label')
        label.setAttribute('for', 'concise')
        label.innerText = 'show only mainstream programming languages'
        label.addEventListener('click', () => {
          console.warn('called')
          checkbox.checked = !checkbox.checked
          less_options.forEach(e => e.style.display = checkbox.checked ? 'none' : '')
        })
        insert_p.appendChild(checkbox);
        insert_p.appendChild(label);
        var table_el = document.querySelector('#pasteform :first-child')
        table_el.parentElement.insertBefore(insert_p, table_el)
      }
    } else if (location.host === 'www.jb51.net') {
      document.querySelectorAll('[class*=logo]').forEach(el => el.remove())
      document.querySelectorAll('[class*=blank]').forEach(el => el.remove())
      document.querySelectorAll('[class*=dxy]').forEach(el => el.remove())
      document.querySelectorAll('[class*=lbd]').forEach(el => el.remove())
      document.querySelectorAll('#txtlink, .mainlr, .main-right, .topimg').forEach(el => el.remove())
      document.querySelectorAll('.main-left').forEach(el => el.style.width = '100%')
    } else if (location.host.includes('.alexa.cn')) {
      Array.from(document.querySelectorAll('[class*=important]')).forEach(el => el.remove())
    } else if (location.host === 'www.it1352.com') {
      document.querySelectorAll('.row.hidden-sm').forEach(el => el.remove())
    } else if (location.host === 'www.bilibili.com') {
      if (location.href === 'https://www.bilibili.com/') {
        document.querySelectorAll('.banner-card').forEach(el => el.remove())
      } else if (location.href.includes('/video/')) {
        document.querySelector('.v-wrap').addEventListener('DOMSubtreeModified', () => {
          document.querySelectorAll('[id*=Ad], [class*=activity]').forEach(el => el.style.display = 'none')
        })
        document.querySelectorAll('[id*=Ad], [class*=activity]').forEach(el => el.style.display = 'none')
        document.querySelector('.l-con').addEventListener('DOMSubtreeModified', () => {
          document.querySelectorAll('[id*=ad-], [id*=ad-], [class*=-ad], [class*=ad-], [id*=Ad], [id*=recommand]').forEach(el => el.style.display = 'none')
        })
        document.querySelectorAll('[id*=ad-], [id*=ad-], [class*=-ad], [class*=ad-], [id*=Ad], [id*=recommand]').forEach(el => el.style.display = 'none')
      }
    } else if (location.host === 'www.imomoe.ai') {
      rmad = () => { document.querySelectorAll('[id*=HM], #fix_bottom_dom').forEach(el => el.remove()) }
      document.body.addEventListener('DOMSubtreeModified', rmad)
      rmad()
    } else if (location.host === 'www.zhihu.com') {
      document.title = document.title.replace(/\(\d+\s封私信\s\/\s\d+\s条消息\)\s/, '')
    } else if (location.host === 'www.xbiquge.la') {
      rmad = () => {
        document.querySelectorAll('[id*=cs_]').forEach(el => el.remove())
        document.querySelectorAll('.dahengfu').forEach(el => el.remove())
        document.querySelectorAll('.box_con>table').forEach(el => el.remove())
        document.querySelectorAll('.box_con>p').forEach(el => el.remove())
        document.querySelectorAll('#content>p:last-child').forEach(el => el.remove())
      }
      document.body.addEventListener('DOMSubtreeModified', rmad)
      rmad()
    }
  }
})();