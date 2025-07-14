import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";

const LearningView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [courseData, progressData] = await Promise.all([
        courseService.getById(parseInt(courseId)),
        progressService.getProgress(parseInt(courseId))
      ]);
      setCourse(courseData);
      setProgress(progressData);
      
      // Set first lesson as current if no progress
      if (courseData.modules && courseData.modules.length > 0) {
        const firstModule = courseData.modules[0];
        const firstLesson = firstModule.lessons[0];
        setCurrentModule(firstModule);
        setCurrentLesson(firstLesson);
      }
    } catch (err) {
      setError("Failed to load course data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (module, lesson) => {
    setCurrentModule(module);
    setCurrentLesson(lesson);
    setSidebarOpen(false);
  };

  const handleLessonComplete = async () => {
    if (!currentLesson || !progress) return;
    
    try {
      await progressService.completeLesson(parseInt(courseId), currentLesson.Id);
      toast.success("Lesson completed!");
      
      // Refresh progress
      const updatedProgress = await progressService.getProgress(parseInt(courseId));
      setProgress(updatedProgress);
      
      // Move to next lesson
      const nextLesson = getNextLesson();
      if (nextLesson) {
        setCurrentLesson(nextLesson.lesson);
        setCurrentModule(nextLesson.module);
      }
    } catch (err) {
      toast.error("Failed to mark lesson as complete.");
    }
  };

  const getNextLesson = () => {
    if (!course || !currentLesson) return null;
    
    const allLessons = [];
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        allLessons.push({ module, lesson });
      });
    });
    
    const currentIndex = allLessons.findIndex(
      item => item.lesson.Id === currentLesson.Id
    );
    
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    
    return null;
  };

  const getPreviousLesson = () => {
    if (!course || !currentLesson) return null;
    
    const allLessons = [];
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        allLessons.push({ module, lesson });
      });
    });
    
    const currentIndex = allLessons.findIndex(
      item => item.lesson.Id === currentLesson.Id
    );
    
    if (currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }
    
    return null;
  };

  const handleTakeQuiz = () => {
    // Navigate to quiz for current lesson
    navigate(`/learn/${courseId}/quiz/1`);
  };

  const isLessonCompleted = (lessonId) => {
    return progress?.completedLessons?.includes(lessonId) || false;
  };

  const getProgressPercentage = () => {
    if (!course || !progress) return 0;
    const totalLessons = course.modules.reduce((total, module) => 
      total + module.lessons.length, 0
    );
    const completedLessons = progress.completedLessons?.length || 0;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message="Course or lesson not found" showRetry={false} />
      </div>
    );
  }

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/course/${courseId}`)}
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-600">{currentLesson.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Progress:</span>
                <span className="font-medium">{Math.round(getProgressPercentage())}%</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <ApperIcon name="Menu" className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2">
          <Progress value={getProgressPercentage()} size="sm" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 bg-black">
            <VideoPlayer
              src={currentLesson.videoUrl}
              title={currentLesson.title}
              className="w-full h-full"
              onComplete={handleLessonComplete}
            />
          </div>
          
          {/* Lesson Controls */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previousLesson && handleLessonSelect(previousLesson.module, previousLesson.lesson)}
                  disabled={!previousLesson}
                >
                  <ApperIcon name="ChevronLeft" className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <div className="text-sm text-gray-600">
                  {currentModule?.title} • {currentLesson.title}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {currentLesson.type === "video" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleTakeQuiz}
                  >
                    <ApperIcon name="HelpCircle" className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLessonComplete()}
                  disabled={isLessonCompleted(currentLesson.Id)}
                >
                  <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
                  {isLessonCompleted(currentLesson.Id) ? "Completed" : "Mark Complete"}
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => nextLesson && handleLessonSelect(nextLesson.module, nextLesson.lesson)}
                  disabled={!nextLesson}
                >
                  Next
                  <ApperIcon name="ChevronRight" className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={cn(
          "w-80 bg-white border-l border-gray-200 flex flex-col",
          "md:block",
          sidebarOpen ? "block" : "hidden"
        )}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {course.modules.map((module) => (
                <div key={module.Id} className="space-y-2">
                  <h3 className="font-medium text-gray-900">{module.title}</h3>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.Id}
                        onClick={() => handleLessonSelect(module, lesson)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200",
                          lesson.Id === currentLesson.Id && "bg-purple-50 border-purple-200"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              isLessonCompleted(lesson.Id) 
                                ? "bg-emerald-500" 
                                : lesson.Id === currentLesson.Id
                                ? "bg-purple-500"
                                : "bg-gray-300"
                            )} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {lesson.title}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <ApperIcon name="Clock" className="w-3 h-3" />
                                <span>{lesson.duration} min</span>
                                <Badge variant="default" className="text-xs">
                                  {lesson.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {isLessonCompleted(lesson.Id) && (
                            <ApperIcon name="CheckCircle" className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningView;