console.log('new_tab.js loaded')

;
(() => {

    window.onload = () => {
        // 载入本地JSON文件并输出数据列表
        ;
        (async () => {
            const bookmarks_dom = document.querySelector('#json ul')

            let bookmarks

            await new Promise((resolve, reject) => {
                const request = new XMLHttpRequest()

                request.open('get', '../new_tab.json', true)

                request.onload = () => {

                    if (request.status === 200) {
                        const result = JSON.parse(request.response)
                        // console.log('response', result)

                        bookmarks = result.content ? result.content : []

                        resolve(bookmarks)

                    } else {

                        reject(Error(request.statusText))
                    }

                }

                request.onerror = () => {
                    reject(Error('Network Error'))
                }

                request.send(null)

            }).then(data => {

                // 输出DOM
                data.forEach(
                    item => bookmarks_dom.innerHTML += `<li><a title="${item.name}" href="${item.url}" target="_blank"><img src="chrome://favicon/${item.url}" /> ${item.name}</a></li>`
                )

            })

        })() // end load JSON

        // 输出浏览器收藏夹
        ;
        (() => {
            const bookmarks_dom = document.querySelector('#bookmarks ul')

            // 获取所有收藏夹数据 https://developer.chrome.com/extensions/bookmarks
            chrome.bookmarks.getTree(root => {
                // console.log(root)

                // 开始迭代处理根节点
                root.shift().children.forEach((node, index) => parse_node(node, index))
            })

            // 解析节点
            const parse_node = (node, index) => {
                // console.log('parse_node: ', node)

                // 若为列表，添加标题
                bookmarks_dom.innerHTML += '<li style="margin-top:2rem;">&nbsp;[子收藏夹] ' + node.title + '( ' + node.children.length + ' 项)' + '</li>'

                // 迭代处理子节点
                node.children.forEach(node => {
                    if (node.children) {
                        // 若为列表，继续解析节点
                        if (node.children.length > 0) parse_node(node.children)

                    } else {
                        // 若为单项，解析单项
                        parse_single(node)
                    }
                })

            }

            // 处理单项
            const parse_single = item => bookmarks_dom.innerHTML += `<li><a title="${item.title} | ID ${item.id}" href="${item.url}" target="_blank"><img src="chrome://favicon/${item.url}" /> ${item.title}</a></li>`

        })() // end load bookmarks

        // 输出浏览历史
        ;
        (() => {
            const list_dom = document.querySelector('#history ul')

            // 删除某一URL的所有历史记录，并刷新页面
            const delete_item = url => {
                console.log('delete_item: ', url)
                chrome.history.deleteUrl({
                        url
                    },
                    () => location.reload()
                )
            }

            // 解析并输出DOM
            const parse_items = items => {
                // console.log('history items: ', items)

                items.forEach(
                    item => {
                        const dom_item = document.createElement('li')

                        // 链接
                        const dom_link = `<a title="${item.title} | ID ${item.id}" href="${item.url}" target="_blank"><img src="chrome://favicon/${item.url}" /> ${item.title}</a>`
                        dom_item.innerHTML = dom_link

                        // 删除按钮
                        const dom_delete = document.createElement('span')
                        dom_delete.innerHTML = '<i class="fal fa-trash"></i>'
                        dom_delete.addEventListener('click', () => {
                            if (confirm(`删除“${item.title}”的访问记录？`)) delete_item(item.url)
                        })
                        dom_item.append(dom_delete)

                        // 组装单项DOM，并输出到容器DOM顶部
                        list_dom.prepend(dom_item)
                    }
                )
            }

            // 获取浏览历史数据 https://developer.chrome.com/extensions/history#method-search
            chrome.history.search({
                    text: ''
                }, // grab all items
                parse_items
            )

            // 清空所有浏览记录
            document.querySelector('#clear_history').addEventListener('click', () => {
                if (confirm('清空所有浏览历史记录？')) chrome.history.deleteAll(() => location.reload())
            })

        })() // end load history
    } // end window.load

})()