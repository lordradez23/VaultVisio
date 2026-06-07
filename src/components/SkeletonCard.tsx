'use client';

import React from 'react';

interface SkeletonCardProps {
  variant?: 'metric' | 'row' | 'chart' | 'card';
  rows?: number;
}

export function SkeletonMetric() {
  return (
    <div className="glass-dark border border-white/5 rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-3 w-24 skeleton rounded" />
        <div className="h-5 w-12 skeleton rounded-md" />
      </div>
      <div className="h-8 w-32 skeleton rounded mb-2" />
      <div className="h-3 w-20 skeleton rounded" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full skeleton" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 skeleton rounded" />
          <div className="h-3 w-20 skeleton rounded" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-4 w-20 skeleton rounded" />
        <div className="h-3 w-14 skeleton rounded" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-dark border border-white/5 rounded-3xl p-8 h-[420px] flex flex-col animate-pulse">
      <div className="flex justify-between items-end mb-8">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-40 skeleton rounded" />
          <div className="h-4 w-28 skeleton rounded" />
        </div>
        <div className="flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-10 h-8 skeleton rounded-md" />
          ))}
        </div>
      </div>
      <div className="flex-1 skeleton rounded-2xl" />
    </div>
  );
}

export default function SkeletonCard({ variant = 'metric', rows = 3 }: SkeletonCardProps) {
  if (variant === 'metric') return <SkeletonMetric />;
  if (variant === 'chart') return <SkeletonChart />;
  if (variant === 'row') {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(rows)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }
  return <SkeletonMetric />;
}
