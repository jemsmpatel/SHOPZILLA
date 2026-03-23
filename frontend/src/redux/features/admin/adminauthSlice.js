import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    adminInfo: localStorage.getItem('adminInfo')
        ? JSON.parse(localStorage.getItem('adminInfo'))
        : null,
};

const adminSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        setAdminCredentials: (state, action) => {
            state.adminInfo = action.payload;

            localStorage.setItem('adminInfo', JSON.stringify(action.payload));

            const expirationTime =
                new Date().getTime() + (2 * 24 * 60 * 60 * 1000); // 2 days

            localStorage.setItem('adminExpirationTime', expirationTime);
        },

        adminLogout: (state) => {
            state.adminInfo = null;

            localStorage.removeItem('adminInfo');
            localStorage.removeItem('adminExpirationTime');
        },
    },
});

export const { setAdminCredentials, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;