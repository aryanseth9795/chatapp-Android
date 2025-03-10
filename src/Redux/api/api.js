import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import serverUrl from "../../constants/config";

export const apiSlice = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({ baseUrl: `${serverUrl}` }),
  tagTypes: ["Chats", "User", "Messages", "GrpDetail", "del"],
  endpoints: (builder) => ({
    // chat list fetch
    mychatList: builder.query({
      query: () => ({ url: "/chats/mychats", credentials: "include" }),
    providesTags: ["Chats"],
    }),

    // searching user
    searchUser: builder.query({
      query: (name) => ({
        url: `/users/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    // friend Request Send
    friendRequestSend: builder.mutation({
      query: (data) => ({
        url: "/users/sendrequest",
        credentials: "include",
        method: "Put",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),


    // friend Request Accept
    friendRequestAcceptor: builder.mutation({
      query: (data) => ({
        url: "/users/acceptrequest",
        credentials: "include",
        method: "Put",
        body: data,
      }),
      invalidatesTags: ["Chats"],
    }),
    // Get Notification
    getNotification: builder.query({
      query: () => ({
        url: `/users/getnotification`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    

    // fetching Chat details
    chatDetails: builder.query({
      query: ({ chatId }) => {
        let url = `/chats/${chatId}`;
        return { url, credentials: "include" };
      },
      providesTags: ["Chats"],
      // keepUnusedDataFor:300,
    }),

    // fetching messages of a User
    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `/chats/message/${chatId}?page=${page}`,
        credentials: "include",
      }),
      invalidatesTags:["Chats"]
    }),

    // Send Attachments
    sendattachements: builder.mutation({
      query: (files) => ({
        url: "/chats/message/attachment",
        body: files,
        method: "Post",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    // Updating Profile Users
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update",
        method: "Put",
        body: data,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    // Get members for Add in Groups
    getMembersforAddinGroups: builder.query({
      query: () => ({
        url: `/chats/membersforgroups`,
        credentials: "include",
      }),
      invalidatesTags: ["Chats"],
    }),

    // now creating new group

    creategroup: builder.mutation({
      query: (body) => ({
        url: "/chats/newgroup",
        body,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Chats"],
    }),

    myGroups: builder.query({
      query: () => ({
        url: "/chats/mygroups",
        credentials: "include",
      }),
      providesTags: ["Chats"],
    }),

    GroupDetails: builder.query({
      query: (id) => ({
        url: `/chats/grpdetail/${id}`,
        credentials: "include",
      }),

      providesTags: ["GrpDetail"],
    }),
    addMembersListInGrp: builder.query({
      query: (id) => ({
        url: `/chats/membersforadd/${id}`,
        credentials: "include",
      }),

      keepUnusedDataFor: 0,
    }),

    addingroup: builder.mutation({
      query: (body) => ({
        url: "/chats/addmembers",
        body,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["GrpDetail"],
    }),
    Removeingroup: builder.mutation({
      query: (body) => ({
        url: "/chats/removemember",
        body,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["GrpDetail"],
    }),
    Deletegroup: builder.mutation({
      query: (body) => ({
        url: "/chats/deletegrp",
        body,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["GrpDetail", "Chats", "del"],
    }),

    Renamegroup: builder.mutation({
      query: (body) => ({
        url: "/chats/renamegrp",
        body,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["GrpDetail", "Chats"],
    }),
    deleteChat: builder.mutation({
      query: (body) => ({
        url: "/chats/deletechat",
        body,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags:["Chats","User"]
    }),
  }),
});

// Export hooks for usage in components
export const {
  useMychatListQuery,
  useLazySearchUserQuery,
  useFriendRequestSendMutation,
  useGetNotificationQuery,
  useFriendRequestAcceptorMutation,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useSendattachementsMutation,
  useUpdateProfileMutation,
  useGetMembersforAddinGroupsQuery,
  useCreategroupMutation,
  useMyGroupsQuery,
  useGroupDetailsQuery,
  useAddMembersListInGrpQuery,
  useAddingroupMutation,
  useRemoveingroupMutation,
  useDeletegroupMutation,
  useRenamegroupMutation,
  useDeleteChatMutation,

} = apiSlice;
