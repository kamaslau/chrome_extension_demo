console.log('popup.js loaded')

let current_tab // 当前页面（即浏览器标签页）信息
const store = {
    'name': '', // 标题
    'tag_price': 0.00, // 标签价/原价
    'barcode': '' // 条形码/ISBN
}

window.onload = () => {
    current_tab = getCurrentTab()
}

// 获取当前页面（即浏览器标签页）
// https://developer.chrome.com/extensions/tabs#method-query
const getCurrentTab = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        // console.log(tabs)
        current_tab = tabs[0]
    })

    return current_tab
}

// 获取摘要信息
const getBrief = document.querySelector('#getBrief')
getBrief.addEventListener('click', () => {
    const current_tab = getCurrentTab()

    chrome.tabs.sendMessage(
        current_tab.id,
        {action: "getBrief"},
        function(response) {
            // console.log(response)
            store.name = document.getElementById('title').value = response.title
            store.tag_price = document.getElementById('tag_price').value = response.tag_price
            store.barcode = document.getElementById('barcode').value = response.barcode
        }
    )
})

/**
 * 保存数据
 * 
 * 发送数据到API
 */
const saveData = document.querySelector('#saveData')
saveData.addEventListener('click', async () => {
    // 发送到插件后台（js/background.js）进行API请求
    await chrome.runtime.sendMessage(
        {
            action: 'saveData',
            params: { ...store }
        },
        (response) => {
            console.log('response to saveData: ', response)
            alert(response)
        }
    )
})


// 获取商品标题
const getTitle = document.querySelector('#getTitle')
getTitle.addEventListener('click', () => {
    const current_tab = getCurrentTab()

    chrome.tabs.sendMessage(
        current_tab.id,
        {action: 'getTitle'},
        (response) => {
            // console.log(response)
            document.getElementById('title').value = response
        }
    )
})

// 获取商品标价
const getTagPrice = document.querySelector('#getTagPrice')
getTagPrice.addEventListener('click', () => {
    const current_tab = getCurrentTab()

    chrome.tabs.sendMessage(
        current_tab.id,
        {action: 'getTagPrice'},
        (response) => {
            // console.log(response)
            document.getElementById('tag_price').value = response
        }
    )
})

// 获取商品条形码
const getBarcode = document.querySelector('#getBarcode')
getBarcode.addEventListener('click', () => {
    const current_tab = getCurrentTab()

    chrome.tabs.sendMessage(
        current_tab.id,
        {action: 'getBarcode'},
        (response) => {
            // console.log(response)
            document.getElementById('barcode').value = response
        }
    )
})
