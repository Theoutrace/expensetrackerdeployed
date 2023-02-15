import { createSlice } from "@reduxjs/toolkit";

const ExpenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    leaderboard: [],
    version: [],
    pagination: {},
    page: 1,
    perPage: 3,
  },
  reducers: {
    addExpense(state, action) {
      state.expenses = action.payload;
    },
    addLeaderboard(state, action) {
      state.leaderboard = action.payload;
    },

    addVersion(state, action) {
      state.version = action.payload;
    },

    getPagination(state, action) {
      state.pagination = action.payload;
    },
    getpage(state, action) {
      state.page = action.payload;
    },
    getPerPage(state, action) {
      state.perPage = action.payload;
    },
  },
});

export const ExpenseActions = ExpenseSlice.actions;
export default ExpenseSlice.reducer;
