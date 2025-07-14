import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import QuizInterface from "@/components/organisms/QuizInterface";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { quizService } from "@/services/api/quizService";
import { progressService } from "@/services/api/progressService";

const QuizScreen = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError("");
      const quizData = await quizService.getById(parseInt(quizId));
      setQuiz(quizData);
    } catch (err) {
      setError("Failed to load quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (result) => {
    try {
      // Save quiz result
      await progressService.saveQuizResult(parseInt(courseId), parseInt(quizId), result);
      
      if (result.passed) {
        toast.success(`Quiz completed! You scored ${result.score}%`);
        // Navigate back to learning view
        navigate(`/learn/${courseId}`);
      } else {
        toast.error(`Quiz failed. You scored ${result.score}%. Try again!`);
      }
    } catch (err) {
      toast.error("Failed to save quiz result. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <Error message={error} onRetry={loadQuiz} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/learn/${courseId}`)}
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Quiz Time</h1>
              <p className="text-sm text-gray-600">Test your knowledge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuizInterface quiz={quiz} onComplete={handleQuizComplete} />
      </div>
    </div>
  );
};

export default QuizScreen;