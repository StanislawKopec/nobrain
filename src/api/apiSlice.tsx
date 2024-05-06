import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildQueries } from "@testing-library/react";
import { BASE_URL } from "../config";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getNodes: builder.query({
      query: () => `${BASE_URL}/api/Nodes`,
    }),
    getNotesOfNode: builder.query({
        query: (id:number) => `${BASE_URL}/api/Nodes/${id}`
    }),
    editNotesOfNode: builder.query<any, { id: number; notes: string }>({
      query: ({id, notes}) => `${BASE_URL}/api/Nodes?notes=${notes}&id=${id}`
    })
  }),
});

export const {
  useGetNodesQuery,
  useGetNotesOfNodeQuery,
  useEditNotesOfNodeQuery
} = apiSlice;
