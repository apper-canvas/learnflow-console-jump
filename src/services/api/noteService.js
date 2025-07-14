const mockNotes = [
  {
    Id: 1,
    courseId: 1,
    lessonId: 1,
    timestamp: 125.5,
    content: "Key concept: React components are reusable building blocks",
    title: "React Components",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    Id: 2,
    courseId: 1,
    lessonId: 1,
    timestamp: 245.2,
    content: "Remember: Always use useState for component state management",
    title: "State Management",
    createdAt: "2024-01-15T10:35:00Z",
    updatedAt: "2024-01-15T10:35:00Z"
  },
  {
    Id: 3,
    courseId: 1,
    lessonId: 2,
    timestamp: 89.7,
    content: "Important: useEffect runs after every render by default",
    title: "useEffect Hook",
    createdAt: "2024-01-15T11:15:00Z",
    updatedAt: "2024-01-15T11:15:00Z"
  }
];

class NoteService {
  constructor() {
    this.notes = [...mockNotes];
    this.nextId = Math.max(...this.notes.map(n => n.Id), 0) + 1;
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.notes];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const note = this.notes.find(n => n.Id === parseInt(id));
    return note ? { ...note } : null;
  }

  async getNotesByLesson(courseId, lessonId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.notes
      .filter(n => n.courseId === parseInt(courseId) && n.lessonId === parseInt(lessonId))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(n => ({ ...n }));
  }

  async create(noteData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newNote = {
      Id: this.nextId++,
      courseId: parseInt(noteData.courseId),
      lessonId: parseInt(noteData.lessonId),
      timestamp: parseFloat(noteData.timestamp),
      content: noteData.content || "",
      title: noteData.title || "Untitled Note",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.notes.push(newNote);
    return { ...newNote };
  }

  async update(id, noteData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const noteIndex = this.notes.findIndex(n => n.Id === parseInt(id));
    if (noteIndex === -1) {
      throw new Error("Note not found");
    }

    const updatedNote = {
      ...this.notes[noteIndex],
      ...noteData,
      Id: parseInt(id), // Preserve ID
      updatedAt: new Date().toISOString()
    };

    this.notes[noteIndex] = updatedNote;
    return { ...updatedNote };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const noteIndex = this.notes.findIndex(n => n.Id === parseInt(id));
    if (noteIndex === -1) {
      throw new Error("Note not found");
    }

    const deletedNote = this.notes[noteIndex];
    this.notes.splice(noteIndex, 1);
    return { ...deletedNote };
  }

  formatTimestamp(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

export const noteService = new NoteService();