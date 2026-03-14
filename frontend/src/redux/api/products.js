import { apiSlice } from './apiSlice.js';
import { ORDER_URL, PRODUCT_URL, USER_URL } from '../constants.js';


export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCT_URL}/`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Products"],
        }),
        updateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `${PRODUCT_URL}/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Products"],
        }),
        toggleProductStatus: builder.mutation({
            query: (id) => ({
                url: `${PRODUCT_URL}/${id}/toggle`,
                method: "PUT",
            }),
            invalidatesTags: ["Products"],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `${PRODUCT_URL}/${id}/delete`,
                method: "PUT",
            }),
            invalidatesTags: ["Products"],
        }),
        getSellerAllProducts: builder.query({
            query: (params) => `${PRODUCT_URL}/seller/products${params}`,
            providesTags: ["Products"],
        }),
        getSpecificProduct: builder.query({
            query: (id) => `${PRODUCT_URL}/${id}`,
            providesTags: ["Products"],
        }),
        getAllProducts: builder.query({
            query: (params) => `${PRODUCT_URL}/${params}`,
            providesTags: ["Products"],
        }),
        getListProducts: builder.mutation({
            query: (data) => ({
                url: `${PRODUCT_URL}/list`,
                method: "POST",
                body: data
            }),
        }),
        getSearchedStringProducts: builder.query({
            query: (str) => `${PRODUCT_URL}/search/${str}`
        }),
        createProductReview: builder.mutation({
            query: ({ id, rating, comment }) => ({
                url: `${PRODUCT_URL}/review/${id}`,
                method: "POST",
                body: {
                    rating,
                    comment,
                },
            }),
            invalidatesTags: ["Reviews", "Products"]
        }),
        updateProductReview: builder.mutation({
            query: ({ id, rating, comment }) => ({
                url: `${PRODUCT_URL}/review/${id}`,
                method: "PUT",
                body: { rating, comment }
            }),
            invalidatesTags: ["Reviews", "Products"]
        }),
        deleteProductReview: builder.mutation({
            query: (id) => ({
                url: `${PRODUCT_URL}/review/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Reviews", "Products"]
        }),
        getUserReviews: builder.query({
            query: () => ({
                url: `${USER_URL}/reviews`,
            }),
            providesTags: ["Reviews", "Products"]
        }),
        createOrder: builder.mutation({
            query: (data) => ({
                url: `${ORDER_URL}/place-order`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Cart", "Order", "SellerOrders"],
        }),
        cancelOrder: builder.mutation({
            query: (id) => ({
                url: `${ORDER_URL}/cancel/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Order", "SellerOrders"]
        }),
        getAllOrders: builder.query({
            query: () => `${ORDER_URL}`,
            providesTags: ["Order"]
        }),
        getSpecificOrder: builder.query({
            query: (id) => `${ORDER_URL}/${id}`,
            providesTags: ["Order"]
        }),
        getUserAllOrders: builder.query({
            query: (id) => `${PRODUCT_URL}/order/user/${id}`
        }),
        getSellerActiveOrders: builder.query({
            query: (id) => `${PRODUCT_URL}/order/seller/${id}`,
        }),
        getSellerSoldOrders: builder.query({
            query: (id) => `${PRODUCT_URL}/order/seller/sold/${id}`,
        }),
        createRazorpayOrder: builder.mutation({
            query: (data) => ({
                url: `${ORDER_URL}/create-payment-order`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});


export const {
    useCreateProductMutation,
    useUpdateProductMutation,
    useToggleProductStatusMutation,
    useDeleteProductMutation,
    useGetSellerAllProductsQuery,
    useGetSpecificProductQuery,
    useGetAllProductsQuery,
    useGetListProductsMutation,
    useGetSearchedStringProductsQuery,
    useCreateProductReviewMutation,
    useUpdateProductReviewMutation,
    useDeleteProductReviewMutation,
    useGetUserReviewsQuery,


    useCreateOrderMutation,
    useCancelOrderMutation,
    useGetAllOrdersQuery,
    useGetSpecificOrderQuery,
    useGetUserAllOrdersQuery,
    useGetSellerActiveOrdersQuery,
    useGetSellerSoldOrdersQuery,
    useCreateRazorpayOrderMutation,
} = productsApiSlice;