export interface CompressResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

/**
 * Resizes and compresses an image in the browser using HTML5 Canvas.
 * Keeps the longest edge at max 1400px to ensure crisp OCR while keeping
 * payload size and AI token count well under limits.
 */
export async function compressImage(
  file: File | Blob,
  maxDimension = 1400,
  quality = 0.82
): Promise<CompressResult> {
  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width === 0 || height === 0) {
          return reject(new Error('Invalid image dimensions'));
        }

        // Calculate aspect-ratio scaling
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Unable to create canvas context'));
        }

        // Draw crisp background and image
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Approximate byte size of base64
        const head = 'data:image/jpeg;base64,';
        const base64Len = dataUrl.length - head.length;
        const compressedSize = Math.round((base64Len * 3) / 4);

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
          width,
          height,
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Formats bytes to human-readable string (e.g. 1.2 MB or 420 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

