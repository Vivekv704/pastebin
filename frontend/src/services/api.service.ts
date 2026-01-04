// API service for backend communication

export interface CreatePasteRequest {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

export interface CreatePasteResponse {
  id: string;
  url: string;
}

export interface GetPasteResponse {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

export class ApiService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }

  async createPaste(request: CreatePasteRequest): Promise<CreatePasteResponse> {
    const response = await fetch(`${this.baseUrl}/api/pastes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to create paste');
    }

    return await response.json();
  }

  async getPaste(id: string): Promise<GetPasteResponse> {
    const response = await fetch(`${this.baseUrl}/api/pastes/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Paste not found or has expired');
      }
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to fetch paste');
    }

    return await response.json();
  }

  async checkHealth(): Promise<{ ok: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/healthz`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return await response.json();
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export a singleton instance
export const apiService = new ApiService();