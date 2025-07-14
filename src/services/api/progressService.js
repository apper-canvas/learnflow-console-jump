import progressData from "@/services/mockData/progress.json";
import coursesData from "@/services/mockData/courses.json";
import { noteService } from "@/services/api/noteService";

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

  async getRecommendations() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get user's completed courses
    const enrolledCourses = await this.getEnrolledCourses();
    const completedCourses = enrolledCourses.filter(course => course.progress >= 100);
    
    if (completedCourses.length === 0) {
      // If no completed courses, recommend beginner courses
      return this.courses
        .filter(course => course.difficulty === 'Beginner' && 
                !enrolledCourses.some(enrolled => enrolled.Id === course.Id))
        .slice(0, 6);
    }
    
    // Get categories and difficulties of completed courses
    const completedCategories = [...new Set(completedCourses.map(c => c.category))];
    const completedDifficulties = completedCourses.map(c => c.difficulty);
    const hasIntermediate = completedDifficulties.includes('Intermediate');
    const hasAdvanced = completedDifficulties.includes('Advanced');
    
    // Recommend courses based on completed categories and difficulty progression
    const recommendations = this.courses.filter(course => {
      // Exclude already enrolled courses
      if (enrolledCourses.some(enrolled => enrolled.Id === course.Id)) {
        return false;
      }
      
      // Recommend courses in same categories
      const sameCategory = completedCategories.includes(course.category);
      
      // Recommend next difficulty level
      const appropriateDifficulty = 
        (course.difficulty === 'Intermediate' && !hasIntermediate) ||
        (course.difficulty === 'Advanced' && hasIntermediate && !hasAdvanced) ||
        (course.difficulty === 'Beginner' && completedCourses.length < 2);
      
      return sameCategory || appropriateDifficulty;
    });
    
    return recommendations.slice(0, 6);
  }
}

export const progressService = new ProgressService();