import React from "react";

export function Card({
  children,
  className = "",
  padding = "p-6",
  shadow = true,
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 ${padding} ${
        shadow ? "shadow-sm hover:shadow-md" : ""
      } transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-slate-600 mt-1 ${className}`}>{children}</p>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-100 ${className}`}>
      {children}
    </div>
  );
}
