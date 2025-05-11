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

const transactionsSlice = createSlice({
    name: "transaction", initialState, reducers: {}, extraReducers: (builder) => {
        builder.addCase(fetchDashboardData.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchDashboardData.fulfilled, (state,action) => {
            state.status = "succeeded";
            state.dashboardData = action.payload.data;
        })
    },
})

export default transactionsSlice.reducer;