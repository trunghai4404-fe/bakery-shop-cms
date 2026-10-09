import { createAsyncThunk } from '@reduxjs/toolkit';
import { authenticationApi } from '@/actions/auth';
import type { LoginRequest, LoginResponse, User } from '@/features/login/interface/auth.interface';
import { cookies } from '@/lib/cookies';

export const loginThunk = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authenticationApi.login(credentials);
      const data = response.data;

      if (data?.jwtResponse?.accessToken) {
        cookies.setAccessToken(
          data.jwtResponse.accessToken,
          data.jwtResponse.accessTokenExpireAt
        );
      }
      if (data?.jwtResponse?.refreshToken) {
        cookies.setRefreshToken(
          data.jwtResponse.refreshToken,
          data.jwtResponse.refreshTokenExpireAt
        );
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Đăng nhập thất bại!');
    }
  }
);

export const getProfileThunk = createAsyncThunk<User, void>(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticationApi.getProfile();
      return response.data;
    } catch (error: any) {
      cookies.clearAuth();
      return rejectWithValue(error?.message || 'Không thể lấy thông tin người dùng');
    }
  }
);

export const logoutThunk = createAsyncThunk<void, void>(
  'auth/logout',
  async () => {
    try {
      await authenticationApi.logoutApi();
    } catch (error) {
      // Ignore errors during logout API call
    } finally {
      cookies.clearAuth();
    }
  }
);
