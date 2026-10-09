import { ApiRoutes } from "@/constants/api-routes";
import callApi from "@/core/handleApi";
import type { JwtResponse, LoginRequest, LoginResponse, RegisterRequest, User } from "@/features/login/interface/auth.interface";
import { cookies } from "@/lib/cookies";

export const authenticationApi = {
    login: async (data: LoginRequest) => {
        const url = `${ApiRoutes.AUTH}/login`;
        return callApi<LoginResponse>(url, data, "post");
    },
    register: async (payload: RegisterRequest) => {
        const url = `${ApiRoutes.AUTH}/register`;
        return callApi<unknown>(url, payload, "post");
    },
    getProfile: async () => {
        return callApi<User>(ApiRoutes.ME);
    },
    logoutApi: async () => {
        const url = `${ApiRoutes.AUTH}/logout`;
        const refreshToken = cookies.getRefreshToken() ?? "";
        return callApi<unknown>(url, { refreshToken }, "post");
    },
    refreshToken: async (refreshToken: string) => {
        const url = `${ApiRoutes.AUTH}/refresh-token`;
        return callApi<JwtResponse>(url, { refreshToken }, "post");
    }
};