import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const API_URI = "http://localhost:8800/api";
const API_URI = import.meta.env.VITE_APP_BASE_URL;  

const baseQuery = fetchBaseQuery({
    baseUrl: API_URI +"/api",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState()?.auth?.user?.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => '/notifications',
            providesTags: ['Notification'],
        }),
        markNotificationAsRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PUT',
            }),
            invalidatesTags: ['Notification'],
        }),
        markAllNotificationsAsRead: builder.mutation({
            query: () => ({
                url: '/notifications/read-all',
                method: 'PUT',
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
} = apiSlice;
