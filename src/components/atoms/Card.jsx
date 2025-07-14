import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg border border-gray-100",
        "hover:shadow-xl transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;