import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
        reducerPath: 'api',
        baseQuery: fetchBaseQuery({
                baseUrl: `${process.env.REACT_APP_API_URL}api/v1`,
                credentials: 'include',
        }),
        endpoints: () => ({}), // Extend in other files
});
