console.log('new_tab.js loaded')

const bookmarks_dom = document.querySelector('#bookmarks ul')
console.table(bookmarks_dom)

let bookmarks
let bookmarks_json
try {
    bookmarks_json = {
        "content": [
            {
                "name": "Nuxt.js",
                "url": "https://nuxtjs.org/"
            },

            {
                "name": "Vue.js",
                "url": "https://vuejs.org/"
            },

            {
                "name": "Node.js",
                "url": "https://nodejs.org/en/"
            },

            {
                "name": "CodeIgniter",
                "url": "https://codeigniter.com/"
            },

            {
                "name": "Udemy",
                "url": "https://www.udemy.com/"
            },

            {
                "name": "知乎",
                "url": "https://www.zhihu.com/"
            },

            {
                "name": "Kamas Lau",
                "url": "https://www.liuyajie.com/"
            }
        ]
    }

} catch (error) {
    console.error(error)

} finally {
    console.log('bookmarks_json: ', bookmarks_json)

    bookmarks = bookmarks_json.content
    console.log('bookmarks: ', bookmarks)

}

// 输出DOM
bookmarks.forEach(
    item => bookmarks_dom.innerHTML += `<li><a title="${item.name}" href="${item.url}" target="_blank">${item.name}</a></li>`
)
