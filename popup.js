console.log('popup.js loaded')

let current_tab
window.onload = () => {
    current_tab = getCurrentTab()
}

// 获取当前页面（即浏览器标签页）
// https://developer.chrome.com/extensions/tabs#method-query
const getCurrentTab = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        // console.log(tabs[0])
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
            console.log(response)
            document.getElementById('title').value = response.title
            document.getElementById('tag_price').value = response.tag_price
            document.getElementById('barcode').value = response.barcode
        }
    )
})

// 获取商品标题
const getTitle = document.querySelector('#getTitle')
getTitle.addEventListener('click', () => {
    const current_tab = getCurrentTab()

    chrome.tabs.sendMessage(
        current_tab.id,
        {action: "getTitle"},
        function(response) {
            console.log(response)
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
        {action: "getTagPrice"},
        function(response) {
            console.log(response)
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
        {action: "getBarcode"},
        function(response) {
            console.log(response)
            document.getElementById('barcode').value = response
        }
    )
})
