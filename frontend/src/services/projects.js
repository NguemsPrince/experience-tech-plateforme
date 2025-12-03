import api from './api';

export const projectsService = {
  // Get all projects for current user
  getAllProjects: async () => {
    try {
      return await api.get('/projects');
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for projects');
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Site Web E-commerce',
            description: 'Développement d\'un site e-commerce',
            type: 'web',
            status: 'in_progress',
            createdAt: new Date().toISOString()
          }
        ]
      };
    }
  },

  // Get single project
  getProject: async (projectId) => {
    try {
      return await api.get(`/projects/${projectId}`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for project');
      return {
        success: true,
        data: {
          id: projectId,
          name: 'Projet Mock',
          description: 'Description du projet',
          type: 'web',
          status: 'in_progress'
        }
      };
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      return await api.post('/projects', projectData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Project created successfully', projectData);
      return {
        success: true,
        data: {
          id: Date.now(),
          ...projectData,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    try {
      return await api.put(`/projects/${projectId}`, projectData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Project updated successfully', projectId, projectData);
      return {
        success: true,
        data: { id: projectId, ...projectData }
      };
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      return await api.delete(`/projects/${projectId}`);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Project deleted successfully', projectId);
      return { success: true };
    }
  },

  // Get project status
  getProjectStatus: async (projectId) => {
    try {
      return await api.get(`/projects/${projectId}/status`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for project status');
      return {
        success: true,
        data: {
          id: projectId,
          status: 'in_progress',
          progress: 65
        }
      };
    }
  }
};
