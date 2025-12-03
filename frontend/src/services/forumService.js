import api from './api';

const forumService = {
  // Categories
  getCategories: () => api.get('/forum/categories'),
  createCategory: (data) => api.post('/forum/categories', data),

  // Posts
  getPosts: (params = {}) => api.get('/forum/posts', { params }),
  getPost: (id) => api.get(`/forum/posts/${id}`),
  createPost: (data) => api.post('/forum/posts', data),
  updatePost: (id, data) => api.put(`/forum/posts/${id}`, data),
  deletePost: (id) => api.delete(`/forum/posts/${id}`),
  likePost: (id) => api.post(`/forum/posts/${id}/like`),
  dislikePost: (id) => api.post(`/forum/posts/${id}/dislike`),
  reportPost: (id, data) => api.post(`/forum/posts/${id}/report`, data),

  // Comments
  getComments: (postId, params = {}) => api.get(`/forum/posts/${postId}/comments`, { params }),
  createComment: (postId, data) => api.post(`/forum/posts/${postId}/comments`, data),
  updateComment: (id, data) => api.put(`/forum/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/forum/comments/${id}`),
  likeComment: (id) => api.post(`/forum/comments/${id}/like`),
  dislikeComment: (id) => api.post(`/forum/comments/${id}/dislike`),
  markAsSolution: (id) => api.post(`/forum/comments/${id}/solution`),

  // Follow
  followPost: (id) => api.post(`/forum/posts/${id}/follow`),
  unfollowPost: (id) => api.delete(`/forum/posts/${id}/follow`),

  // Admin
  getReports: () => api.get('/forum/admin/reports'),
  updateReportStatus: (type, id, data) => api.put(`/forum/admin/reports/${type}/${id}`, data),
  pinPost: (id) => api.post(`/forum/admin/posts/${id}/pin`),
  lockPost: (id) => api.post(`/forum/admin/posts/${id}/lock`),
};

export default forumService;
