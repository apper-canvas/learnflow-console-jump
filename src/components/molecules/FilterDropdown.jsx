import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FilterDropdown = ({ 
  className, 
  title, 
  options = [], 
  value, 
  onChange,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span>{value || title}</span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </Button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 transition-colors duration-200"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;