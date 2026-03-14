import { apiSlice } from "./apiSlice";
import { Category_URL } from "../constants";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL CATEGORIES
    getallcategory: builder.query({
      query: (params) => ({
        url: `${Category_URL}?${params}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    // GET PARENT CATEGORIES
    getParentCategories: builder.query({
      query: () => ({
        url: `${Category_URL}/parents`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    // CREATE CATEGORY
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${Category_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // UPDATE CATEGORY
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Category_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // DELETE CATEGORY
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${Category_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // TOGGLE STATUS
    toggleCategoryStatus: builder.mutation({
      query: (id) => ({
        url: `${Category_URL}/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Category"],
    }),

    getCategoryById: builder.query({
      query: (id) => `${Category_URL}/${id}`,
    }),

  }),
});

export const {
  useGetallcategoryQuery,
  useGetParentCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useToggleCategoryStatusMutation,
  useGetCategoryByIdQuery,
} = categoryApi;