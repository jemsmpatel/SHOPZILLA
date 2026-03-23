import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
<<<<<<< HEAD
        baseUrl: process.env.REACT_APP_API_URL,
=======
        baseUrl: `${process.env.REACT_APP_API_URL}api/v1`,
>>>>>>> 0fd8871 (updated my code)
        credentials: 'include',
    }),
    endpoints: () => ({}), // Extend in other files
});
