import progressData from "@/services/mockData/progress.json";
import coursesData from "@/services/mockData/courses.json";

class ProgressService {
  constructor() {
    this.progress = [...progressData];
    this.courses = [...coursesData];
  }

  async getProgress(courseId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const userProgress = this.progress.find(p => p.courseId === courseId);
    return userProgress ? { ...userProgress } : null;
  }

  async enroll(courseId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const existingProgress = this.progress.find(p => p.courseId === courseId);
    if (existingProgress) {
      return { ...existingProgress };
    }
    
    const newProgress = {
      Id: Math.max(...this.progress.map(p => p.Id), 0) + 1,
      courseId,
      completedLessons: [],
      quizScores: {},
      lastAccessed: new Date().toISOString(),
      enrolledAt: new Date().toISOString()
    };
    
    this.progress.push(newProgress);
    return { ...newProgress };
  }

  async completeLesson(courseId, lessonId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const userProgress = this.progress.find(p => p.courseId === courseId);
    if (!userProgress) {
      throw new Error("Not enrolled in course");
    }
    
    if (!userProgress.completedLessons.includes(lessonId)) {
      userProgress.completedLessons.push(lessonId);
    }
    userProgress.lastAccessed = new Date().toISOString();
    
    return { ...userProgress };
  }

  async saveQuizResult(courseId, quizId, result) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const userProgress = this.progress.find(p => p.courseId === courseId);
    if (!userProgress) {
      throw new Error("Not enrolled in course");
    }
    
    userProgress.quizScores[quizId] = result;
    userProgress.lastAccessed = new Date().toISOString();
    
    return { ...userProgress };
  }

  async getEnrolledCourses() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const enrolledCourses = this.progress.map(p => {
      const course = this.courses.find(c => c.Id === p.courseId);
      if (!course) return null;
      
      const totalLessons = course.modules.reduce((total, module) => 
        total + module.lessons.length, 0
      );
      const completedLessons = p.completedLessons.length;
      const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      
      return {
        ...course,
        progress,
        lastAccessed: p.lastAccessed,
        enrolledAt: p.enrolledAt
      };
    }).filter(Boolean);
    
    return enrolledCourses;
  }

  async getRecentActivity() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const activities = [
      {
        type: "lesson",
        description: "Completed lesson: Introduction to React",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        type: "quiz",
        description: "Passed quiz: JavaScript Fundamentals",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        type: "lesson",
        description: "Completed lesson: CSS Grid Layout",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        type: "lesson",
        description: "Completed lesson: API Integration",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return activities;
  }
}

export const progressService = new ProgressService();