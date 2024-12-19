import { selector } from 'recoil';
import { tasksState, taskFiltersState, paginationState, selectedTaskIdState } from './atoms';

export const filteredTasksSelector = selector({
  key: 'filteredTasksSelector',
  get: ({ get }) => {
    const tasks = get(tasksState);
    const filters = get(taskFiltersState);
    const { sortBy, sortOrder } = get(paginationState);

    let filteredTasks = [...tasks];

    // Apply filters
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.tags?.length) {
      filteredTasks = filteredTasks.filter(task => 
        filters.tags!.some(tag => task.tags.includes(tag))
      );
    }

    // Apply sorting
    if (sortBy) {
      filteredTasks.sort((a: any, b: any) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        const order = sortOrder === 'asc' ? 1 : -1;
        return aValue > bValue ? order : -order;
      });
    }

    return filteredTasks;
  },

  
});

export const selectedTaskSelector = selector({
  key: 'selectedTaskSelector',
  get: ({ get }) => {
    const taskId = get(selectedTaskIdState);
    const tasks = get(tasksState);
    
    if (!taskId) return null;
    
    return tasks.find(task => task.id === taskId) || null;
  },
});

export const taskStatsSelector = selector({
  key: 'taskStatsSelector',
  get: ({ get }) => {
    const tasks = get(tasksState);
    
    return {
      total: tasks.length,
      toDo: tasks.filter(task => task.status === 'To Do').length,
      inProgress: tasks.filter(task => task.status === 'In Progress').length,
      completed: tasks.filter(task => task.status === 'Completed').length,
      highPriority: tasks.filter(task => task.priority === 'High').length,
    };
  },
});