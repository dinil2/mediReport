import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  headerClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-border rounded-2xl bg-surface overflow-hidden transition-all duration-200 ${className}`}>
      <button
        type="button"
        className={`w-full flex items-center justify-between text-left p-4 md:p-5 focus-visible:outline-2 focus-visible:outline-primary transition-colors ${
          isOpen ? 'bg-slate-50/70 border-b border-border' : 'hover:bg-slate-50/50'
        } ${headerClassName}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-heading font-semibold text-ink text-base md:text-lg pr-4">
          {title}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-ink-muted shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="p-4 md:p-6 text-ink-muted text-sm md:text-base leading-relaxed bg-surface">
          {children}
        </div>
      )}
    </div>
  );
};

