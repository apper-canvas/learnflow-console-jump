import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";

const Loading = ({ className, type = "courses", ...props }) => {
  if (type === "courses") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)} {...props}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 shimmer" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded shimmer" />
              <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
              <div className="h-4 bg-gray-200 rounded w-1/2 shimmer" />
              <div className="flex items-center justify-between mt-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 shimmer" />
                <div className="h-6 bg-gray-200 rounded w-16 shimmer" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (type === "course-detail") {
    return (
      <div className={cn("space-y-8", className)} {...props}>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 rounded-xl">
          <div className="space-y-4">
            <div className="h-8 bg-white bg-opacity-20 rounded shimmer" />
            <div className="h-4 bg-white bg-opacity-20 rounded w-3/4 shimmer" />
            <div className="h-4 bg-white bg-opacity-20 rounded w-1/2 shimmer" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 shimmer" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer" />
                <div className="h-4 bg-gray-200 rounded w-5/6 shimmer" />
                <div className="h-4 bg-gray-200 rounded w-4/6 shimmer" />
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 shimmer" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded shimmer" />
                <div className="h-4 bg-gray-200 rounded shimmer" />
                <div className="h-4 bg-gray-200 rounded shimmer" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className={cn("space-y-8", className)} {...props}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 shimmer" />
                  <div className="h-8 bg-gray-200 rounded w-12 shimmer" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer" />
              </div>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded shimmer" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
                  <div className="h-2 bg-gray-200 rounded shimmer" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse", className)} {...props}>
      <div className="h-64 bg-gray-200 rounded-lg shimmer" />
    </div>
  );
};

export default Loading;