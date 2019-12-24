console.log('background.js loaded')

chrome.runtime.onInstalled.addListener(() => {
    console.log('installed')
})

chrome.bookmarks.onCreated.addListener(() => {
    alert('bookmark saved')
})

// 内部通信
chrome.runtime.onMessage.addListener(
	async (request, sender, sendResponse) => {
        // 保存数据
        if (request.action === 'saveData') {
            // console.log(request.params)

            await api_request(request.params)
            .then(
                data => {
                    console.log(data)
                    sendResponse(data)
                }
            )
        }
	}
)

// API公共参数
const common_params = {
    'app_type': 'biz',
    'operator_id': 1
}
// API请求参数
let params = {}

// 请求方法
const api_request = async (inputs) => {
    // 请求API
    const params = {
        ...common_params,
        ...inputs
    }

    // 将参数转为FormData进行发送
    const form_data = new FormData()
    Object.keys(params).forEach(
        (key) => {
            form_data.append(key, params[key])
            // console.log(form_data.get(key)) // FormData对象无法直接console.log，可通过get方法查看特定键值
        }
    )

    let message = ''

    await new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()

        request.open('post', 'https://api.imakp.liuyajie.com/item_template/create', true)
        
        request.onload = () => {
            
            if (request.status === 200) {
                const result = JSON.parse(request.response)
                // console.log(result)
                if (result.status === 200) {
                    message = result.content.message
                }
                else {
                    message = result.content.error.message
                }
                resolve(message)
            }
            else {
                reject(Error(request.statusText))
            }
        }
        request.onerror = () => {
            reject(Error('Network Error'))
        }
        request.send(form_data)
    })

    return message // end Promise
}
