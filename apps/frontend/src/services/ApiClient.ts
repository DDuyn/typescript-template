import { emitter } from "@lib/SpoonKit/signals/Emitter";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

interface ErrorResponse {
  message: string;
  status: number;
  errors?: any;
}

export class ApiClient {
  private client: AxiosInstance;

  onUnauthorized = emitter<void>();

  constructor() {
    this.client = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          this.onUnauthorized.next();
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      return await this.client.get(url, config);
    } catch (error: any) {
      this.handleError(error);
      throw this.formatError(error);
    }
  }

  async post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      return await this.client.post(url, data, config);
    } catch (error: any) {
      this.handleError(error);
      throw this.formatError(error);
    }
  }

  async put<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      return await this.client.put(url, data, config);
    } catch (error: any) {
      this.handleError(error);
      throw this.formatError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      return await this.client.delete(url, config);
    } catch (error: any) {
      this.handleError(error);
      throw this.formatError(error);
    }
  }

  private handleError(error: any): void {
    console.error("API Error:", error);
  }

  private formatError(error: any): ErrorResponse {
    return {
      message: error.response?.data?.message || "Error en la petición",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
  }
}
