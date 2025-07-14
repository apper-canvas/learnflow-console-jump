import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import CourseCard from "@/components/organisms/CourseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  const categories = ["All Categories", "Programming", "Design", "Business", "Data Science", "Marketing"];
  const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];
  const durations = ["All Durations", "0-2 hours", "2-5 hours", "5-10 hours", "10+ hours"];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
                           selectedCategory === "All Categories" || 
                           course.category === selectedCategory;
    
    const matchesDifficulty = !selectedDifficulty || 
                             selectedDifficulty === "All Levels" || 
                             course.difficulty === selectedDifficulty;
    
    const matchesDuration = !selectedDuration || 
                           selectedDuration === "All Durations" || 
                           checkDurationMatch(course.duration, selectedDuration);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
  });

  const checkDurationMatch = (duration, filter) => {
    const hours = parseInt(duration);
    switch (filter) {
      case "0-2 hours": return hours <= 2;
      case "2-5 hours": return hours > 2 && hours <= 5;
      case "5-10 hours": return hours > 5 && hours <= 10;
      case "10+ hours": return hours > 10;
      default: return true;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDifficulty("");
    setSelectedDuration("");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="courses" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadCourses} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 mb-12 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Expand Your Knowledge with Expert-Led Courses
          </h1>
          <p className="text-xl text-purple-100 mb-6">
            Learn at your own pace with our comprehensive collection of video courses and interactive quizzes.
          </p>
          <div className="flex items-center space-x-6 text-purple-100">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" className="w-5 h-5" />
              <span>10,000+ students</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="BookOpen" className="w-5 h-5" />
              <span>{courses.length} courses</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Star" className="w-5 h-5" />
              <span>4.8 average rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search courses, instructors, or topics..."
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex gap-4">
            <FilterDropdown
              title="Category"
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <FilterDropdown
              title="Difficulty"
              options={difficulties}
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
            />
            <FilterDropdown
              title="Duration"
              options={durations}
              value={selectedDuration}
              onChange={setSelectedDuration}
            />
          </div>
        </div>
        
        {/* Active Filters */}
        {(searchTerm || selectedCategory || selectedDifficulty || selectedDuration) && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-600">Active filters:</span>
            <div className="flex items-center gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Search: {searchTerm}
                </span>
              )}
              {selectedCategory && selectedCategory !== "All Categories" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {selectedCategory}
                </span>
              )}
              {selectedDifficulty && selectedDifficulty !== "All Levels" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {selectedDifficulty}
                </span>
              )}
              {selectedDuration && selectedDuration !== "All Durations" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {selectedDuration}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-purple-600 hover:text-purple-800"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {filteredCourses.length > 0 ? "Available Courses" : "No courses found"}
        </h2>
        <p className="text-gray-600">
          {filteredCourses.length > 0 
            ? `Showing ${filteredCourses.length} of ${courses.length} courses`
            : "Try adjusting your search or filters"
          }
        </p>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.Id} course={course} />
          ))}
        </div>
      ) : (
        <Empty
          icon="Search"
          title="No courses found"
          description="We couldn't find any courses matching your criteria. Try adjusting your search or filters."
          action={clearFilters}
          actionLabel="Clear Filters"
        />
      )}
    </div>
  );
};

export default CourseCatalog;