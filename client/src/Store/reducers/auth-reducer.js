import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: { email: null, login: false, ispremiumuser: false },
  reducers: {
    login(state, action) {
      state.email = action.payload.email;
      state.login = true;
      state.ispremiumuser = action.payload.ispremiumuser;
    },

    logout(state) {
      state.email = null;
      state.login = false;
      state.ispremiumuser = null;
    },
  },
});

export const AuthActions = AuthSlice.actions;
export default AuthSlice.reducer;
