import { useState, useEffect } from "react";
import Papa from "papaparse";
import "tailwindcss/tailwind.css";

function App() {
  const [questions, setQuestions] = useState([]); // Store questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Current question
  const [score, setScore] = useState({ correct: 0, incorrect: 0 }); // Score counters
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Selected answer
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // Show correct answer indicator

  useEffect(() => {
    // Load CSV file
    const fetchQuestions = async () => {
      const response = await fetch("/questions.csv");
      const reader = await response.text();
      Papa.parse(reader, {
        header: true,
        complete: (results) => {
          setQuestions(results.data);
        },
      });
    };

    fetchQuestions();
  }, []);

  const handleAnswerClick = (answer) => {
    if (showCorrectAnswer) return; // Prevent double-clicks

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    // Update score
    setScore((prevScore) => ({
      correct: prevScore.correct + (isCorrect ? 1 : 0),
      incorrect: prevScore.incorrect + (!isCorrect ? 1 : 0),
    }));

    setSelectedAnswer(answer);
    setShowCorrectAnswer(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleRestartQuiz = () => {
    setScore({ correct: 0, incorrect: 0 });
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center text-lg font-semibold">
        Loading questions...
      </div>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Quiz Finished!</h2>
          <p className="text-lg text-gray-700 mb-4">
            Correct Answers: {score.correct}
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Incorrect Answers: {score.incorrect}
          </p>
          <button
            className="py-2 px-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
            onClick={handleRestartQuiz}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Quiz</h1>
        <p className="text-lg text-gray-700 mb-4 text-center">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <div className="bg-gray-200 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-gray-800 text-center">
            {currentQuestion.question}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {["A", "B", "C", "D"].map((option) => (
            <button
              key={option}
              className={`w-full py-3 px-6 text-lg rounded-lg font-medium text-white transition-colors duration-200 shadow-md
                ${
                  showCorrectAnswer && currentQuestion.correctAnswer === option
                    ? "bg-green-500"
                    : selectedAnswer === option
                    ? "bg-red-500"
                    : "bg-blue-500 hover:bg-blue-600"
                }
              `}
              onClick={() => handleAnswerClick(option)}
            >
              {option}: {currentQuestion[`option${option}`]}
            </button>
          ))}
        </div>
        {showCorrectAnswer && (
          <div className="mt-6 text-center">
            <button
              className="py-2 px-6 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-colors duration-200"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          </div>
        )}
        <p className="mt-6 text-center text-gray-700">
          Correct: {score.correct} | Incorrect: {score.incorrect}
        </p>
      </div>
    </div>
  );
}

export default App;
