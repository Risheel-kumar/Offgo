import React from 'react';
import { cn } from '../../../utils/cn';

export interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800/80',
            className || 'h-12 w-full'
          )}
        />
      ))}
    </>
  );
};
