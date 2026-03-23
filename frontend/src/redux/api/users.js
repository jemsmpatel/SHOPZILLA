import { apiSlice } from './apiSlice';
import { CART_URL, USER_URL } from '../constants';

export const users = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/`,
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),
        request_login_otp: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/request_otp`,
                method: 'POST',
                body: data
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USER_URL}/logout`,
                method: "POST",
            }),
        }),
        profile: builder.query({
            query: () => `${USER_URL}/profile`
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/profile`,
                method: "PUT",
                body: data
            }),
        }),
        createContact: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/contact`,
                method: "POST",
                body: data,
            }),
        }),
        updateContact: builder.mutation({
            query: ({ id, data }) => ({
                url: `${USER_URL}/contact/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteContact: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/contact/${id}`,
                method: "DELETE",
            }),
        }),
        getContact: builder.query({
            query: (id) => `${USER_URL}/contact/${id}`,
        }),
        getUserAllContact: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/contact/user/${id}`,
                method: "GET",
            }),
        }),
        getAllUsers: builder.query({
            query: () => `${USER_URL}/`,
        }),
        getSpecificuser: builder.query({
            query: (id) => `${USER_URL}/${id}`,
        }),
        updateSpecificUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `${USER_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteSpecificUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                method: "DELETE",
            }),
        }),
        getAllContacts: builder.query({
            query: () => `${USER_URL}/contact`,
        }),
        addToCart: builder.mutation({
            query: (data) => ({
                url: `${CART_URL}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Cart"],
        }),
        updateCart: builder.mutation({
            query: ({ id, data }) => ({
                url: `${CART_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Cart"],
        }),
        removeProductToCart: builder.mutation({
            query: (id) => ({
                url: `${CART_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
        getUserCart: builder.query({
            query: () => `${CART_URL}`,
            providesTags: ["Cart"],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useRequest_login_otpMutation,
    useLogoutMutation,
    useProfileQuery,
    useUpdateProfileMutation,
    useCreateContactMutation,
    useUpdateContactMutation,
    useDeleteContactMutation,
    useGetContactQuery,
    useGetUserAllContactMutation,
    useGetAllUsersQuery,
    useGetSpecificuserQuery,
    useUpdateSpecificUserMutation,
    useDeleteSpecificUserMutation,
    useGetAllContactsQuery,
    useAddToCartMutation,
    useUpdateCartMutation,
    useRemoveProductToCartMutation,
    useGetUserCartQuery,
} = users;
