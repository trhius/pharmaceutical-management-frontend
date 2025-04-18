import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: ({ formData }) => ({
        url: `${API.file}/upload`,
        method: 'POST',
        body: formData,
        formData: true
      }),
    }),
  }),
});

export const { useUploadFileMutation } = authApiSlice;
