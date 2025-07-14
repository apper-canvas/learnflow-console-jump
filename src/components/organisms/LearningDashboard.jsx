import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Progress from "@/components/atoms/Progress";
import ProgressRing from "@/components/molecules/ProgressRing";

const LearningDashboard = ({ 
  className, 
  enrolledCourses = [],
  recentActivity = [],
  ...props 
}) => {
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => 
    course.progress >= 100
  ).length;
  const overallProgress = totalCourses > 0 
    ? enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / totalCourses
    : 0;

  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">{totalCourses}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedCourses}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900">{Math.round(overallProgress)}%</p>
            </div>
            <ProgressRing progress={overallProgress} size={48} showText={false} />
          </div>
        </Card>
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrolledCourses.slice(0, 4).map((course) => (
            <Card key={course.Id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="PlayCircle" className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {course.instructor}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round(course.progress)}%
                      </span>
                    </div>
                    <Progress value={course.progress} size="sm" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                    </div>
                    <Button 
                      size="sm" 
                      as={Link} 
                      to={`/learn/${course.Id}`}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={activity.type === "lesson" ? "Play" : "Award"} className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LearningDashboard;