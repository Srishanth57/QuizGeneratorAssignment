
import { useState } from 'react';
import { api } from '../services/api';
import QuizDisplay from '../components/QuizDisplay';

const GenerateQuizTab = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate URL
    if (!url.trim()) {
      setError('Please enter a Wikipedia URL');
      return;
    }

    if (!url.includes('wikipedia.org')) {
      setError('Please enter a valid Wikipedia URL');
      return;
    }

    setLoading(true);
    setError(null);
    setQuizData(null);

    try {
      const data = await api.generateQuiz(url);
      setQuizData(data);
      setUrl(''); // Clear input after success
    } catch (err) {
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Generate AI Quiz
        </h1>
        <p className="text-gray-600">
          Enter a Wikipedia URL to create an educational quiz
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <label htmlFor="wiki-url" className="block text-sm font-medium text-gray-700 mb-2">
            Wikipedia Article URL
          </label>
          <div className="flex gap-3">
            <input
              id="wiki-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Analyzing article and generating quiz...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
        </div>
      )}

      {/* Quiz Display */}
      {quizData && !loading && (
        <QuizDisplay quizData={quizData} />
      )}

      {/* Empty State */}
      {!quizData && !loading && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">Enter a Wikipedia URL to generate your first quiz</p>
        </div>
      )}
    </div>
  );
};

export default GenerateQuizTab;

