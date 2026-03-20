import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://shopzilla-2ugr.onrender.com/', // Proxy will convert this to http://127.0.0.1:5000
        credentials: 'include',
    }),
    endpoints: () => ({}), // Extend in other files
});
