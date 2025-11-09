import { useState } from "react";
import QuizQuestion from "./QuizQuestion";

const QuizDisplay = ({ quizData }) => {
  const [answers, setAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  if (!quizData || !quizData.quiz || !quizData.quiz.questions) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600">Invalid quiz data provided</p>
      </div>
    );
  }

  const questions = quizData.quiz.questions;

  const handleAnswerSelect = (questionText, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionText]: answer,
    }));
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((q) => !answers[q.question]);
    if (unanswered.length > 0) {
      alert(
        `Please answer all questions. ${unanswered.length} question(s) remaining.`
      );
      return;
    }
    setShowAnswers(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowAnswers(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.question] === q.correct_answer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: ((correct / questions.length) * 100).toFixed(1),
    };
  };

  const score = showAnswers ? calculateScore() : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {quizData.quiz.title || "AI Generated Quiz"}
        </h1>
        <p className="text-blue-100">
          Test your knowledge with {questions.length} questions
        </p>

        {showAnswers && (
          <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Your Score</p>
                <p className="text-3xl font-bold">
                  {score.correct} / {score.total}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{score.percentage}%</p>
                <p className="text-sm">Accuracy</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {!showAnswers && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {Object.keys(answers).length} / {questions.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (Object.keys(answers).length / questions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="mb-8">
        {questions.map((question, index) => (
          <QuizQuestion
            key={index}
            question={question}
            index={index}
            selectedAnswer={answers[question.question] || null}
            onAnswerSelect={handleAnswerSelect}
            showAnswers={showAnswers}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center sticky bottom-6">
        {!showAnswers ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Additional Info Section (shown after submission) */}
      {showAnswers && quizData.key_entities && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Key Topics Covered
          </h2>
          <div className="flex flex-wrap gap-2">
            {quizData.key_entities.map((entity, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {entity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDisplay;
