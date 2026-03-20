import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://10.233.167.181:5000/api/v1', // Proxy will convert this to http://127.0.0.1:5000
        credentials: 'include',
    }),
    endpoints: () => ({}), // Extend in other files
});
