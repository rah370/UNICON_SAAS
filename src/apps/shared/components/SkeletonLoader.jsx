import React from "react";

export function SkeletonLoader({ className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    </div>
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-6 animate-pulse ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function SkeletonCalendar({ className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-6 animate-pulse ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-slate-200 rounded w-32"></div>
        <div className="h-8 bg-slate-200 rounded w-24"></div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded"></div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonListItem({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 p-4 animate-pulse ${className}`}>
      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-16"></div>
    </div>
  );
}
