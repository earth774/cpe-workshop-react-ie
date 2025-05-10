import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "../../types";
import { RootState } from "../index";
import { getDashboardData, getLedgers, deleteLedger } from "../../services/api";

export interface Ledger {
  id: number;
  ledger_category_id: number;
  user_id: number;
  remark: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  status_id: number;
  created_at: string;
  updated_at: string;
  ledger_category: {
    id: number;
    name: string;
    status_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TransactionsState {
  transactions: Transaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  dashboardData: {
    balance: number;
    income: number;
    expense: number;
    ledgerCategories: Array<{
      id: number;
      name: string;
      status_id: number;
      created_at: string;
      updated_at: string;
      balance: number;
    }>;
  } | null;

  ledgers: Ledger[];
  ledgerStatus: "idle" | "loading" | "succeeded" | "failed";
  ledgerError: string | null;
  paginationMeta: PaginationMeta;
}

const initialState: TransactionsState = {
  transactions: [],
  status: "idle",
  error: null,
  dashboardData: null,

  ledgers: [],
  ledgerStatus: "idle",
  ledgerError: null,
  paginationMeta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const fetchDashboardData = createAsyncThunk<
  any,
  { startDate?: string; endDate?: string },
  { state: RootState }
>("transactions/fetchDashboardData", async ({ startDate, endDate }, {}) => {
  const response = await getDashboardData(startDate, endDate);

  return response;
});

export const fetchLedgers = createAsyncThunk<
  { data: Ledger[]; meta: any },
  {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: string;
    search?: string;
    sortDirection?: "asc" | "desc";
  },
  { state: RootState }
>("transactions/fetchLedgers", async (params, {}) => {
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    type,
    search,
    sortDirection,
  } = params;

  const filters: any = {};
  if (endDate) filters.endDate = endDate;
  if (startDate) filters.startDate = startDate;
  if (type && type !== "all") filters.type = type.toUpperCase();
  if (search) filters.search = search;
  if (sortDirection) filters.sortDirection = sortDirection;

  const response = await getLedgers(page, limit, filters);

  return {
    data: response.data.data,
    meta: {
      total: response.data.meta.total,
      page: parseInt(response.data.meta.page),
      limit: parseInt(response.data.meta.limit),
      totalPages: response.data.meta.totalPages,
    },
  };
});

export const deleteLedgerItem = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("transactions/deleteLedgerItem", async (id, { dispatch, getState }) => {
  await deleteLedger(id);

  const { transactions } = getState();
  const { page, limit } = transactions.paginationMeta;

  dispatch(fetchLedgers({ page, limit }));

  dispatch(fetchDashboardData({}));

  return id;
});

export const addTransaction = createAsyncThunk<
  Transaction,
  Omit<Transaction, "id" | "createdAt">,
  { state: RootState }
>(
  "transactions/addTransaction",
  async (transaction, { getState, dispatch }) => {
    const { auth } = getState();
    if (!auth.currentUser) throw new Error("No authenticated user");

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transaction,
      createdAt: new Date().toISOString(),
    };

    const { transactions } = getState().transactions;
    const updatedTransactions = [newTransaction, ...transactions];

    const userId = auth.currentUser.id;
    localStorage.setItem(
      `transactions-${userId}`,
      JSON.stringify(updatedTransactions)
    );

    dispatch(fetchDashboardData({}));

    return newTransaction;
  }
);

export const updateTransaction = createAsyncThunk<
  { id: string; updatedData: Partial<Transaction> },
  { id: string; updatedData: Partial<Transaction> },
  { state: RootState }
>(
  "transactions/updateTransaction",
  async ({ id, updatedData }, { getState, dispatch }) => {
    const { auth } = getState();
    if (!auth.currentUser) throw new Error("No authenticated user");

    const { transactions } = getState().transactions;
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === id
        ? {
            ...transaction,
            ...updatedData,
            updatedAt: new Date().toISOString(),
          }
        : transaction
    );

    const userId = auth.currentUser.id;
    localStorage.setItem(
      `transactions-${userId}`,
      JSON.stringify(updatedTransactions)
    );

    dispatch(fetchDashboardData({}));

    return {
      id,
      updatedData: { ...updatedData, updatedAt: new Date().toISOString() },
    };
  }
);

export const deleteTransaction = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("transactions/deleteTransaction", async (id, { getState, dispatch }) => {
  const { auth } = getState();
  if (!auth.currentUser) throw new Error("No authenticated user");

  const { transactions } = getState().transactions;
  const updatedTransactions = transactions.filter(
    (transaction) => transaction.id !== id
  );

  const userId = auth.currentUser.id;
  localStorage.setItem(
    `transactions-${userId}`,
    JSON.stringify(updatedTransactions)
  );

  dispatch(fetchDashboardData({}));

  return id;
});

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload.data;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(fetchLedgers.pending, (state) => {
        state.ledgerStatus = "loading";
      })
      .addCase(fetchLedgers.fulfilled, (state, action) => {
        state.ledgerStatus = "succeeded";
        state.ledgers = action.payload.data;
        state.paginationMeta = action.payload.meta;
      })
      .addCase(fetchLedgers.rejected, (state, action) => {
        state.ledgerStatus = "failed";
        state.ledgerError = action.error.message || null;
      })
      .addCase(deleteLedgerItem.pending, (state) => {
        state.ledgerStatus = "loading";
      })
      .addCase(deleteLedgerItem.fulfilled, (state, _) => {
        state.ledgerStatus = "succeeded";
      })
      .addCase(deleteLedgerItem.rejected, (state, action) => {
        state.ledgerStatus = "failed";
        state.ledgerError = action.error.message || null;
      })
      .addCase(
        addTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.transactions.unshift(action.payload);
        }
      )
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const index = state.transactions.findIndex((t) => t.id === id);
        if (index !== -1) {
          state.transactions[index] = {
            ...state.transactions[index],
            ...updatedData,
          };
        }
      })
      .addCase(
        deleteTransaction.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.transactions = state.transactions.filter(
            (t) => t.id !== action.payload
          );
        }
      );
  },
});

export const selectDashboardData = (state: RootState) =>
  state.transactions.dashboardData;
export const selectDashboardBalance = (state: RootState) =>
  state.transactions.dashboardData?.balance || 0;
export const selectDashboardIncome = (state: RootState) =>
  state.transactions.dashboardData?.income || 0;
export const selectDashboardExpense = (state: RootState) =>
  state.transactions.dashboardData?.expense || 0;
export const selectDashboardCategories = (state: RootState) =>
  state.transactions.dashboardData?.ledgerCategories || [];

export const selectLedgers = (state: RootState) => state.transactions.ledgers;
export const selectLedgerStatus = (state: RootState) =>
  state.transactions.ledgerStatus;
export const selectPaginationMeta = (state: RootState) =>
  state.transactions.paginationMeta;

export default transactionsSlice.reducer;
