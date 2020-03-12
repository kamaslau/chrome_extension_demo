console.log('new_tab2.js loaded')

var app = new Vue({
    el: '#app',

    data: {
        current_tab: 'bookmark', // 当前焦点标签

        json: [],

        bookmarks: [],

        history: []
    },

    created() {
        this.parse_json()
        this.parse_bookmark()
        this.parse_history()
    },

    methods: {
        // 切换焦点标签
        switch_tab(tab) {
            this.current_tab = tab
        },

        // 解析本地JSON文件
        async parse_json() {
            // 载入本地文件
            await new Promise((resolve, reject) => {
                const request = new XMLHttpRequest()

                request.open('get', '../new_tab.json', true)

                request.onload = () => {

                    if (request.status === 200) {
                        const result = JSON.parse(request.response)
                        // console.log('response', result)

                        resolve(result.content ? result.content : [])

                    } else {

                        reject(Error(request.statusText))
                    }

                }

                request.onerror = () => {
                    reject(Error('Network Error'))
                }

                request.send(null)

            }).then(data => this.json = data) // 输出DOM
        },

        // 输出浏览器收藏夹
        parse_bookmark() {

        },

        // 输出浏览历史
        parse_history() {
            chrome.history.search({
                    text: '' // 获取所有数据
                },
                results => this.history = results
            )
        },

        // 生成链接title属性值
        compose_history_title(item) {
            let title = 'ID' + item.id + ' / 最近浏览' + item.visitCount + '次'
            title += ' / 上次访问于' + new Date(item.lastVisitTime).toLocaleString()
            return title
        },

        // 清除浏览历史
        clear_history(item, index = null) {
            console.log('clear_history: ', item, index)

            // 根据是否传入了index参数判断是清除全部还是单项
            if (index !== null) {
                if (confirm(`删除“${item.title}”的历史记录？`)) {
                    const url = item.url
                    chrome.history.deleteUrl({
                            url
                        },
                        () => this.history.splice(index, 1)
                    )

                }
            } else {
                if (confirm('清空所有浏览历史记录？')) chrome.history.deleteAll(() => {
                    this.history = []
                })
            }
        }
    }
})