import * as pdfjsLib from 'pdfjs-dist';

// Configure pdf.js worker using Vite asset URL
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Converts the first page of a PDF file to a JPEG DataURL
 */
export async function convertPdfPageToImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  if (pdfDoc.numPages < 1) {
    throw new Error('The PDF document contains no pages');
  }

  // Render Page 1
  const page = await pdfDoc.getPage(1);
  const unscaledViewport = page.getViewport({ scale: 1.0 });

  // Scale viewport to high quality suitable for OCR (approx ~1600px width)
  const targetWidth = 1500;
  const scale = targetWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const canvasContext = canvas.getContext('2d');
  if (!canvasContext) {
    throw new Error('Failed to create 2D canvas context for PDF rendering');
  }

  // Clean white background
  canvasContext.fillStyle = '#FFFFFF';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext,
    viewport,
  };

  await page.render(renderContext).promise;

  return canvas.toDataURL('image/jpeg', 0.85);
}

