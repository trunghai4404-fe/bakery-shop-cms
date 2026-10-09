import { ApiRoutes } from '@/constants/api-routes';
import type { LoginRequest, LoginResponse, RefreshTokenRequest, JwtResponse, User } from '../interface/auth.interface';
import callApi from '@/core/handleApi';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const url = `${ApiRoutes.AUTH}/login`;
  const response = await callApi<LoginResponse>(url, data, "post");
  return response.data;
};

export const refreshTokenApi = async (refreshToken: string): Promise<JwtResponse> => {
  const payload: RefreshTokenRequest = { refreshToken };
  const url = ApiRoutes.REFRESH_TOKEN;
  const response = await callApi<JwtResponse>(url, payload, "post");

  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const url = ApiRoutes.ME;
  const response = await callApi<User>(url);
  return response.data;
};
