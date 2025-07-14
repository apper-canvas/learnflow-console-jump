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
import { noteService } from "@/services/api/noteService";

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
  const [activeTab, setActiveTab] = useState("content");
  const [notes, setNotes] = useState([]);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState(null);
useEffect(() => {
    loadData();
  }, [courseId]);

  useEffect(() => {
    if (currentLesson) {
      loadNotes();
    }
  }, [currentLesson]);

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

  const loadNotes = async () => {
    if (!currentLesson) return;
    try {
      const lessonNotes = await noteService.getNotesByLesson(parseInt(courseId), currentLesson.Id);
      setNotes(lessonNotes);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  };
const handleLessonSelect = (module, lesson) => {
    setCurrentModule(module);
    setCurrentLesson(lesson);
    setSidebarOpen(false);
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error("Please enter both title and content for the note");
      return;
    }

    try {
      const noteData = {
        courseId: parseInt(courseId),
        lessonId: currentLesson.Id,
        timestamp: currentVideoTime,
        title: newNote.title,
        content: newNote.content
      };

      await noteService.create(noteData);
      setNewNote({ title: "", content: "" });
      await loadNotes();
      toast.success("Note created successfully!");
    } catch (err) {
      toast.error("Failed to create note");
    }
  };

  const handleEditNote = async () => {
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) {
      toast.error("Please enter both title and content for the note");
      return;
    }

    try {
      await noteService.update(editingNote.Id, {
        title: editingNote.title,
        content: editingNote.content
      });
      setEditingNote(null);
      await loadNotes();
      toast.success("Note updated successfully!");
    } catch (err) {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await noteService.delete(noteId);
      await loadNotes();
      toast.success("Note deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  const handleSeekToNote = (timestamp) => {
    setCurrentVideoTime(timestamp);
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
              onProgress={setCurrentVideoTime}
              onTimestampRequest={handleSeekToNote}
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
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("content")}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200",
                  activeTab === "content"
                    ? "border-purple-500 text-purple-600 bg-purple-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                <ApperIcon name="BookOpen" className="w-4 h-4 mr-2 inline" />
                Content
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200",
                  activeTab === "notes"
                    ? "border-purple-500 text-purple-600 bg-purple-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                <ApperIcon name="StickyNote" className="w-4 h-4 mr-2 inline" />
                Notes ({notes.length})
              </button>
            </div>
          </div>

          {/* Content Tab */}
          {activeTab === "content" && (
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
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="flex-1 flex flex-col">
              {/* Add Note Form */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Add Note</h3>
                    <div className="text-xs text-gray-500">
                      At {noteService.formatTimestamp(currentVideoTime)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Note title..."
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Note content..."
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                    <Button
                      onClick={handleCreateNote}
                      size="sm"
                      className="w-full"
                      disabled={!newNote.title.trim() || !newNote.content.trim()}
                    >
                      <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {notes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="StickyNote" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No notes yet</p>
                      <p className="text-xs">Create your first note above</p>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div key={note.Id} className="bg-white border border-gray-200 rounded-lg p-3">
                        {editingNote && editingNote.Id === note.Id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingNote.title}
                              onChange={(e) => setEditingNote(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-2 py-1 text-sm font-medium border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <textarea
                              value={editingNote.content}
                              onChange={(e) => setEditingNote(prev => ({ ...prev, content: e.target.value }))}
                              rows={2}
                              className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            />
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={handleEditNote}
                                size="sm"
                                variant="primary"
                                className="flex-1"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={() => setEditingNote(null)}
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 mb-1">
                                  {note.title}
                                </h4>
                                <button
                                  onClick={() => handleSeekToNote(note.timestamp)}
                                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                >
                                  <ApperIcon name="Play" className="w-3 h-3 mr-1 inline" />
                                  {noteService.formatTimestamp(note.timestamp)}
                                </button>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                <button
                                  onClick={() => setEditingNote({ ...note })}
                                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                >
                                  <ApperIcon name="Edit2" className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note.Id)}
                                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                                >
                                  <ApperIcon name="Trash2" className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {note.content}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningView;