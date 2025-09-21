import { browser } from '$app/environment';
import { authApi, type LoginResponse } from '$lib/api/auth';
import Cookies from 'js-cookie';
import { writable } from 'svelte/store';

export interface User {
	userId: string;
	email: string;
	isAdmin: boolean;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true
	});

	return {
		subscribe,

		async login(email: string, password: string) {
			try {
				const response: LoginResponse = await authApi.login({ email, password });
				const user: User = {
					userId: response.userId,
					email: response.email,
					isAdmin: response.isAdmin
				};

				if (browser) {
					localStorage.setItem('user', JSON.stringify(user));
				}

				set({
					user,
					isAuthenticated: true,
					isLoading: false
				});

				return { success: true };
			} catch (error) {
				set({
					user: null,
					isAuthenticated: false,
					isLoading: false
				});
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Login failed'
				};
			}
		},

		async signup(email: string, password: string) {
			try {
				await authApi.signup({ email, password });
				return { success: true };
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Signup failed'
				};
			}
		},

		async logout() {
			try {
				console.log('🔄 Starting logout...'); // Debug
				await authApi.logout();
				console.log('✅ Logout API call successful'); // Debug
			} catch (error) {
				console.error('❌ Logout error:', error);
			} finally {
				console.log('🧹 Cleaning local state...'); // Debug
				if (browser) {
					localStorage.removeItem('user');
					Cookies.remove('access_token', { path: '/api' });
					Cookies.remove('refresh_token', { path: '/api' });
				}

				set({
					user: null,
					isAuthenticated: false,
					isLoading: false
				});
				console.log('✅ Logout complete'); // Debug
			}
		},

		async recoverPassword(email: string) {
			try {
				await authApi.recoverPassword(email);
				return { success: true };
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Recovery failed'
				};
			}
		},

		checkAuth() {
			if (!browser) return;

			update((state) => ({ ...state, isLoading: true }));

			const hasAccessToken = !!Cookies.get('access_token');
			const savedUser = localStorage.getItem('user');

			if (hasAccessToken && savedUser) {
				try {
					const user = JSON.parse(savedUser);
					set({
						user,
						isAuthenticated: true,
						isLoading: false
					});
				} catch {
					localStorage.removeItem('user');
					Cookies.remove('access_token');
					Cookies.remove('refresh_token');
					set({
						user: null,
						isAuthenticated: false,
						isLoading: false
					});
				}
			} else {
				set({
					user: null,
					isAuthenticated: false,
					isLoading: false
				});
			}
		}
	};
}

export const authStore = createAuthStore();
