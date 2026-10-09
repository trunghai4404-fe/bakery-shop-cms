import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { cookies } from '@/lib/cookies';
import { ApiRoutes } from '@/constants/api-routes';
import { ApiError } from './api-error';

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
    headers: {
        Accept: 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = cookies.getAccessToken();

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (!(config.data instanceof FormData) && config.headers) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError<any>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 401 && originalRequest && !originalRequest._retry) {
                const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh-token');

                if (!isAuthEndpoint) {
                    originalRequest._retry = true;
                    const refreshToken = cookies.getRefreshToken();

                    if (refreshToken) {
                        if (isRefreshing) {
                            return new Promise((resolve, reject) => {
                                failedQueue.push({ resolve, reject });
                            }).then((token) => {
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${token}`;
                                }
                                return axiosClient(originalRequest);
                            });
                        }

                        isRefreshing = true;

                        try {
                            const refreshRes = await axios.post(
                                ApiRoutes.REFRESH_TOKEN,
                                { refreshToken },
                                { headers: { 'Content-Type': 'application/json' } }
                            );

                            const resData = refreshRes.data?.data || refreshRes.data;
                            const jwtResponse = resData?.jwtResponse || resData;

                            const newAccessToken = jwtResponse?.accessToken;
                            const newRefreshToken = jwtResponse?.refreshToken;

                            if (newAccessToken) {
                                cookies.setAccessToken(newAccessToken, jwtResponse?.accessTokenExpireAt);
                                if (newRefreshToken) {
                                    cookies.setRefreshToken(newRefreshToken, jwtResponse?.refreshTokenExpireAt);
                                }

                                processQueue(null, newAccessToken);
                                isRefreshing = false;

                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                                }
                                return axiosClient(originalRequest);
                            }
                        } catch (refreshErr) {
                            processQueue(refreshErr, null);
                            isRefreshing = false;
                            cookies.clearAuth();
                            window.location.href = '/login';
                            return Promise.reject(refreshErr);
                        }
                    } else {
                        cookies.clearAuth();
                        window.location.href = '/login';
                    }
                }
            }

            const errorMessage = data?.message || data?.title || 'Đã có lỗi xảy ra từ máy chủ';
            const errorCode = data?.code;
            const validationErrors = data?.errors;

            return Promise.reject(new ApiError(errorMessage, status, errorCode, validationErrors));
        }

        if (error.request) {
            return Promise.reject(new ApiError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.', 0));
        }

        return Promise.reject(new ApiError(error.message || 'Lỗi không xác định'));
    },
);

export default axiosClient;
