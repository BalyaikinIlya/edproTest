<template>
  <div>
    <h1>Список проектов</h1>

    <input
      class="border border-black p-1"
      v-model="projectTitle"
      @input="filterProjects"
      type="text"
    />
    <select
      class="border border-black p-1"
      v-model="projectStatus"
      @change="filterProjects"
      name=""
      id=""
    >
      <option value="">Все</option>
      <option value="CREATED">Создан</option>
      <option value="IN_PROGRESS">В процессе</option>
      <option value="FINISHED">Завершен</option>
    </select>
    <button
      v-if="currentPage > 1"
      @click="setPrewPage"
      class="border border-black p-1"
    >
      Предыдущая страница
    </button>
    <button
      v-if="currentPage < totalPage"
      @click="setNextPage"
      class="border border-black p-1"
    >
      Следующая страница
    </button>

    <table
      v-if="!loadingStatus"
      class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xl text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th>Название</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          v-for="project in filteredProjects"
          :key="project.id"
        >
          <td class="py-4">{{ project.title }}</td>
          <td class="py-4">{{ project.status }}</td>
        </tr>
      </tbody>
    </table>
    <AppLoader v-if="loadingStatus"></AppLoader>
  </div>
</template>
<script setup>
import projectsService from "../services/project.service";
import { ref, onMounted } from "vue";
import AppLoader from "./appLoader.vue";

const filteredProjects = ref([]);
const projectTitle = ref("");
const projectStatus = ref("");
const loadingStatus = ref("");
const totalPage = ref(0);
const currentPage = ref(1);
const cachedPageProjects = ref([]);

const getProjects = () => {
  if (cachedPageProjects.value[currentPage.value]) {
    filteredProjects.value = cachedPageProjects.value[currentPage.value];
  } else {
    loadPage(currentPage.value);
  }
};

const loadPage = async (page) => {
  loadingStatus.value = true;

  try {
    if (!cachedPageProjects.value[page]) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await projectsService.fetchProjects(page);
      cachedPageProjects.value[page] = res.results;
      filteredProjects.value = res.results;
      totalPage.value = Math.ceil(res.count / 10);
    }
  } catch (error) {
    console.log("Failed to load data");
  }
  loadingStatus.value = false;
};

const filterProjects = () => {
  filteredProjects.value = cachedPageProjects.value[currentPage.value].filter(
    (project) => {
      const titleFilter = project.title
        .toLowerCase()
        .includes(projectTitle.value.toLowerCase());
      const statusFilter =
        !projectStatus.value || project.status === projectStatus.value;
      return titleFilter && statusFilter;
    }
  );
};

const setNextPage = () => {
  currentPage.value++;
  cleanFilter();
  getProjects();
};

const setPrewPage = () => {
  currentPage.value--;
  cleanFilter();
  getProjects();
};

const cleanFilter = () => {
  projectTitle.value = "";
  projectStatus.value = "";
};

onMounted(getProjects);
</script>
