// src/redux/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL, // Teraz jest pusty
    prepareHeaders: (headers, { getState }) => {
      const userInfo = getState().auth.userInfo;
      if (userInfo && userInfo.token) {
        headers.set("authorization", `Bearer ${userInfo.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category", "Product", "User", "Order"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
