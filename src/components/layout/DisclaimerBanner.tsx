import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { MANDATORY_DISCLAIMER } from '../../lib/constants';

interface DisclaimerBannerProps {
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ className = '' }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      className={`disclaimer-banner bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs md:text-sm text-amber-900 transition-all ${className}`}
      role="region"
      aria-label="Medical disclaimer notice"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
          <p className="font-medium leading-tight">
            <span className="font-bold underline decoration-amber-400">Notice:</span> {MANDATORY_DISCLAIMER}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-md hover:bg-amber-100 text-amber-700 transition-colors shrink-0"
          aria-label="Dismiss disclaimer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

