import axios, { AxiosInstance } from 'axios';
import { QueryParams } from '../types/request';
import { ApiResponse } from '../types/api';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task';
import { LoginDto, CreateUserDto, AuthResponse } from '../types/user';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5173/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // this.api.interceptors.request.use(
    //   (config) => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //       config.headers.Authorization = `Bearer ${token}`;
    //     }
    //     return config;
    //   },
    //   (error) => Promise.reject(error)
    // );

    // this.api.interceptors.response.use(
    //   (response) => response,
    //   (error) => {
    //     if (error.response?.status === 401) {
    //       localStorage.removeItem('token');
    //       window.location.href = '/login';
    //     }
    //     return Promise.reject(error);
    //   }
    // );
  }

  // Task endpoints
  async getTasks(params?: QueryParams): Promise<ApiResponse<Task[]>> {
    const response = await this.api.get<ApiResponse<Task[]>>('/tasks', { params });
    return response.data;
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const response = await this.api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  }

  async createTask(task: CreateTaskDto): Promise<ApiResponse<Task>> {
    const response = await this.api.post<ApiResponse<Task>>('/tasks', task);
    return response.data;
  }

  async updateTask(id: string, task: UpdateTaskDto): Promise<ApiResponse<Task>> {
    const response = await this.api.put<ApiResponse<Task>>(`/tasks/${id}`, task);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.api.delete(`/tasks/${id}`);
  }

  // Auth endpoints
  async login(credentials: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  }

  async register(userData: CreateUserDto): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.get<ApiResponse<AuthResponse>>('/auth/me');
    return response.data;
  }
}

export const apiService = new ApiService();