import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    sellerInfo: localStorage.getItem('sellerInfo') ? JSON.parse(localStorage.getItem('sellerInfo')) : null,
}
const sellerSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSellerCredentials: (state, action) => {
            state.sellerInfo = action.payload;
            localStorage.setItem('sellerInfo', JSON.stringify(action.payload));

            const expirationTime = new Date().getTime() + 30 + 24 + 60 + 60 * 100;
            localStorage.setItem('sellerExpirationTime', expirationTime);
        },

        sellerLogout: (state) => {
            state.sellerInfo = null;
            localStorage.removeItem('sellerInfo');
            localStorage.removeItem('sellerExpirationTime');
        },
    },
});

export const { setSellerCredentials, sellerLogout } = sellerSlice.actions;
export default sellerSlice.reducer;