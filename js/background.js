console.log('background.js loaded')

chrome.runtime.onInstalled.addListener(() => {
    console.log('installed')
})

chrome.bookmarks.onCreated.addListener(() => {
    alert('bookmark saved')
})
