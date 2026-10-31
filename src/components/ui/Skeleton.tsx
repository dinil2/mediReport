import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  ...props
}) => {
  const base = 'animate-pulse bg-slate-200/80';
  const variants = {
    text: 'h-4 rounded-md w-full',
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} {...props} />;
};

