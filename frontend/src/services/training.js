import apiEnhanced from './apiEnhanced';

export const trainingService = {
  // Get all courses
  getAllCourses: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'Tous') {
          params.append(key, filters[key]);
        }
      });

      const response = await apiEnhanced.get(`/training?${params}`);
      return response;
    } catch (error) {
      console.error('Get courses error:', error);
      throw error;
    }
  },

  // Get single course
  getCourse: async (courseId) => {
    try {
      const response = await apiEnhanced.get(`/training/${courseId}`);
      return response;
    } catch (error) {
      console.error('Get course error:', error);
      throw error;
    }
  },

  // Get single course by ID (alias for compatibility)
  getCourseById: async (courseId) => {
    try {
      const response = await apiEnhanced.get(`/training/${courseId}`);
      return response;
    } catch (error) {
      console.error('Get course by ID error:', error);
      throw error;
    }
  },

  // Enroll in a course
  enrollInCourse: async (courseId) => {
    try {
      const response = await apiEnhanced.post(`/training/${courseId}/enroll`);
      return response;
    } catch (error) {
      console.error('Enroll in course error:', error);
      throw error;
    }
  },

  // Get enrollment for a specific course
  getEnrollmentByCourse: async (courseId) => {
    try {
      const response = await apiEnhanced.get(`/training/${courseId}/enrollment`);
      return response;
    } catch (error) {
      console.error('Get enrollment by course error:', error);
      throw error;
    }
  },

  // Get user enrollments
  getMyCourses: async (status = 'enrolled', page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({
        status,
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await apiEnhanced.get(`/training/my-courses?${params}`);
      return response;
    } catch (error) {
      console.error('Get my courses error:', error);
      throw error;
    }
  },

  // Update course progress
  updateProgress: async (courseId, progress, lessonId = null) => {
    try {
      const response = await apiEnhanced.put(`/training/${courseId}/progress`, {
        progress,
        lessonId
      });
      return response;
    } catch (error) {
      console.error('Update progress error:', error);
      throw error;
    }
  },

  // Admin: Create new course
  createCourse: async (courseData) => {
    try {
      const response = await apiEnhanced.post('/training', courseData);
      return response;
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  },

  // Admin: Update course
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await apiEnhanced.put(`/training/${courseId}`, courseData);
      return response;
    } catch (error) {
      console.error('Update course error:', error);
      throw error;
    }
  },

  // Admin: Delete course
  deleteCourse: async (courseId) => {
    try {
      const response = await apiEnhanced.delete(`/training/${courseId}`);
      return response;
    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  }
};

export default trainingService;
