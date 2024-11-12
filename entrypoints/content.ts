export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    document.addEventListener('click', (e) => {
      try {
        let target = e.target as HTMLElement
        console.log("Target:", target)
        console.log("window:", window.location)

        const clickData = {
          timestamp: new Date().toISOString(),
          elementTag: target.tagName,
          elementId: target.id,
          elementClass: target.className,
          url: window.location.href,
          x: e.clientX,
          y: e.clientY
        }

        console.log("Click detecyted:", clickData)
        console.log("DEETTEECCTTEEDD", clickData.elementClass)
        // console.log("Tag name:", document.getElementsByTagName(clickData.elementTag));

        const parent = target.parentElement;
        console.log("Parent--->", parent)
        if (parent) {
          console.log("Parent Tag:", parent.tagName);
          console.log("Parent Outer HTML:", parent.outerHTML);
          console.log("Parent Inner HTML:", parent.innerHTML);
        }

        chrome.runtime.sendMessage({
          type: 'CLICK_RECORDED',
          data: clickData
        })
      } catch (error) {
        console.log("ERROR", error)
        throw error
      }
    })
  }
})