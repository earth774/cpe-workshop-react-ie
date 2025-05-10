import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "../../types";
import { RootState } from "../index";

interface TransactionsState {
  transactions: Transaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  status: "idle",
  error: null,
};

export const fetchTransactions = createAsyncThunk<
  Transaction[],
  void,
  { state: RootState }
>("transactions/fetchTransactions", async (_, { getState }) => {
  const { auth } = getState();
  if (!auth.currentUser) return [];

  const userId = auth.currentUser.id;
  const storageKey = `transactions-${userId}`;
  const saved = localStorage.getItem(storageKey);

  if (saved) {
    return JSON.parse(saved) as Transaction[];
  } else {
    const demoTransactions = generateDemoTransactions();
    localStorage.setItem(storageKey, JSON.stringify(demoTransactions));
    return demoTransactions;
  }
});

const generateDemoTransactions = (): Transaction[] => {
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  return [
    {
      id: "1",
      type: "income",
      amount: 15000,
      category: "เงินเดือน",
      date: new Date(today.getTime() - oneDay * 2).toISOString(),
      description: "เงินเดือนเดือนนี้",
      createdAt: new Date(today.getTime() - oneDay * 2).toISOString(),
    },
    {
      id: "2",
      type: "expense",
      amount: 2500,
      category: "ค่าเช่า",
      date: new Date(today.getTime() - oneDay * 3).toISOString(),
      description: "ค่าเช่าห้องประจำเดือน",
      createdAt: new Date(today.getTime() - oneDay * 3).toISOString(),
    },
    {
      id: "3",
      type: "expense",
      amount: 500,
      category: "อาหาร",
      date: new Date(today.getTime() - oneDay * 1).toISOString(),
      description: "มื้อกลางวัน",
      createdAt: new Date(today.getTime() - oneDay * 1).toISOString(),
    },
    {
      id: "4",
      type: "income",
      amount: 3000,
      category: "งานพิเศษ",
      date: new Date(today.getTime()).toISOString(),
      description: "งานฟรีแลนซ์",
      createdAt: new Date(today.getTime()).toISOString(),
    },
    {
      id: "5",
      type: "expense",
      amount: 1500,
      category: "ค่าน้ำค่าไฟ",
      date: new Date(today.getTime() - oneDay * 4).toISOString(),
      description: "ค่าน้ำค่าไฟเดือนนี้",
      createdAt: new Date(today.getTime() - oneDay * 4).toISOString(),
    },
    {
      id: "6",
      type: "expense",
      amount: 300,
      category: "ความบันเทิง",
      date: new Date(today.getTime() - oneDay * 2).toISOString(),
      description: "ดูหนัง",
      createdAt: new Date(today.getTime() - oneDay * 2).toISOString(),
    },
    {
      id: "7",
      type: "expense",
      amount: 800,
      category: "อาหาร",
      date: new Date(today.getTime() - oneDay * 1).toISOString(),
      description: "ซื้อของที่ซุปเปอร์มาร์เก็ต",
      createdAt: new Date(today.getTime() - oneDay * 1).toISOString(),
    },
    {
      id: "8",
      type: "income",
      amount: 500,
      category: "ของขวัญ",
      date: new Date(today.getTime() - oneDay * 5).toISOString(),
      description: "พ่อแม่ให้",
      createdAt: new Date(today.getTime() - oneDay * 5).toISOString(),
    },
    {
      id: "9",
      type: "expense",
      amount: 1200,
      category: "การเดินทาง",
      date: new Date(today.getTime() - oneDay * 6).toISOString(),
      description: "ค่าแท็กซี่",
      createdAt: new Date(today.getTime() - oneDay * 6).toISOString(),
    },
    {
      id: "10",
      type: "expense",
      amount: 2000,
      category: "ช้อปปิ้ง",
      date: new Date(today.getTime() - oneDay * 7).toISOString(),
      description: "ซื้อเสื้อใหม่",
      createdAt: new Date(today.getTime() - oneDay * 7).toISOString(),
    },
  ];
};

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

    return newTransaction;
  }
);

export const updateTransaction = createAsyncThunk<
  { id: string; updatedData: Partial<Transaction> },
  { id: string; updatedData: Partial<Transaction> },
  { state: RootState }
>(
  "transactions/updateTransaction",
  async ({ id, updatedData }, { getState }) => {
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
>("transactions/deleteTransaction", async (id, { getState }) => {
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

  return id;
});

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.status = "succeeded";
          state.transactions = action.payload;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
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

export default transactionsSlice.reducer;
