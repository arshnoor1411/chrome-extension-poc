import html2canvas from "html2canvas";

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    document.addEventListener('click', async (e) => {
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
          y: e.clientY,
          screenshot: 'null'
        };

        const autoDownload = (image: any) => {
          const downloadLink = document.createElement("a");
          const fileName = "screenshot.png";
      
          downloadLink.href = image;
          downloadLink.download = fileName;
          downloadLink.click();
        };

 
        console.log("document.body)-->",document.body)
        const canvas = await html2canvas(document.body);

        const cursorX = e.clientX;
        const cursorY = e.clientY;

        const ctx = canvas.getContext("2d");
        const cursorSize = 50;
        if(ctx){
        ctx.font = `${cursorSize}px Arial`
        ctx.fillStyle = "black"
        ctx.fillText("⌖", cursorX, cursorY);
        }
        
        console.log("Canvas-->",canvas)
        const screenshot = canvas.toDataURL("image/png"); 
        autoDownload(screenshot)
        clickData.screenshot = screenshot;

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


