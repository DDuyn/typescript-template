import { provide } from "@lib/SpoonKit/providers";
import { ApiClient } from "./ApiClient";

interface AuthResponse {
  isAuthenticated: boolean;
  userId: string;
  userName: string;
}

export class AuthService {
  private apiClient = provide(ApiClient);
  private bffPath = import.meta.env.VITE_BFF_PATH || "";
  private authData: AuthResponse | null = null;

  constructor() {
    this.apiClient.onUnauthorized.subscribe(() => {
      this.loginRedirect();
    });
  }

  private loginRedirect() {
    location.replace(
      `${this.bffPath}/login?returnUrl=${encodeURIComponent(location.href)}`
    );
  }

  async logout() {
    this.authData = null;

    location.replace(
      `${this.bffPath}/logout?returnUrl=${encodeURIComponent(location.href)}`
    );
  }

  public async auth() {
    this.authData = await this.apiClient.get<AuthResponse>("/auth");

    if (!this.authData.isAuthenticated) {
      this.loginRedirect();
    }
  }

  public getAuthData(): AuthResponse {
    if (!this.authData?.isAuthenticated)
      throw new Error(
        "User not authenticated, review you are accessing getAuthData() after doing auth()"
      );

    return { ...this.authData };
  }

  public isAuthenticated(): boolean {
    return this.authData?.isAuthenticated ?? false;
  }

  readCookie() {}
}
