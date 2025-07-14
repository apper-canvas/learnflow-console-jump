import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-4 py-3 border-2 border-gray-200 rounded-lg",
          "focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200",
          "placeholder:text-gray-400 text-gray-900",
          "disabled:bg-gray-50 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-200",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;