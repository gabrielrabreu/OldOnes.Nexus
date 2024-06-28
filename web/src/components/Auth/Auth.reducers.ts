import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { login } from "./Auth.thunks";

interface State {
  loading: boolean;
  isAuthenticated: boolean;
  user: IUser | undefined;
  error: string | undefined;
}

const initialState: State = {
  loading: false,
  isAuthenticated: true,
  user: {
    id: "1",
    username: "John Doe",
    email: "johndoe@gmail.com",
    avatarUrl: "https://i.pinimg.com/originals/dc/28/a7/dc28a77f18bfc9aaa51c3f61080edda5.jpg",
    accessToken: "5efb5f8a-212b-4b22-a201-ba2958005342",
    darkMode: false,
  },
  error: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: PayloadAction<IUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = undefined;
      localStorage.removeItem("user");
    },
    loadFromStorage: (state) => {
      const userJson = localStorage.getItem("user") ?? "{}";
      const user = JSON.parse(userJson) as IUser;
      if (user) {
        state.isAuthenticated = true;
        state.user = user;
      }
    },
    setDarkModePrefer: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.darkMode = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { logout, loadFromStorage, setDarkModePrefer } = authSlice.actions;

export default authSlice.reducer;
