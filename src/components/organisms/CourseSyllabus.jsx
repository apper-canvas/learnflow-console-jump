import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const CourseSyllabus = ({ 
  className, 
  modules = [],
  completedLessons = [],
  ...props 
}) => {
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  const getModuleProgress = (module) => {
    const completed = module.lessons.filter(lesson => 
      isLessonCompleted(lesson.Id)
    ).length;
    return (completed / module.lessons.length) * 100;
  };

  return (
    <Card className={cn("p-6", className)} {...props}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Course Syllabus</h3>
      
      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.Id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleModule(module.Id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <ApperIcon 
                  name={expandedModules[module.Id] ? "ChevronDown" : "ChevronRight"} 
                  className="w-5 h-5 text-gray-500" 
                />
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">{module.title}</h4>
                  <p className="text-sm text-gray-500">
                    {module.lessons.length} lessons
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${getModuleProgress(module)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {Math.round(getModuleProgress(module))}%
                </span>
              </div>
            </button>
            
            {expandedModules[module.Id] && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="py-2">
                  {module.lessons.map((lesson) => (
                    <div 
                      key={lesson.Id}
                      className="flex items-center justify-between px-6 py-3 hover:bg-white transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          isLessonCompleted(lesson.Id) 
                            ? "bg-emerald-500" 
                            : "bg-gray-300"
                        )} />
                        <div>
                          <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Clock" className="w-3 h-3" />
                              <span>{lesson.duration} min</span>
                            </div>
                            <Badge variant="default" className="text-xs">
                              {lesson.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {isLessonCompleted(lesson.Id) && (
                        <ApperIcon name="CheckCircle" className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CourseSyllabus;