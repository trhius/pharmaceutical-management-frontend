import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CONFIG } from 'src/config-global';

import { API_AUTH } from './endpoints';
import { logout, setCredentials } from './auth/authSlice';

const BASE_URL = CONFIG.beBaseUrl;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }: any) => {
    const { accessToken } = getState().auth;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithNoAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  const state = api.getState();

  if (result.error?.status === 401) {
    const refreshResult = await baseQueryWithNoAuth(
      {
        url: API_AUTH.refreshToken,
        method: 'POST',
        body: {
          refreshToken: state.auth.refreshToken,
        },
      },
      api,
      extraOptions
    );

    if (!refreshResult.error && refreshResult.data) {
      const refreshData = refreshResult.data as {
        data: { accessToken: string; refreshToken: string };
      };
      const { accessToken, refreshToken } = refreshData.data;
      if (accessToken) {
        api.dispatch(setCredentials({ accessToken, refreshToken }));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

const tags = ['User', 'Product', 'Category', 'Color', 'Order', 'OrderDetail', 'Address'];

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  tagTypes: tags,
  endpoints: (builder) => ({}),
});

export const noAuthApiSlice = createApi({
  reducerPath: 'noAuthApi',
  baseQuery: baseQueryWithNoAuth,
  refetchOnMountOrArgChange: true,
  tagTypes: tags,
  endpoints: (builder) => ({}),
});
