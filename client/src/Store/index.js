import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth-reducer";
import expenseReducer from "./reducers/expense-reducer";

const Store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
  },
});

export default Store;
