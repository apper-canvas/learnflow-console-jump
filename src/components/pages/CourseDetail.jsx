import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import CourseSyllabus from "@/components/organisms/CourseSyllabus";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Progress from "@/components/atoms/Progress";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError("");
      const [courseData, progressData] = await Promise.all([
        courseService.getById(parseInt(courseId)),
        progressService.getProgress(parseInt(courseId))
      ]);
      setCourse(courseData);
      setProgress(progressData);
    } catch (err) {
      setError("Failed to load course details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleEnroll = () => {
    setShowEnrollForm(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    try {
      setSubmitting(true);
      await progressService.enroll(parseInt(courseId));
      toast.success("Successfully enrolled in course!");
      
      // Refresh progress data
      const progressData = await progressService.getProgress(parseInt(courseId));
      setProgress(progressData);
      
      // Reset form and close modal
      setFormData({ name: "", email: "", phone: "" });
      setShowEnrollForm(false);
    } catch (err) {
      toast.error("Failed to enroll in course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleCloseForm = () => {
    setShowEnrollForm(false);
    setFormData({ name: "", email: "", phone: "" });
    setFormErrors({});
  };

  const handleStartLearning = () => {
    navigate(`/learn/${courseId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "success";
      case "intermediate": return "warning";
      case "advanced": return "danger";
      default: return "default";
    }
  };

  const getTotalLessons = () => {
    return course?.modules?.reduce((total, module) => total + module.lessons.length, 0) || 0;
  };

  const getCompletedLessons = () => {
    return progress?.completedLessons?.length || 0;
  };

  const getProgressPercentage = () => {
    const total = getTotalLessons();
    const completed = getCompletedLessons();
    return total > 0 ? (completed / total) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="course-detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadCourseData} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message="Course not found" showRetry={false} />
      </div>
    );
  }

  const isEnrolled = progress?.enrolledAt;
  const progressPercentage = getProgressPercentage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 mb-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Badge variant="default" className="bg-white bg-opacity-20 text-white">
                {course.category}
              </Badge>
              <Badge variant={getDifficultyColor(course.difficulty)} className="bg-white bg-opacity-20 text-white">
                {course.difficulty}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-purple-100 mb-6">{course.description}</p>
            
            <div className="flex items-center space-x-6 text-purple-100 mb-8">
              <div className="flex items-center space-x-2">
                <ApperIcon name="User" className="w-5 h-5" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Clock" className="w-5 h-5" />
                <span>{course.duration} hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" className="w-5 h-5" />
                <span>{getTotalLessons()} lessons</span>
              </div>
            </div>
            
            {isEnrolled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-purple-100">Your Progress</span>
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="bg-white bg-opacity-20" />
                <Button 
                  onClick={handleStartLearning}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {progressPercentage > 0 ? "Continue Learning" : "Start Learning"}
                  <ApperIcon name="Play" className="w-5 h-5 ml-2" />
                </Button>
              </div>
            ) : (
<Button
              onClick={handleEnroll}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Enroll Now
              <ApperIcon name="Plus" className="w-5 h-5 ml-2" />
            </Button>
          )}
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-black bg-opacity-20 rounded-xl flex items-center justify-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <ApperIcon name="Play" className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Description */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
            <p className="text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </Card>

          {/* What You'll Learn */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Master the fundamentals and advanced concepts",
                "Build real-world projects from scratch",
                "Learn industry best practices and standards",
                "Develop problem-solving skills",
                "Get hands-on experience with tools",
                "Prepare for professional certification"
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Course Syllabus */}
          <CourseSyllabus 
            modules={course.modules} 
            completedLessons={progress?.completedLessons || []} 
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{course.duration} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lessons</span>
                <span className="font-medium">{getTotalLessons()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Modules</span>
                <span className="font-medium">{course.modules?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Difficulty</span>
                <Badge variant={getDifficultyColor(course.difficulty)}>
                  {course.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Students</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">4.8</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Instructor */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{course.instructor}</h4>
                <p className="text-sm text-gray-600">Senior Developer</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Experienced professional with 10+ years in the field. Passionate about teaching and sharing knowledge with students worldwide.
            </p>
          </Card>
        </div>
</div>

      {/* Enrollment Form Modal */}
      {showEnrollForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enroll in Course</h2>
              <p className="text-gray-600">
                Please provide your information to complete enrollment for "{course?.title}".
              </p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={cn(
                    "w-full",
                    formErrors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={cn(
                    "w-full",
                    formErrors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={cn(
                    "w-full",
                    formErrors.phone && "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? "Enrolling..." : "Complete Enrollment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;