const API_BASE = 'http://localhost:3000';

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	expires_in: number;
	userId: string;
	email: string;
	isAdmin: boolean;
}

export interface SignupRequest {
	email: string;
	password: string;
}

class AuthApi {
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			...options
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'Network error' }));
			throw new Error(error.error || `HTTP ${response.status}`);
		}

		return response.json();
	}

	async login(credentials: LoginRequest): Promise<LoginResponse> {
		return this.request<LoginResponse>('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials)
		});
	}

	async signup(data: SignupRequest): Promise<{ ok: boolean }> {
		return this.request<{ ok: boolean }>('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async logout(): Promise<{ ok: boolean }> {
		return this.request<{ ok: boolean }>('/api/auth/logout', {
			method: 'POST'
		});
	}

	async recoverPassword(email: string): Promise<{ ok: boolean }> {
		return this.request<{ ok: boolean }>('/api/auth/recover-password', {
			method: 'POST',
			body: JSON.stringify({ email })
		});
	}
}

export const authApi = new AuthApi();
