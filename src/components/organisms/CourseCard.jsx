import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";

const CourseCard = ({ 
  className, 
  course,
  showProgress = false,
  progress = 0,
  ...props 
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "success";
      case "intermediate": return "warning";
      case "advanced": return "danger";
      default: return "default";
    }
  };

  return (
    <Card 
      className={cn(
        "course-card overflow-hidden group",
        className
      )}
      {...props}
    >
      <Link to={`/course/${course.Id}`}>
        <div className="aspect-video bg-gradient-to-br from-purple-500 to-purple-700 relative overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          <div className="absolute top-4 left-4">
            <Badge variant={getDifficultyColor(course.difficulty)}>
              {course.difficulty}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-2 text-sm">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>{course.duration}h</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
              {course.title}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">{course.instructor}</span>
            </div>
            <Badge variant="primary">{course.category}</Badge>
          </div>
          
          {showProgress && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} size="sm" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="BookOpen" className="w-4 h-4" />
                <span>{course.modules?.length || 0} modules</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Users" className="w-4 h-4" />
                <span>1.2k students</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CourseCard;