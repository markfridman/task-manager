import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tasksState, taskFiltersState, paginationState } from '../recoil/atoms';
import { apiService } from '../services/api';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task';
import { QueryParams } from '../types/request';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: CreateTaskDto) => Promise<Task | undefined>;
  updateTask: (taskId: string, taskData: UpdateTaskDto) => Promise<Task | undefined>;
  deleteTask: (taskId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  pagination: {
    totalPages: number;
    totalItems: number;
  };
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useRecoilState(tasksState);
  const filters = useRecoilValue(taskFiltersState);
  const pagination = useRecoilValue(paginationState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    totalItems: 0
  });

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: QueryParams = {
        ...pagination,
        ...filters,
      };

      const response = await apiService.getTasks(queryParams);
      if (response.success && response.data) {
        setTasks(response.data);
        if (response.pagination) {
          setPaginationInfo({
            totalPages: response.pagination.totalPages,
            totalItems: response.pagination.totalItems
          });
        }
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskDto) => {
    setLoading(true);
    try {
      const response = await apiService.createTask(taskData);
      if (response.success && response.data) {
        setTasks(prev => [...prev, response.data ?? {} as Task]);
        return response.data;
      }
    } catch (err) {
      setError('Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, taskData: UpdateTaskDto) => {
    setLoading(true);
    try {
      const response = await apiService.updateTask(taskId, taskData);
      if (response.success && response.data) {
        setTasks(prev => prev.map(task => task.id === taskId ? response.data ?? task : task)
        );
        return response.data;
      }
    } catch (err) {
      setError('Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // Fetch tasks when filters or pagination changes
  useEffect(() => {
    fetchTasks();
  }, [
    pagination.page,
    pagination.limit,
    pagination.sortBy,
    pagination.sortOrder,
    filters.status,
    filters.priority,
    filters.search,
    filters.startDate,
    filters.endDate
  ]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
    pagination: paginationInfo
  };
}
