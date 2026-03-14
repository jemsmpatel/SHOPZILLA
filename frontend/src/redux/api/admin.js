import { apiSlice } from './apiSlice';
import { Admin_URL } from '../constants';

export const admin = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminRegister: builder.mutation({
            query: (data) => ({
                url: `${Admin_URL}/`,
                method: "POST",
                body: data,
            }),
        }),
        adminLogin: builder.mutation({
            query: (data) => ({
                url: `${Admin_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),
        adminProfile: builder.query({
            query: () => ({
                url: `${Admin_URL}/profile`
            }),
        }),
        adminUpdateUser: builder.mutation({
            query: (data) => ({
                url: `${Admin_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        adminDeleteUser: builder.mutation({
            query: (id) => ({
                url: `${Admin_URL}/${id}`,
                method: "DELETE",
            }),
        }),
        adminLogout: builder.mutation({
            query: () => ({
                url: `${Admin_URL}/logout`,
                method: "POST",
            }),
        }),
        adminAllProductes: builder.query({
            query: (params) => ({
                url: `${Admin_URL}/products?${params}`
            }),
        }),
        toggleProductStatus: builder.mutation({
            query: (id) => ({
                url: `/products/${id}/status`,
                method: "PUT",
            }),
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/product/${id}`,
                method: "DELETE",
            }),
        }),
        admingetallUsers: builder.query({
            query: () => ({
                url: `${Admin_URL}/user`
            })
        }),
        admingetAllSellers: builder.query({
            query: () => ({
                url: `${Admin_URL}/seller`
            }),
            providesTags: ["Sellers"],
        }),
        getSellerById: builder.query({
            query: (id) => `${Admin_URL}/seller/${id}`,
            providesTags: ["Sellers"],
        }),
        approveSeller: builder.mutation({
            query: (id) => ({
                url: `${Admin_URL}/seller/${id}/approve`,
                method: "PUT",
            }),
            invalidatesTags: ["Sellers"],
        }),
        rejectSeller: builder.mutation({
            query: ({ id, reason }) => ({
                url: `${Admin_URL}/seller/${id}/reject`,
                method: "PUT",
                body: { reason },
            }),
            invalidatesTags: ["Sellers"],
        }),
        toggleSellerStatus: builder.mutation({
            query: (id) => ({
                url: `${Admin_URL}/seller/toggle/${id}`,
                method: "PATCH",
            }),
        }),
        getAdmins: builder.query({
            query: () => `${Admin_URL}`,
        }),
        createAdmin: builder.mutation({
            query: (data) => ({
                url: `${Admin_URL}`,
                method: "POST",
                body: data,
            }),
        }),
        toggleAdminStatus: builder.mutation({
            query: (id) => ({
                url: `${Admin_URL}/${id}/status`,
                method: "PUT",
            }),
        }),
        deleteAdmin: builder.mutation({
            query: (id) => ({
                url: `${Admin_URL}/${id}`,
                method: "DELETE",
            }),
        }),
        admingetPlacedOrders: builder.query({
            query: () => `${Admin_URL}/orders/placed`,
            providesTags: ["Orders"],
        }),
        adminconfirmOrderItem: builder.mutation({
            query: (item_id) => ({
                url: `${Admin_URL}/orders/confirm/${item_id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Orders"],
        }),
        adminshipOrderItem: builder.mutation({
            query: (item_id) => ({
                url: `${Admin_URL}/orders/ship/${item_id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Orders"],
        }),
        adminmarkItemDelivered: builder.mutation({
            query: (item_id) => ({
                url: `${Admin_URL}/orders/deliver/${item_id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Orders"],
        }),
        admingetShippedOrders: builder.query({
            query: () => `${Admin_URL}/orders/shipped`,
            providesTags: ["Orders"],
        }),
        admingetOrderHistory: builder.query({
            query: () => `${Admin_URL}/orders/history`,
            providesTags: ["Orders"],
        }),
        admingetPendingOrders: builder.query({
            query: () => `${Admin_URL}/orders/pending`,
            providesTags: ["Orders"],
        }),
        getDashboardStats: builder.query({
            query: () => `${Admin_URL}/dashboard`,
        }),
        adminForgotPassword: builder.mutation({
            query: (data) => ({
                url: `${Admin_URL}/forgot-password`,
                method: "POST",
                body: data,
            }),
        }),
        adminResetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: `${Admin_URL}/reset-password/${token}`,
                method: "PUT",
                body: { password },
            }),
        }),
        adminChangePassword: builder.mutation({
            query: (data) => ({
                url: `${Admin_URL}/change-password`,
                method: "PUT",
                body: data,
            }),
        }),
        adminproductcreate: builder.mutation({
            query: (data) => ({
                url: `${Admin_URL}/products`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useAdminRegisterMutation,
    useAdminLoginMutation,
    useAdminProfileQuery,
    useAdminUpdateUserMutation,
    useAdminDeleteUserMutation,
    useAdminLogoutMutation,
    useAdminAllProductesQuery,
    useToggleProductStatusMutation,
    useDeleteProductMutation,
    useAdmingetallUsersQuery,
    useAdmingetAllSellersQuery,
    useGetSellerByIdQuery,
    useApproveSellerMutation,
    useRejectSellerMutation,
    useToggleSellerStatusMutation,
    useGetAdminsQuery,
    useCreateAdminMutation,
    useDeleteAdminMutation,
    useToggleAdminStatusMutation,
    useAdmingetPlacedOrdersQuery,
    useAdminconfirmOrderItemMutation,
    useAdminshipOrderItemMutation,
    useAdminmarkItemDeliveredMutation,
    useAdmingetShippedOrdersQuery,
    useAdmingetOrderHistoryQuery,
    useAdmingetPendingOrdersQuery,
    useGetDashboardStatsQuery,
    useAdminForgotPasswordMutation,
    useAdminResetPasswordMutation,
    useAdminChangePasswordMutation,
    useAdminproductcreateMutation,
} = admin;