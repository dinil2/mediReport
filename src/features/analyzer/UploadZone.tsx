import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, FileText, ShieldCheck, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  isProcessing = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="upload-zone-container w-full">
      {/* Hidden file input for standard files & PDFs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isProcessing}
      />

      {/* Hidden file input dedicated for mobile camera capture */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isProcessing}
      />

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
        className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 group focus-visible:outline-2 focus-visible:outline-primary ${
          isDragOver
            ? 'border-primary bg-primary-light/40 scale-[1.01]'
            : 'border-slate-300 hover:border-primary/60 bg-surface hover:bg-slate-50/50 shadow-soft'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          {/* Main Upload Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform shadow-soft-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="font-heading font-bold text-xl md:text-2xl text-ink mb-2">
            Upload your blood test report
          </h3>
          <p className="text-ink-muted text-sm md:text-base mb-6">
            Drag and drop your report photo or PDF here, or click to browse files from your device.
          </p>

          {/* Quick Buttons for Mobile & Desktop */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full mb-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-hover shadow-soft transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Choose Photo or PDF</span>
            </button>

            {/* Direct Camera Capture (especially intuitive on smartphone) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-surface border border-border text-ink hover:bg-slate-100 hover:border-primary/40 shadow-soft-sm transition-all"
            >
              <Camera className="w-4 h-4 text-primary" />
              <span>Take Photo</span>
            </button>
          </div>

          {/* Format Badges & Constraints */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-ink-muted mb-4">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium">JPG</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium">PNG</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium">WebP</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium">PDF (Page 1)</span>
          </div>

          {/* Clarity Tip & Privacy Assurance */}
          <div className="w-full pt-4 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
            <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Tip: Ensure all text & numbers are sharp and not blurry.</span>
            </div>

            <div className="flex items-center gap-1.5 text-primary font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Your report is not stored</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

