import axios from "axios";

const baseURL = "https://dev.aicap.tech/api/v1/interview/projects/";

const projectsService = axios.create({
  baseURL,
});

export default {
  async fetchProjects(page) {
    try {
      const response = await projectsService.get("", { params: { page } });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to laod data");
    }
  },
};
