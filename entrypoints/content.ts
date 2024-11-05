export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log('Hello content.');
  },
});

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  console.log("Target:", target)

  if (target) {
    const clickData = {
      tag: target.tagName,
      id: target.id,
      classList: Array.from(target.classList),
      x: event.clientX,
      y: event.clientY,
      timestamp: new Date().toISOString()
    };

    chrome.runtime.sendMessage({ type: "click", data: clickData });
  }
})
