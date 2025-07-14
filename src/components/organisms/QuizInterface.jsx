import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Progress from "@/components/atoms/Progress";
import QuizOption from "@/components/molecules/QuizOption";

const QuizInterface = ({ 
  className, 
  quiz,
  onComplete,
  ...props 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);

  const questions = quiz?.questions || [];
  const question = questions[currentQuestion];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNext();
    }
  }, [timeLeft, isActive]);

  const handleAnswer = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setShowResults(true);
      setIsActive(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setTimeLeft(30);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    onComplete?.({
      score,
      answers,
      passed: score >= quiz.passingScore
    });
  };

  if (!quiz || questions.length === 0) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No quiz available</p>
      </Card>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= quiz.passingScore;
    
    return (
      <Card className={cn("p-8 text-center", className)}>
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
          passed ? "bg-emerald-100" : "bg-red-100"
        )}>
          <ApperIcon 
            name={passed ? "CheckCircle" : "XCircle"} 
            className={cn(
              "w-8 h-8",
              passed ? "text-emerald-600" : "text-red-600"
            )} 
          />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {passed ? "Congratulations!" : "Keep Learning"}
        </h2>
        
        <p className="text-gray-600 mb-6">
          You scored {score}% ({quiz.passingScore}% required to pass)
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span>Correct Answers:</span>
            <span className="font-medium">
              {questions.filter((_, index) => answers[index] === questions[index].correctAnswer).length} / {questions.length}
            </span>
          </div>
        </div>
        
        <Button onClick={handleSubmit} variant={passed ? "success" : "primary"}>
          {passed ? "Complete Quiz" : "Try Again"}
        </Button>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-gray-500" />
              <span className={cn(
                "text-sm font-medium",
                timeLeft <= 10 ? "text-red-600" : "text-gray-700"
              )}>
                {timeLeft}s
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </div>
        
        <Progress 
          value={((currentQuestion + 1) / questions.length) * 100} 
          className="mb-4"
        />
      </Card>

      {/* Question */}
      <Card className="p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h2>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <QuizOption
              key={index}
              selected={answers[currentQuestion] === index}
              onClick={() => handleAnswer(index)}
            >
              {option}
            </QuizOption>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizInterface;