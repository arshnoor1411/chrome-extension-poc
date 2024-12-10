export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    document.addEventListener('click', (e) => {
      try {
        console.log("GGG")
        const target = e.target as HTMLElement;
        console.log("Target:", target);
        console.log("window:", window.location);

        const clickData = {
          timestamp: new Date().toISOString(),
          elementTag: target.tagName,
          elementId: target.id || null,
          elementClass: target.className || null,
          url: window.location.href,
          x: e.clientX,
          y: e.clientY
        };

        console.log("Click detected:", clickData);

        const parent = target.parentElement;
        if (parent) {
          console.log("Parent Tag:", parent.tagName);
          console.log("Parent Outer HTML:", parent.outerHTML);
          console.log("Parent Inner HTML:", parent.innerHTML);
        }

        chrome.runtime.sendMessage(
          {
            type: 'CLICK_RECORDED',
            data: clickData,
            action: 'capture screenshot'
          },
          (response) => {
            if (response?.success) {
              console.log("Click data successfully saved.");
            } else {
              console.error("Error saving click data:", response?.error);
            }
          }
        );

      } catch (error) {
        console.error("Outer ERROR:", error);
        throw error;
      }
    });
  }
});
