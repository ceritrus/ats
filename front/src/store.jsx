import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./utils/UserSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});
