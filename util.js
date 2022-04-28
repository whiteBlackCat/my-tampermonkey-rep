// 添加快捷页面顶底
function addPageScrollShortcut() {
  const CONTAINER_ID = 'side-bar-scroll-box'
  const KEYCODE = 'S'
  function addPageController() {
    var containerEl = document.createElement('div')
    containerEl.id = CONTAINER_ID
    containerEl.innerHTML = `
    <div style="border-radius: 15px; overflow: auto; box-shadow: rgb(204, 204, 204) 2px 2px 4px; position: fixed; bottom: 20px; right: 20px; z-index: 1000000;">
      <div class='side-bar-page-top' title="回到顶部" style="width: 30px; height: 30px; background-color: rgb(255, 255, 255); display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer;">
        <div style="margin-top: 5px; width: 8px; height: 8px; transform: rotate(-135deg); border-right: 2px solid #666; border-bottom: 2px solid #666;"></div>
      </div>
      <div title="到达底部" style="width: 30px; height: 30px; background-color: rgb(255, 255, 255); display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer;">
        <div class='side-bar-page-bottom' style="margin-bottom: 5px; width: 8px; height: 8px; transform: rotate(45deg); border-right: 2px solid #666; border-bottom: 2px solid #666;"></div>
      </div>
    </div>`
    containerEl.querySelector('.side-bar-page-top').addEventListener('click', function () {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    })
    containerEl.querySelector('.side-bar-page-bottom').addEventListener('click', function () {
      window.scroll({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' })
    })
    document.body.appendChild(containerEl)
  }
  function removePageController() {
    var el = document.getElementById(CONTAINER_ID)
    if (el) el.remove()
  }
  function existsPageController() {
    return Boolean(document.getElementById(CONTAINER_ID))
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === KEYCODE) {
      if (!existsPageController()) addPageController()
      else removePageController()
    }
  })
}

console.log('testing......');
addPageScrollShortcut();


function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
// 环境菜单添加配置弹窗页面
// 配置包括 是否默认显示,显示快捷键