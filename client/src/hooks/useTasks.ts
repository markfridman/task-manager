import { useState, useEffect, useRef, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tasksState, taskFiltersState, paginationState, taskPaginationInfoState  } from '../recoil/atoms';
import { apiService } from '../services/api';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task';
import { QueryParams } from '../types/request';

// Shared request tracking
let activeRequest: Promise<void> | null = null;


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
  const [paginationInfo, setPaginationInfo] = useRecoilState(taskPaginationInfoState);
  const componentMounted = useRef(true);

  const fetchTasks = useCallback(async () => {
    // If there's already an active request, wait for it
    if (activeRequest) {
      await activeRequest;
      return;
    }

    if (!componentMounted.current) return;
    setLoading(true);
    setError(null);

    const fetchPromise = async () => {
      try {
        const queryParams: QueryParams = {
          ...pagination,
          ...filters,
        };

        console.log('Fetching tasks:', queryParams);
        const response = await apiService.getTasks(queryParams);
        console.log('Fetched tasks:', response.data);

        if (!componentMounted.current) return;
        
        if (response.success && response.data) {
          setTasks(response.data);
          if (response.pagination) {
            console.log('Pagination info:', response.pagination);
            setPaginationInfo({
              totalPages: response.pagination.totalPages,
              totalItems: response.pagination.totalItems
            });
          }
        }
      } catch (err) {
        if (!componentMounted.current) return;
        setError('Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        if (componentMounted.current) {
          setLoading(false);
        }
        activeRequest = null;
      }
    };

    activeRequest = fetchPromise();
    await activeRequest;
  }, [pagination, filters, setTasks]);

  const createTask = async (taskData: CreateTaskDto) => {
    if (!componentMounted.current) return;
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
      if (componentMounted.current) {
        setLoading(false);
      }
    }
  };

  const updateTask = async (taskId: string, taskData: UpdateTaskDto) => {
    if (!componentMounted.current) return;
    setLoading(true);
    try {
      const response = await apiService.updateTask(taskId, taskData);
      if (response.success && response.data) {
        setTasks(prev => prev.map(task => task.id === taskId ? response.data ?? task : task));
        return response.data;
      }
    } catch (err) {
      setError('Failed to update task');
      throw err;
    } finally {
      if (componentMounted.current) {
        setLoading(false);
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!componentMounted.current) return;
    setLoading(true);
    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    } finally {
      if (componentMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    componentMounted.current = true;
    // Cleanup function
    return () => {
      componentMounted.current = false;
    };
  }, []);


  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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