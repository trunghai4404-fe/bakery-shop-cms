import { createSlice } from "@reduxjs/toolkit";

interface UIState {
    sidebarCollapsed: boolean;
    mobileDrawerOpen: boolean;
}

const initialState: UIState = {
    sidebarCollapsed: false,
    mobileDrawerOpen: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        toggleMobileDrawer: (state) => {
            state.mobileDrawerOpen = !state.mobileDrawerOpen;
        },
        setMobileDrawerOpen: (state, action) => {
            state.mobileDrawerOpen = action.payload;
        },
    },
});

export default uiSlice.reducer;
export const { toggleSidebar, toggleMobileDrawer, setMobileDrawerOpen } = uiSlice.actions;
