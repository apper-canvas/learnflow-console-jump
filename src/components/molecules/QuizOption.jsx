import React from "react";
import { cn } from "@/utils/cn";

const QuizOption = ({ 
  className, 
  children, 
  selected, 
  correct, 
  incorrect,
  onClick,
  disabled,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 quiz-option",
        "hover:shadow-md disabled:cursor-not-allowed",
        selected && "selected",
        correct && "correct",
        incorrect && "incorrect",
        !selected && !correct && !incorrect && "border-gray-200 hover:border-purple-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default QuizOption;