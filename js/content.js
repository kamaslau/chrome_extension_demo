console.log('content.js loaded')

window.onload = () => {
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.id = 'switch_setting'
    document.querySelector('#root').prepend(input, '礼聘运行中')

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

            document.querySelector(".zp-searchbox__input").value = is_enabled? "礼聘运行中": '礼聘未运行'
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

        document.querySelector(".zp-searchbox__input").value = setting.is_enabled? "礼聘运行中": '礼聘未运行'
    })
}