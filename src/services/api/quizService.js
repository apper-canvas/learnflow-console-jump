import quizzesData from "@/services/mockData/quizzes.json";

class QuizService {
  constructor() {
    this.quizzes = [...quizzesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.quizzes];
  }

  async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const quiz = this.quizzes.find(q => q.Id === id);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    return { ...quiz };
  }

  async getByLessonId(lessonId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const quiz = this.quizzes.find(q => q.lessonId === lessonId);
    return quiz ? { ...quiz } : null;
  }

  async create(quizData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const newQuiz = {
      ...quizData,
      Id: Math.max(...this.quizzes.map(q => q.Id), 0) + 1
    };
    this.quizzes.push(newQuiz);
    return { ...newQuiz };
  }

  async update(id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.quizzes.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error("Quiz not found");
    }
    this.quizzes[index] = { ...this.quizzes[index], ...updateData };
    return { ...this.quizzes[index] };
  }

  async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.quizzes.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error("Quiz not found");
    }
    this.quizzes.splice(index, 1);
    return { success: true };
  }
}

export const quizService = new QuizService();