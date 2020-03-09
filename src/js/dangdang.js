/**
 * @deprecated 当当相关功能已单独剥离为dangdang_crx插件
 */
console.log('dangdang.js loaded')

window.onload = () => {
    // const input = document.createElement('p')
    // input.id = 'item_title'
    // input.innerText = '插件运行中'
    // document.querySelector('h1[title]').prepend(input)
}

const getTitle = () => {
    return document.querySelector('h1[title]').title.trim()
}

const getTagPrice = () => {
    const value = document.querySelector('#original-price').innerText.trim()
    return value.replace(/[^0-9.]*/g, '') // 仅保留数字和小数点
}

const getPublishYear = () => {
    let value
    const details = document.querySelectorAll('#product_info>.messbox_info>span.t1:not(#author)')

    // 轮询列表项DOM列表，查找格式为4位数字的数据项
    const year_pattern = /\d{4}/
    details.forEach(item => {
        const year_match = item.innerText.match(year_pattern)
        if (year_match) {
            value = year_match[0]
        }
    })

    return value
}

const getBarcode = () => {
    let value
    const details = document.querySelectorAll('#detail_describe>ul li')

    // 轮询列表项DOM列表，查找格式为13位数字的数据项
    const isbn_pattern = /\d{13}/
    details.forEach(item => {
        const isbn_match = item.innerText.match(isbn_pattern)
        if (isbn_match) {
            value = isbn_match[0]
        }
    })

    return value
}

// 响应通信
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        // 获取摘要信息
        if (request.action === 'getBrief') {
            const value = {
                title: getTitle(),
                tag_price: getTagPrice(),
                barcode: getBarcode(),
                publish_year: getPublishYear()
            }

            if (Object.keys(value).length > 0) {
                sendResponse(value)
            } else {
                sendResponse(null)
            }
        }

        // 获取商品标题
        else if (request.action === 'getTitle') {
            const value = getTitle()

            if (value.length > 0) {
                // 如果获取的值不为空，则返回数据到popup.js的回调函数，下同
                sendResponse(value)
                document.querySelector('#item_title').innerText = value
            } else {
                sendResponse(null)
            }
        }

        // 获取商品标价
        else if (request.action === 'getTagPrice') {
            const value = getTagPrice()

            if (value.length > 0) {
                sendResponse(value)
            } else {
                sendResponse(null)
            }
        }

        // 获取商品条形码/ISBN
        else if (request.action === 'getBarcode') {
            const value = getBarcode()

            if (value.length > 0) {
                sendResponse(value)
            } else {
                sendResponse(null)
            }
        }
    }
)

// end dangdang.js