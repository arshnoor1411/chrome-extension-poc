export default defineBackground(() => {
  console.log('Click Recorder extension installed');

  chrome.permissions.request({
    origins: [window.location.origin + "/"]
  }, (granted) => {
    if (granted) {
      console.log("Permission granted for", window.location.origin);
    } else {
      console.log("Permission denied for", window.location.origin);
    }
  })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "click") {
      chrome.storage.local.get(["clicks"], (result) => {
        console.log("Retrieved clicks:", result)
        const clicks = result.clicks || [];
        clicks.push(message.data);

        chrome.storage.local.set({ clicks }, () => {
          console.log("Clicks updated:", clicks);
        });
      });
    }
  });
});
