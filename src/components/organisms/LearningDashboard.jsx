import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Progress from "@/components/atoms/Progress";
import ProgressRing from "@/components/molecules/ProgressRing";
import { progressService } from "@/services/api/progressService";

const LearningDashboard = ({ 
  className, 
  enrolledCourses = [],
  recentActivity = [],
  ...props 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => 
    course.progress >= 100
  ).length;
  const overallProgress = totalCourses > 0 
    ? enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / totalCourses
    : 0;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const recs = await progressService.getRecommendations();
        setRecommendations(recs);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [enrolledCourses]);

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

      {/* Course Recommendations */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
        {loadingRecommendations ? (
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="w-80 flex-shrink-0">
                <Card className="p-4">
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2 shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 shimmer"></div>
                </Card>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4" style={{ width: `${recommendations.length * 320}px` }}>
              {recommendations.map((course) => (
                <div key={course.Id} className="w-80 flex-shrink-0">
                  <Card className="p-4 course-card">
                    <div className="relative mb-4">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-xs font-medium text-gray-700">{course.duration}h</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{course.instructor}</span>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Star" size={12} className="text-amber-500" />
                          <span className="text-xs">{course.difficulty}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button 
                          size="sm" 
                          className="w-full"
                          as={Link} 
                          to={`/course/${course.Id}`}
                        >
                          View Course
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <ApperIcon name="BookOpen" size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Complete some courses to get personalized recommendations!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LearningDashboard;