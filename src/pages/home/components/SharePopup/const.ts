export const generateShareImageBase64 = (
  bgSrc: string,
  qrcodeSrc: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context not supported"));
      return;
    }

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = bgSrc;

    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // Draw background
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      qrImg.src = qrcodeSrc;

      qrImg.onload = () => {
        // Calculate scale ratio based on 320px width (since less uses 320px as max width)
        const scale = canvas.width / 320;
        
        // Positioning based on index.less
        // .qrcode-img { left: 27px; bottom: 33px; width: 73px; }
        const qrWidth = 73 * scale;
        const qrHeight = qrWidth; // Assuming square QR code
        
        const qrLeft = 27 * scale;
        const qrTop = canvas.height - (26 * scale) - qrHeight;

        // Draw QR code
        ctx.drawImage(qrImg, qrLeft, qrTop, qrWidth, qrHeight);

        // Export to Base64 (remove the data:image/png;base64, prefix if needed by bridge, but usually bridge handles it or expects it)
        const base64 = canvas.toDataURL("image/png");
        resolve(base64);
      };

      qrImg.onerror = (err) => {
        reject(err);
      };
    };

    bgImg.onerror = (err) => {
      reject(err);
    };
  });
};
