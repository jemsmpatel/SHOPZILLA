import { apiSlice } from './apiSlice';
import { SELLER_URL, MEDIA_URL } from '../constants';

export const users = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sellerRegister: builder.mutation({
            query: (data) => ({
                url: `${SELLER_URL}/`,
                method: "POST",
                body: data,
            }),
        }),
        sellerLogin: builder.mutation({
            query: (data) => ({
                url: `${SELLER_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),
        sellerProfile: builder.query({
            query: () => ({
                url: `${SELLER_URL}/profile`,
                method: "GET",
            }),
        }),
        sellerUpdateUser: builder.mutation({
            query: (data) => ({
                url: `${SELLER_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        sellerDeleteUser: builder.mutation({
            query: (id) => ({
                url: `${SELLER_URL}/${id}`,
                method: "DELETE",
            }),
        }),
        UploadMedia: builder.mutation({
            query: (formData) => ({
                url: `${MEDIA_URL}/upload`,
                method: "POST",
                body: formData,
            }),
        }),
        getAllSeller: builder.query({
            query: () => `${SELLER_URL}/`,
        }),
        getSpecificSeller: builder.query({
            query: (id) => `${SELLER_URL}/${id}`
        }),
        sellerLogout: builder.mutation({
            query: () => ({
                url: `${SELLER_URL}/logout`,
                method: "POST",
            }),
        }),
        confirmOrderItem: builder.mutation({
            query: (item_id) => ({
                url: `${SELLER_URL}/orders/confirm/${item_id}`,
                method: "PUT",
            }),
            invalidatesTags: ["SellerOrders"],
        }),
        shipOrderItem: builder.mutation({
            query: (item_id) => ({
                url: `${SELLER_URL}/orders/ship/${item_id}`,
                method: "PUT",
            }),
            invalidatesTags: ["SellerOrders"],
        }),
        deliveredOrderItem: builder.mutation({
            query: (itemId) => ({
                url: `${SELLER_URL}/orders/${itemId}/delivered`,
                method: "PUT",
            }),
            invalidatesTags: ["SellerOrders"],
        }),
        getSellerPlacedOrders: builder.query({
            query: () => `${SELLER_URL}/orders/placed`,
            providesTags: ["SellerOrders"],
        }),
        getSellerPendingOrders: builder.query({
            query: () => ({
                url: `${SELLER_URL}/orders/pending`,
                method: "GET",
            }),
            providesTags: ["SellerOrders"],
        }),
        getSellerShippedOrders: builder.query({
            query: () => ({
                url: `${SELLER_URL}/orders/shipped`,
                method: "GET",
            }),
            providesTags: ["SellerOrders"],
        }),
        getSellerOrderHistory: builder.query({
            query: () => ({
                url: `${SELLER_URL}/orders/history`,
                method: "GET",
            }),
            providesTags: ["SellerOrders"],
        }),
        getSellerDashboard: builder.query({
            query: () => ({
                url: `${SELLER_URL}/dashboard`,
                method: "GET"
            }),
        }),
        getSellerByRetryToken: builder.query({
            query: (token) => `${SELLER_URL}/retry/${token}`,
        }),
        updateRejectedSeller: builder.mutation({
            query: ({ token, data }) => ({
                url: `${SELLER_URL}/retry/${token}`,
                method: "PUT",
                body: data,
            }),
        }),
        sellerForgotPassword: builder.mutation({
            query: (data) => ({
                url: `${SELLER_URL}/forgot-password`,
                method: "POST",
                body: data,
            }),
        }),
        sellerResetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: `${SELLER_URL}/reset-password/${token}`,
                method: "POST",
                body: { password },
            }),
        }),
        sellerChangePassword: builder.mutation({
            query: (data) => ({
                url: `${SELLER_URL}/change-password`,
                method: "POST",
                body: data,
            }),
        }),
        // sellerProfile: builder.mutation({
        //     query: () => ({
        //         url: `${SELLER_URL}/profile`,
        //         method: "GET",
        //     }),
        // }),
        // sellerUpdateProfile: builder.mutation({
        //     query: (data) => ({
        //         url: `${SELLER_URL}/profile`,
        //         method: "PUT",
        //         body: data
        //     }),
        // }),
        sellerCreateContact: builder.mutation({
            query: (data) => ({
                url: `${SELLER_URL}/contact`,
                method: "POST",
                body: data,
            }),
        }),
        sellerUpdateContact: builder.mutation({
            query: ({ id, data }) => ({
                url: `${SELLER_URL}/contact/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        sellerDeleteContact: builder.mutation({
            query: (id) => ({
                url: `${SELLER_URL}/contact/${id}`,
                method: "DELETE",
            }),
        }),
        sellerGetContact: builder.query({
            query: (id) => `${SELLER_URL}/contact/${id}`,
        }),
        // sellerGetUserAllContact: builder.mutation({
        //     query: () => ({
        //         url: `${SELLER_URL}/contact/user/${id}`,
        //         method: "GET",
        //     }),
        // }),
        sellerGetAllContacts: builder.query({
            query: () => `${SELLER_URL}/contact`,
        }),
    }),
});

export const {
    useSellerRegisterMutation,
    useSellerLoginMutation,
    useSellerProfileQuery,
    useSellerUpdateUserMutation,
    useSellerDeleteUserMutation,
    useUploadMediaMutation,
    useGetAllSellerQuery,
    useGetSpecificSellerQuery,
    useSellerLogoutMutation,
    useShipOrderItemMutation,
    useConfirmOrderItemMutation,
    useDeliveredOrderItemMutation,
    useGetSellerPlacedOrdersQuery,
    useGetSellerPendingOrdersQuery,
    useGetSellerShippedOrdersQuery,
    useGetSellerOrderHistoryQuery,
    useGetSellerDashboardQuery,
    useGetSellerByRetryTokenQuery,
    useUpdateRejectedSellerMutation,
    useSellerForgotPasswordMutation,
    useSellerResetPasswordMutation,
    useSellerChangePasswordMutation,

    // useSellerProfileMutation,
    // useSellerUpdateProfileMutation,
    useSellerCreateContactMutation,
    useSellerUpdateContactMutation,
    useSellerDeleteContactMutation,
    useSellerGetContactQuery,
    // useSellerGetUserAllContactMutation,
    useSellerGetAllContactsQuery,
} = users;
