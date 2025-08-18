export type LoginDto = {
  accessToken: string;
  refreshToken: string;
  expires_in: number | null;
  userId: string;
  email: string;
  isAdmin: boolean;
};
