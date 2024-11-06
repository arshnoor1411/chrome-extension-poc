export default defineBackground(() => {
  console.log('Click Recorder extension installed');

  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ clicks: [] })
  })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message---->", message)
    if (message.type === 'CLICK_RECORDED') {
      chrome.storage.local.get(['clicks'], (result) => {
        const clicks = result.clicks || []
        clicks.push(message.data)
        chrome.storage.local.set({ clicks })
      })
    }
  })
});
