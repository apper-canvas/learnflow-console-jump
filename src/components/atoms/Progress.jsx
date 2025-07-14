import React from "react";
import { cn } from "@/utils/cn";

const Progress = ({ 
  className, 
  value = 0, 
  max = 100, 
  size = "md",
  variant = "primary",
  showText = false,
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-purple-600",
    secondary: "bg-gradient-to-r from-amber-500 to-amber-600",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    danger: "bg-gradient-to-r from-red-500 to-red-600"
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizes[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="mt-1 text-xs text-gray-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default Progress;