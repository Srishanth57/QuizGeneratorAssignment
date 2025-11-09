
const API_BASE_URL = 'http://localhost:8000';

export const api = {
  // Generate a new quiz from Wikipedia URL
  generateQuiz: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate_quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate quiz');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  },

  // Get all quiz history
  getHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  },

  // Get specific quiz by ID
  getQuiz: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`);

      if (!response.ok) {
        throw new Error('Quiz not found');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }
};
