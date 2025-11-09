const QuizQuestion = ({
  question,
  index,
  selectedAnswer,
  onAnswerSelect,
  showAnswers,
}) => {
  const isCorrect = selectedAnswer === question.correct_answer;
  const hasAnswered = selectedAnswer !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 transition-all hover:shadow-lg">
      {/* Question Header */}
      <div className="flex items-start mb-4">
        <span className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">
          {index + 1}
        </span>
        <h3 className="text-lg font-semibold text-gray-800 flex-grow">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3 ml-11">
        {question.options.map((option, optIndex) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === question.correct_answer;

          let optionClasses =
            "p-4 rounded-lg border-2 cursor-pointer transition-all ";

          if (!showAnswers) {
            // Before submission
            optionClasses += isSelected
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50";
          } else {
            // After submission
            if (isCorrectOption) {
              optionClasses += "border-green-500 bg-green-50";
            } else if (isSelected && !isCorrect) {
              optionClasses += "border-red-500 bg-red-50";
            } else {
              optionClasses += "border-gray-200 bg-gray-50 cursor-not-allowed";
            }
          }

          return (
            <div
              key={optIndex}
              onClick={() =>
                !showAnswers && onAnswerSelect(question.question, option)
              }
              className={optionClasses}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0"
                    style={{
                      borderColor:
                        showAnswers && isCorrectOption
                          ? "#10b981"
                          : showAnswers && isSelected && !isCorrect
                          ? "#ef4444"
                          : isSelected
                          ? "#3b82f6"
                          : "#d1d5db",
                      backgroundColor:
                        showAnswers && isCorrectOption
                          ? "#10b981"
                          : showAnswers && isSelected && !isCorrect
                          ? "#ef4444"
                          : isSelected
                          ? "#3b82f6"
                          : "white",
                    }}
                  >
                    {(showAnswers && isCorrectOption) ||
                    (isSelected && !showAnswers) ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : showAnswers && isSelected && !isCorrect ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </span>
                  <span className="text-gray-800">{option}</span>
                </div>

                {showAnswers && isCorrectOption && (
                  <span className="text-green-600 text-sm font-semibold">
                    Correct
                  </span>
                )}
                {showAnswers && isSelected && !isCorrect && (
                  <span className="text-red-600 text-sm font-semibold">
                    Wrong
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation (shown after submission) */}
      {showAnswers && question.explanation && (
        <div className="mt-4 ml-11 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">
                Explanation:
              </p>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
