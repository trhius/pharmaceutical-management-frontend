import { API } from "../endpoints";
import { apiSlice, noAuthApiSlice } from "../apiSlice";

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllColors: builder.query({
      query: (params) => ({
        url: API.color,
        method: "GET",
        params
      }),
    }),
  }),
});

export const colorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getColors: builder.query({
      query: (params) => ({
        url: API.color,
        method: "GET",
        params
      }),
      providesTags: ['Color'],
    }),
    getColorDetail: builder.mutation({
      query: (id) => ({
        url: `${API.color}/${id}`,
        method: "GET"
      }),
    }),
    createColor: builder.mutation({
      query: (payload) => ({
        url: `${API.color}`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['Color'],
    }),
    deleteColor: builder.mutation({
      query: (id) => ({
        url: `${API.color}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Color'],
    }),
    updateColor: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.color}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Color'],
    }),
    deleteColors: builder.mutation({
      query: (ids) => ({
        url: `${API.color}/${ids.join()}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Color'],
    }),
  }),
});

export const { 
  useGetAllColorsQuery
} = noTokenApiSlice;

export const {
  useGetColorsQuery,
  useGetColorDetailMutation,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useDeleteColorsMutation
} = colorApiSlice;