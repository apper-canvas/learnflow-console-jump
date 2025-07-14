import coursesData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.courses];
  }

  async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = this.courses.find(c => c.Id === id);
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  }

  async create(courseData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const newCourse = {
      ...courseData,
      Id: Math.max(...this.courses.map(c => c.Id), 0) + 1
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.courses.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    this.courses[index] = { ...this.courses[index], ...updateData };
    return { ...this.courses[index] };
  }

  async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.courses.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    this.courses.splice(index, 1);
    return { success: true };
  }
}

export const courseService = new CourseService();