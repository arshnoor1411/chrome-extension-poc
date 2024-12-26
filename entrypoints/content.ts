import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import html2canvas from "html2canvas";

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    document.addEventListener('click', async (e) => {
      e.preventDefault(); 
      try {
        console.log("GGG")
        const target = e.target as HTMLElement;
        console.log("Target:", target.tagName);
        console.log("window:", window.location);

        const roomId = "1234"

        // const taskId = Math.floor(1000 + Math.random() * 9000);
        // console.log(taskId);

        const taskId = "8663"

    
        const href = (target as HTMLAnchorElement).href
        console.log("Captured link:", window.location.href);

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

        // const autoDownload = (image: any) => {
        //   const downloadLink = document.createElement("a");
        //   const fileName = "screenshot.png";
      
        //   downloadLink.href = image;
        //   downloadLink.download = fileName;
        //   downloadLink.click();
        // };

 
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
        // autoDownload(screenshot)
        clickData.screenshot = screenshot;

        console.log("Click detected:", clickData);

        const bucketName = import.meta.env.VITE_AWS_S3_BUCKET;
        console.log("bucketName-->",bucketName)
        console.log("Access key",import.meta.env.VITE_AWS_ACCESS_KEY_ID)
        console.log("secret key",import.meta.env.VITE_AWS_SECRET_ACCESS_KEY)

        const clientConfig: S3ClientConfig = {
          region: import.meta.env.VITE_AWS_REGION,
          credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID ?? '',
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ?? '',
            sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN ?? '',
          },
        };
        
        const s3Client = new S3Client(clientConfig);

        const fileName = `public/screenshots/${roomId}/${taskId}/${Date.now()}_${target.tagName}.png`;

        const base64Data = screenshot.replace(/^data:image\/png;base64,/, "");
        const blob = new Blob([Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))], { type: "image/png" });

        const uploadParams = {
          Bucket: bucketName,
          Key: fileName,
          Body: blob,
          ContentType: "image/png",
          Metadata: {
            timestamp: clickData.timestamp,
            elementTag: clickData.elementTag,
            elementId: clickData.elementId || "null",
            elementClass: clickData.elementClass || "null",
            url: clickData.url,
          },
        };

        const command = new PutObjectCommand(uploadParams);

        try {
          const response = await s3Client.send(command);
          console.log("Screenshot uploaded successfully:", response);
        } catch (uploadError) {
          console.error("Error uploading screenshot to S3:", uploadError);
        }

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

      // setTimeout(() => {
      //   window.location.href = href;
      // }, 5000); 
    }
       catch (error) {
        console.error("Outer ERROR:", error);
        throw error;
      }
    });
  }
});


