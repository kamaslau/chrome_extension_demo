console.log('zhilian.js loaded')

// 状态标识符
const status_flag = document.createElement('p')
status_flag.id = 'extension_flag'
status_flag.innerText = '插件运行中'

// 向页面加入www.liuyajie.com的iframe
const iframe_width = '360px'
const iframe = document.createElement('iframe')
iframe.id = 'iframe_container'
iframe.src = 'https://www.liuyajie.com/'
iframe.width = iframe_width
iframe.height = '100%'
iframe.style.zIndex = '1000'
iframe.style.position = 'fixed'
iframe.style.right = 0
iframe.style.backgroundColor = '#fff'
iframe.style.borderWidth = 0
iframe.style.borderLeft = '2px solid #1698ed'

// iframe开关
const switcher = document.createElement('button')
switcher.id = 'iframe_switcher'
switcher.innerHTML = '&times;'
switcher.style.zIndex = '1000'
switcher.style.position = 'fixed'
switcher.style.right = iframe_width // 置于iframe左侧
switcher.style.top = 0
switcher.style.width = '44px'
switcher.style.height = '44px'
switcher.style.lineHeight = '44px'
switcher.style.padding = '0'
switcher.style.backgroundColor = 'rgba(22, 152, 237, .8)'
switcher.style.color = '#fff'
switcher.style.fontSize = '24px'

window.onload = () => {
    // document.querySelector('#root').prepend(status_flag)
    document.body.prepend(iframe)
    document.body.prepend(switcher)

  switcher.addEventListener('click', () => {
    console.log('iframe开关被点击')

    const iframe_visible = iframe.style.display !== 'none'
    iframe.style.display = iframe_visible ? 'none' : 'block'
    switcher.style.right = iframe_visible ? 0 : iframe_width
    switcher.innerHTML = iframe_visible ? '&plus;' : '&times;'
  })
}

// end zhilian.js
