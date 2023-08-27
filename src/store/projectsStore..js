import { defineStore } from "pinia";
import projectsService from "../services/project.service";

export const userProjectStore = defineStore("ProjectStore", {
  state: () => {
    return { projects: [] };
  },
  actions: {
    async fetchProjects(page) {
      try {
        const projects = await projectsService.fetchProjects(page);
        commit.setProjects(projects);
      } catch (error) {
        console.error(error.message);
      }
    },
  },

  getters: {
    gerProjects(state) {
      return state.projects;
    },
  },
});
