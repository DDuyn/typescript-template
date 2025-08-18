export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expires_in: number;
  userId: string;
  email: string;
  isAdmin: boolean;
};
