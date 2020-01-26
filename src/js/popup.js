console.log('popup.js loaded')

const initState = {
    'name': '', // 标题
    'tag_price': 0.00, // 标签价/原价
    'barcode': '', // 条形码/ISBN
    'publish_year': '' // 出版年份
}
let store

const commit = {
  updateName: (value) => {
    store.name = value
    document.getElementById('title').value = value
  },

  updateTagPrice: (value) => {
    store.tag_price = value
    document.getElementById('tag_price').value = value
  },

  updateBarcode: (value) => {
    store.barcode = value
    document.getElementById('barcode').value = value
  },

  updatePublishYear: (value) => {
    store.publish_year = value
    // document.getElementById('publish_year').value = value
  }
}

let current_tab // 当前页面（即浏览器标签页）信息
let barcodeInput // 条形码字段

window.onload = () => {
  store = { ...initState }
  current_tab = getCurrentTab()

  // 转到插件选项页的链接
  document.querySelector('#to-options').addEventListener('click',() => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('options.html'))
    }
  })

  // 重置按钮
  document.querySelector('#resetForm').addEventListener('click', () => {
    resetAll()
  })

  // 监控条形码字段输入事件
  // 若长度合规，请求API验证数据库里是否已有相应数据，并作相应提示；
  // 若有则可更新，若否则可创建
  barcodeInput = document.querySelector('#barcode')
  barcodeInput.addEventListener('change', event => getItem(event.target.value))

  restoreHistory()
}

// 全局重置；重置按钮表单、异步存储，及状态
const resetAll = () => {
  commit.updateName( '' )
  commit.updateTagPrice( '' )
  commit.updateBarcode( '' )
  commit.updatePublishYear( '' )

  // 调用异步storageAPI
  chrome.storage.sync.set(store, () => {
    console.log('store saved to storage as: ', store)
  })
}

// 尝试获取并恢复历史数据到状态
const restoreHistory = () => {
  // 调用异步storageAPI
  chrome.storage.sync.get(
      ['name', 'tag_price', 'barcode', 'publish_year'],
      storage => {
        console.log('restoreHistory: ', storage)

        if (Object.keys(storage).length > 0 && storage.name.length > 0) {
          commit.updateName( storage.name )
          commit.updateTagPrice( storage.tag_price )
          commit.updateBarcode( storage.barcode )
          commit.updatePublishYear( storage.publish_year )

        } else {
          barcodeInput.focus() // 若无本地值，聚焦到条形码字段

        }
      }
  )
}

// 获取当前页面信息（即浏览器标签页）
// https://developer.chrome.com/extensions/tabs#method-query
const getCurrentTab = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        // console.log(tabs)
        current_tab = tabs[0]
    })

    return current_tab
}

// 根据条形码检查是否对应的商品已存在
const getItem = (barcode) => {
  // console.log('getItem.barcode: ', barcode)
  if (barcode && barcode.length !== 13) return

  // 发送到插件后台（js/background.js）进行API请求
  chrome.runtime.sendMessage(
      {
        action: 'getItem',
        params: { barcode }
      },
      (response) => {
        console.log('response to getItem: ', response)
        const content = response.content

        let message = '与该条形码对应的数据', style_class

        if (response.status === 200) {
          commit.updateName( content.name )
          commit.updateTagPrice( content.tag_price )
          commit.updateBarcode( content.barcode )
          commit.updatePublishYear( content.publish_year )

          // 调用异步storageAPI
          chrome.storage.sync.set(store, () => {
            console.log('store saved to storage as: ', store)
          })

          message += '已存在'
          style_class = 'primary'

        } else {
          message += '暂无记录'
          style_class = 'light'

          dom_get_brief() // 解析DOM
        }

        // 更新反馈
        updateScreen(message, style_class)
      }
  )
}

// 解析DOM-获取详情
const dom_get_brief = () => {
  updateScreen('数据解析中', 'light')

  chrome.tabs.sendMessage(
      current_tab.id,
      {action: "getBrief"},
      (response) => {
        // console.log(response)
        commit.updateName( response.title )
        commit.updateTagPrice( response.tag_price )
        commit.updateBarcode( response.barcode )
        commit.updatePublishYear( response.publish_year )

        // 调用异步storageAPI
        chrome.storage.sync.set(store, () => {
          console.log('store saved to storage as: ', store)
        })
      }
  )
}

// 获取摘要信息
const getBrief = document.querySelector('#getBrief')
getBrief.addEventListener('click', () => dom_get_brief())

/**
 * 保存数据
 * 
 * 发送数据到API
 */
const saveData = document.querySelector('#saveData')
saveData.addEventListener('click', () => {
  if (
      !store.barcode || store.barcode.length !== 13 ||
      !store.name ||
      !store.tag_price || store.tag_price.length < 4 ||
      !store.publish_year || store.publish_year.length !== 4
  ) {
    // 更新反馈
    updateScreen('需正确填写所有字段', 'danger')

    return
  }

    chrome.runtime.sendMessage(
        {
            action: 'saveData',
            params: { ...store }
        },
        (response) => {
            console.log('response to saveData: ', response)
            const content = response.content

          let message, style_class

          if (response.status === 200) {
            message = content.message
            style_class = 'success'
          } else {
            message = content.error.message
            style_class = 'danger'
          }

          // 更新反馈
          updateScreen(message, style_class)

          // 全局重置
          resetAll()
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
    chrome.tabs.sendMessage(
        current_tab.id,
        {action: 'getBarcode'},
        (response) => {
            // console.log(response)
            document.getElementById('barcode').value = response
        }
    )
})

// 获取商品条形码，并尝试请求API获取已有的数据（若有）
const tryBarcode = document.querySelector('#tryBarcode')
tryBarcode.addEventListener('click', () => {
  chrome.tabs.sendMessage(
      current_tab.id,
      {action: 'getBarcode'},
      (response) => {
        // console.log(response)
        document.getElementById('barcode').value = response

        updateScreen('远程数据获取中', 'light')

        getItem(response)
      }
  )
})

// 手动修改商品标题
const inputTitle = document.querySelector('#title')
inputTitle.addEventListener('change', () => {
  const title = inputTitle.value

  commit.updateName( title )
})

// 更新API操作反馈区
const updateScreen = (text, style_class) => {
  console.log(text, style_class)

  const screen = document.querySelector('#screen')
  screen.className = 'alert alert-' + style_class

  const message = document.querySelector('#message')
  message.innerHTML = text

  // 隐藏提示
  const fadeProcess = setTimeout(
      () => {
        screen.className = 'alert'
        message.innerHTML = ''
      },
      2500
  )
}
