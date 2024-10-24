import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    name: null,
    email: null,
    role: null,
  },
  reducers: {
    setID: (state, action) => {
      state.id = action.payload;
      //   console.log("ID:", action.payload);
    },
    setName: (state, action) => {
      state.name = action.payload;
      //   console.log("Name:", action.payload);
    },
    setEmail: (state, action) => {
      state.email = action.payload;
      //   console.log("Email:", action.payload);
    },
    setRole: (state, action) => {
      state.role = action.payload;
      //   console.log("Role:", action.payload);
    },
  },
});

export const { setID, setName, setEmail, setRole } = userSlice.actions;
export default userSlice.reducer;
