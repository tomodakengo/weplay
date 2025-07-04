import { 
  ApiResponse, 
  LoginFormData, 
  RegisterFormData, 
  CreateGameFormData,
  User,
  Game
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // ブラウザ環境でのみトークンを取得
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Auth endpoints
  async login(data: LoginFormData): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterFormData): Promise<ApiResponse<{ user: User; token: string }>> {
    const { confirmPassword, ...registerData } = data;
    return this.request('/api/v1/users/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request('/api/v1/users/profile');
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/api/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Games endpoints
  async getGames(): Promise<ApiResponse<Game[]>> {
    return this.request('/api/v1/games');
  }

  async getGame(id: string): Promise<ApiResponse<Game>> {
    return this.request(`/api/v1/games/${id}`);
  }

  async createGame(data: CreateGameFormData): Promise<ApiResponse<Game>> {
    return this.request('/api/v1/games', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGame(id: string, data: Partial<Game>): Promise<ApiResponse<Game>> {
    return this.request(`/api/v1/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGame(id: string): Promise<ApiResponse<void>> {
    return this.request(`/api/v1/games/${id}`, {
      method: 'DELETE',
    });
  }

  // Posts endpoints
  async getGamePosts(gameId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/v1/posts/game/${gameId}`);
  }

  async createPost(data: any): Promise<ApiResponse<any>> {
    return this.request('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Upload endpoints
  async uploadFile(file: File, folder: 'avatars' | 'posts' = 'posts'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return fetch(`${this.baseURL}/api/v1/upload/single`, {
      method: 'POST',
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : '',
      },
      body: formData,
    }).then(res => res.json());
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;