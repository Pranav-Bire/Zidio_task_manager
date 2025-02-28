import { trashTask } from "../../../../../server/controllers/taskController";
import { apiSlice } from "../apiSlice";

const TASKS_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: ()=>({
        url: `${TASKS_URL}/dashboard`,
        method: 'GET',
        credentials: "include",
      }),
    }),
    getAllTask: builder.query({
      query: ({strQuery, isTrashed, search})=>({
        url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
        method: 'GET',
        credentials: "include",
      }),
    }),

    createTask: builder.mutation({
      query: (data)=>({
        url: `${TASKS_URL}/create`,
        method: 'POST',
        credentials: "include",
        body: data,
      }),
    }),

    duplicateTask: builder.mutation({
      query: ({ id }) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: 'POST',
        body: {},
        credentials: "include",
      }),
    }),

    updateTask: builder.mutation({
      query: (data)=>({
        url: `${TASKS_URL}/update/${data._id}`,
        method: 'PUT',
        body: data,
        credentials: "include",
      }),
    }),

    trashTask: builder.mutation({
      query: ({id})=>({
        url: `${TASKS_URL}/trash/${id}`,
        method: 'PUT',
        credentials: "include",
      }),
    }),

    createSubTask: builder.mutation({
      query: ({data, id})=>({
        url: `${TASKS_URL}/create-subtask/${id}`,
        method: 'PUT',
        body: data,
        credentials: "include",
      }),
    }),
    
    getNotifications: builder.query({
      query: () => ({
          url: '/notifications',
          headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache', 
              'Expires': '0'
          }
      }),
      providesTags: ['Notification']
  }),


  getSingleTask: builder.query({
    query: (id)=>({
      url: `${TASKS_URL}/${id}`,
      method: 'GET',
      credentials: "include",
    }),
    providesTags: ['Notification']
  }),


  postTaskActivity: builder.mutation({
    query: ({id, data})=>({
      url: `${TASKS_URL}/activity/${id}`,
      method: 'PUT',
      body: data,
      credentials: "include",
    }),
    invalidatesTags: ['Task'],
  }),
    
  deleteRestoreTask: builder.mutation({
    query: ({id, actionType}) => ({
      url: `${TASKS_URL}/delete-restore/${id}`,
      method: 'PUT',
      body: { actionType },
      credentials: "include",
    }),
  }),

  }),
});

export const { useGetDashboardStatsQuery, 
  useGetAllTaskQuery, 
  useCreateTaskMutation, 
  useDuplicateTaskMutation, 
  useUpdateTaskMutation,
  useTrashTaskMutation,
  useCreateSubTaskMutation,
  useGetNotificationsQuery,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
  useDeleteRestoreTaskMutation,
 } = taskApiSlice;