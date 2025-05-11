import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getDashboardData, getLedgers, deleteLedger } from "../../services/api";
import { Transaction } from "../../types/index";
import { RootState } from "../index";

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
>("transactions/fetchDashboardData", async ({ startDate, endDate }, { }) => {
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
  } = params;

  const filters: any = {};
  if (endDate) filters.endDate = endDate;
  if (startDate) filters.startDate = startDate;
  if (type && type !== "all") filters.type = type.toUpperCase();
  if (search) filters.search = search;

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

const transactionsSlice = createSlice({
    name: "transaction", initialState, reducers: {}, extraReducers: (builder) => {
        builder.addCase(fetchDashboardData.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchDashboardData.fulfilled, (state,action) => {
            state.status = "succeeded";
            state.dashboardData = action.payload.data;
        })
        .addCase(fetchLedgers.fulfilled,(state,action)=>{
            state.ledgers = action.payload.data;
        })
    },
})

export default transactionsSlice.reducer;