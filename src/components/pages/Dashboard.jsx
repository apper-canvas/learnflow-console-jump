import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import LearningDashboard from "@/components/organisms/LearningDashboard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { progressService } from "@/services/api/progressService";

const Dashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, activityData] = await Promise.all([
        progressService.getEnrolledCourses(),
        progressService.getRecentActivity()
      ]);
      setEnrolledCourses(coursesData);
      setRecentActivity(activityData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="dashboard" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Dashboard</h1>
          <p className="text-gray-600">Track your progress and continue your learning journey</p>
        </div>
        
        <Empty
          icon="BookOpen"
          title="No enrolled courses yet"
          description="Start your learning journey by enrolling in a course. Browse our catalog to find courses that interest you."
          action={() => window.location.href = "/"}
          actionLabel="Browse Courses"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Dashboard</h1>
        <p className="text-gray-600">Track your progress and continue your learning journey</p>
      </div>
      
      <LearningDashboard
        enrolledCourses={enrolledCourses}
        recentActivity={recentActivity}
      />
    </div>
  );
};

export default Dashboard;