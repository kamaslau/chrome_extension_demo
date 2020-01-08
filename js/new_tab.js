console.log('new_tab.js loaded')

const bookmarks_dom = document.querySelector('#bookmarks ul')
// console.table(bookmarks_dom)

// 载入本地JSON文件并输出数据列表
let bookmarks
(async () => {

    await new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()

        request.open('get', '../new_tab.json', true)

        request.onload = () => {

            if (request.status === 200) {
                const result = JSON.parse(request.response)
                // console.log('response', result)

                bookmarks = result.content? result.content: []

                resolve(bookmarks)
            }
            else {
                reject(Error(request.statusText))
            }

        }

        request.onerror = () => {
            reject(Error('Network Error'))
        }

        request.send(null)

    }).then((data) => {
        // 输出DOM
        data.forEach(
            item => bookmarks_dom.innerHTML += `<li><a title="${item.name}" href="${item.url}" target="_blank">${item.name}</a></li>`
        )

    })

})()

/*
try {


} catch (error) {
    console.error(error)

} finally {

}
 */