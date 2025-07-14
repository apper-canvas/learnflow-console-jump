import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  className, 
  icon = "BookOpen",
  title = "No content available",
  description = "There's nothing to show here yet.",
  action,
  actionLabel = "Get Started",
  ...props 
}) => {
  return (
    <Card className={cn("p-12 text-center", className)} {...props}>
      <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-purple-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <Button onClick={action} variant="primary">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;