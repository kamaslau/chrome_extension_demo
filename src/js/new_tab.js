console.log('new_tab.js loaded')

;(() => {

window.onload = () => {
    // 载入本地JSON文件并输出数据列表
    ;(async () => {
        const bookmarks_dom = document.querySelector('#json ul')
    
        let bookmarks

        await new Promise((resolve, reject) => {
            const request = new XMLHttpRequest()

            request.open('get', '../new_tab.json', true)

            request.onload = () => {

                if (request.status === 200) {
                    const result = JSON.parse(request.response)
                    // console.log('response', result)

                    bookmarks = result.content? result.content: []

                    resolve(bookmarks)

                } else {

                    reject( Error(request.statusText) )
                }

            }

            request.onerror = () => {
                reject( Error('Network Error') )
            }

            request.send(null)

        }).then(data => {

            // 输出DOM
            data.forEach(
                item => bookmarks_dom.innerHTML += `<li><a title="${item.name}" href="${item.url}" target="_blank">${item.name}</a></li>`
            )

        })

    })()

    // 载入系统收藏夹并输出数据列表
    ;(() => {
        const bookmarks_dom = document.querySelector('#bookmarks ul')

        let bookmarks

        // https://developer.chrome.com/extensions/bookmarks 获取所有收藏夹数据
        chrome.bookmarks.getTree(root => {
            // console.log(root)

            const top_trees = root[0].children
            // console.table('top_trees: ', top_trees)

            // 轮流输出各顶级书签文件夹
            top_trees.forEach( tree => parse_list(tree) )
        })

        // 处理列表
        const parse_list = list => {
            console.log('parse_list: ', list)

            // 若为列表，添加标题
            bookmarks_dom.innerHTML += '<li>&nbsp;[子收藏夹] ' + list.title + '( ' + list.children.length + ' 项)' + '</li>'

            list.children.forEach(item => {
                if (item.children) {
                    // 若为列表，解析列表
                    if (item.children.length > 0) parse_list(item.children)

                } else {
                    // 若为单项，解析单项
                    parse_single(item)
                }
            })

        }

        // 处理单项
        const parse_single = item => bookmarks_dom.innerHTML += `<li><a title="${item.title}" href="${item.url}" data-id="${item.id}" target="_blank">${item.title} <small>ID ${item.id}</small></a></li>`

    })()
} // end window.load

})()
