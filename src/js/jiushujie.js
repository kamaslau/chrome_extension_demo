console.log('jiushujie.js loaded')

/**
 * 在旧书街的售卖详情页，根据书籍的ISBN号（即13位条形码）添加指向搜索对应当当自营书籍的链接
 *
 * 售卖详情页链接示例
 * https://www.jiushujie.com/sell/338488730
 *
 * 当当书籍搜索页链接示例
 * http://search.dangdang.com/?key=9787550101814&ddsale=1
 */

// 状态标识符
const status_flag = document.createElement('p')
status_flag.id = 'extension_flag'
status_flag.innerText = '插件运行中'

// 条形码
let barcode

window.onload = () => {
  const details = document.querySelector('#main_content .book_item .detail')
  details.prepend(status_flag)

  barcode = getBarcode(details) // 解析二维码
  // append_css('https://cdn.liuyajie.com/bootstrap/4.4.1/bootstrap.min.css') // 添加CSS，已测试通过，为减少CDN成本改为直接向链接DOM添加样式的方式↓
  append_link(barcode, details) // 添加链接
}

// 从页面DOM中解析条形码
const getBarcode = dom => {
  let value

  // 在书籍详情DOM中，查找格式为13位数字的数据项
  const isbn_pattern = /\d{13}/
  const isbn_match = dom.innerText.match(isbn_pattern)
  if (isbn_match) {value = isbn_match[0]}

  return value
}

// 添加CSS到页面
const append_css = href => {
  // 外链样式CSS文件
  const head_dom = document.querySelector('head')

  // 生成样式标签
  const tag = document.createElement('link')
  tag.rel = 'stylesheet'
  tag.type = 'text/css'
  tag.href = href

  head_dom.appendChild(tag)
}

// 添加链接DOM到页面
const append_link = (barcode, dom) => {
  // 链接DOM，将页面解析出的条形码拼合到href属性
  const link_dom = document.createElement('a')
  link_dom.target = '_blank'
  link_dom.innerText = '搜当当自营'
  link_dom.href = 'http://search.dangdang.com/?ddsale=1&key=' + barcode

  // link_dom.className = 'btn btn-primary' // 为减少CDN费用开销，改用DOM属性来声明样式
  link_dom.style.color = '#fff'
  link_dom.style.backgroundColor = '#007bff'
  link_dom.style.textAlign = 'center'
  link_dom.style.fontFamily = '-apple-system,sans-serif'
  link_dom.style.fontSize = '1.5rem'
  link_dom.style.lineHeight = 1.5
  link_dom.style.display = 'block'
  link_dom.style.margin = '.75rem 0'
  link_dom.style.borderRadius = '.5rem'
  link_dom.style.padding = '.75rem 1.5rem'

  dom.prepend(link_dom)
}

// end jiushujie.js
