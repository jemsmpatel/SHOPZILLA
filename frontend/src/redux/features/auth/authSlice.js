import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));

            const expirationTime = new Date().getTime() + 30 + 24 + 60 + 60 * 100;
            localStorage.setItem('userExpirationTime', expirationTime);
        },

        userLogout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userExpirationTime');
        },
    },
});

export const { setUserCredentials, userLogout } = authSlice.actions;
export default authSlice.reducer;