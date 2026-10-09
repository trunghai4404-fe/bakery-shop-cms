import type { User } from "@/features/login/interface/auth.interface";
import { cookies } from "@/lib/cookies";
import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, getProfileThunk, logoutThunk } from "../auth/auth.action";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: !!cookies.getAccessToken(),
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isLoading = false;
            state.error = null;
            cookies.clearAuth();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = (action.payload as string) || 'Đăng nhập thất bại';
            })
            .addCase(getProfileThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProfileThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getProfileThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.error = (action.payload as string) || 'Lỗi xác thực';
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(logoutThunk.rejected, (state) => {
                state.user = null;
                state.isLoading = false;
                state.error = null;
            });
    }
});

export const { setLoading, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
