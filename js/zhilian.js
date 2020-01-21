console.log('zhilian.js loaded')

const input = document.createElement('input')
input.type = 'checkbox'
input.id = 'switch_setting'

// 状态标识符
const status_flag = document.createElement('p')
status_flag.id = 'extension_flag'
status_flag.innerText = '插件运行中'

// 向页面加入www.liuyajie.com的iframe
const iframe = document.createElement('iframe')
iframe.id = 'iframe_container'
iframe.src = 'https://www.liuyajie.com/'
iframe.width = '30%'
iframe.height = '100%'
iframe.style.zIndex = '1000'
iframe.style.position = 'fixed'
iframe.style.right = 0
iframe.style.backgroundColor = '#fff'
document.body.prepend(iframe)

window.onload = () => {
    document.querySelector('#root').prepend(input, status_flag)

    input.addEventListener(
        'click',
        () => store_setting()
    )

    check_setting()
}

// 调取storage
const check_setting = () => {
    chrome.storage.sync.get(
        ['is_enabled'],
        result => {
            console.log(result)

            const is_enabled = result.is_enabled

            document.getElementById('switch_setting').checked = is_enabled

            document.querySelector(".a-input__native").value = is_enabled? "礼聘运行中": '礼聘未运行'
        }
    )
}

// 存入storage
const store_setting = () => {
    const is_enabled = document.getElementById('switch_setting').checked

    const setting = {
        is_enabled
    }

    // 调用storageAPI
    chrome.storage.sync.set(setting, () => {
        console.log('stored', setting)

        document.querySelector(".a-input__native").value = setting.is_enabled? "礼聘运行中": '礼聘未运行'
    })
}

// end zhilian.js
