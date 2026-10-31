import React from 'react';
import { StatusLevel } from '../../features/analyzer/types';

interface RangeBarProps {
  value: string;
  normalRange: string;
  status: StatusLevel;
  unit: string;
}

export const RangeBar: React.FC<RangeBarProps> = ({
  value,
  normalRange,
  status,
  unit,
}) => {
  // Parse numeric values if available
  const cleanVal = parseFloat(value.replace(/[^0-9.]/g, ''));

  // Match range like "12.0 - 15.5" or "70-99" or "< 200" or "> 50"
  const rangeMatch = normalRange.match(/([0-9.]+)\s*[-–to]+\s*([0-9.]+)/i);
  const lessMatch = normalRange.match(/<\s*([0-9.]+)/);
  const greaterMatch = normalRange.match(/>\s*([0-9.]+)/);

  let minRange = 0;
  let maxRange = 100;
  let isNumeric = false;

  if (rangeMatch && !isNaN(parseFloat(rangeMatch[1])) && !isNaN(parseFloat(rangeMatch[2]))) {
    minRange = parseFloat(rangeMatch[1]);
    maxRange = parseFloat(rangeMatch[2]);
    isNumeric = true;
  } else if (lessMatch && !isNaN(parseFloat(lessMatch[1]))) {
    minRange = 0;
    maxRange = parseFloat(lessMatch[1]);
    isNumeric = true;
  } else if (greaterMatch && !isNaN(parseFloat(greaterMatch[1]))) {
    minRange = parseFloat(greaterMatch[1]);
    maxRange = minRange * 2;
    isNumeric = true;
  }

  // If we couldn't parse numeric boundaries or value is not a number, show textual comparison
  if (!isNumeric || isNaN(cleanVal)) {
    return (
      <div className="flex items-center gap-3 text-xs md:text-sm text-ink-muted bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
        <span className="font-medium text-ink">Reference:</span>
        <span>{normalRange || 'Not specified'}</span>
      </div>
    );
  }

  // Calculate visual scale with safety padding
  const span = maxRange - minRange || 1;
  const padding = span * 0.45;
  const visualMin = Math.max(0, minRange - padding);
  const visualMax = maxRange + padding;
  const totalVisualSpan = visualMax - visualMin;

  // Percentage positions
  const normalStartPct = Math.max(0, Math.min(100, ((minRange - visualMin) / totalVisualSpan) * 100));
  const normalEndPct = Math.max(0, Math.min(100, ((maxRange - visualMin) / totalVisualSpan) * 100));
  const valuePct = Math.max(4, Math.min(96, ((cleanVal - visualMin) / totalVisualSpan) * 100));

  const getPinColor = () => {
    switch (status) {
      case 'critical':
        return 'bg-red-600 ring-red-200 text-white';
      case 'high':
      case 'low':
        return 'bg-amber-600 ring-amber-200 text-white';
      case 'normal':
      default:
        return 'bg-green-600 ring-green-200 text-white';
    }
  };

  return (
    <div className="w-full my-3 pt-5 pb-1">
      {/* Range track */}
      <div className="relative h-3.5 bg-slate-200 rounded-full w-full overflow-hidden">
        {/* Normal target zone highlight */}
        <div
          className="absolute top-0 bottom-0 bg-green-500/30 border-x border-green-600/40"
          style={{
            left: `${normalStartPct}%`,
            width: `${normalEndPct - normalStartPct}%`,
          }}
          title={`Healthy range: ${minRange} - ${maxRange} ${unit}`}
        />
      </div>

      {/* Value Indicator Pointer */}
      <div className="relative w-full h-0">
        <div
          className="absolute -top-7 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
          style={{ left: `${valuePct}%` }}
        >
          <div
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-tight shadow-sm ring-2 ${getPinColor()}`}
          >
            {value} {unit}
          </div>
          <div
            className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700 mt-[-1px]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Range labels */}
      <div className="flex justify-between items-center text-[11px] text-ink-muted mt-2 font-mono">
        <span>Low</span>
        <span className="text-green-700 font-semibold font-sans">
          Normal: {minRange} – {maxRange} {unit}
        </span>
        <span>High</span>
      </div>
    </div>
  );
};

