import { useState, useCallback } from 'react';
import { compressImage, formatBytes, CompressResult } from '../../../lib/image';
import { convertPdfPageToImage } from '../../../lib/pdf';

export interface ProcessedImage {
  file: File;
  dataUrl: string;
  originalSizeFormatted: string;
  compressedSizeFormatted: string;
  width: number;
  height: number;
}

export function useImageCompress() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      let finalDataUrl = '';
      let width = 0;
      let height = 0;
      let compressedBytes = 0;

      // Handle PDF
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const pdfImageDataUrl = await convertPdfPageToImage(file);
        
        // Convert dataUrl to blob to pass into compressor for standardized sizing
        const res = await fetch(pdfImageDataUrl);
        const blob = await res.blob();
        const compressed = await compressImage(blob, 1400, 0.82);

        finalDataUrl = compressed.dataUrl;
        width = compressed.width;
        height = compressed.height;
        compressedBytes = compressed.compressedSize;
      } else {
        // Standard Image (JPEG, PNG, WebP)
        if (!file.type.startsWith('image/')) {
          throw new Error('Please upload an image (JPG, PNG, WebP) or single-page PDF.');
        }

        const compressed: CompressResult = await compressImage(file, 1400, 0.82);
        finalDataUrl = compressed.dataUrl;
        width = compressed.width;
        height = compressed.height;
        compressedBytes = compressed.compressedSize;
      }

      setProcessedImage({
        file,
        dataUrl: finalDataUrl,
        originalSizeFormatted: formatBytes(file.size),
        compressedSizeFormatted: formatBytes(compressedBytes),
        width,
        height,
      });
    } catch (err: unknown) {
      console.error('Image processing error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to process the document.';
      setError(msg);
      setProcessedImage(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setProcessedImage(null);
    setError(null);
  }, []);

  return {
    processFile,
    clearImage,
    processedImage,
    isProcessing,
    error,
  };
}

