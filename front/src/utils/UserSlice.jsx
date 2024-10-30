import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    name: null,
    email: null,
    role: null,
    role_id: null,
  },
  reducers: {
    setID: (state, action) => {
      state.id = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setRoleID: (state, action) => {
      state.role_id = action.payload;
    },
  },
});

export const { setID, setName, setEmail, setRole, setRoleID } =
  userSlice.actions;
export default userSlice.reducer;
