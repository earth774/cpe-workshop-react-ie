import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { Transaction, CategorySummary } from "../../types";

export const selectIncomeSummary = createSelector(
  (state: RootState) => state.transactions.transactions,
  (transactions: Transaction[]) =>
    transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
);

export const selectExpenseSummary = createSelector(
  (state: RootState) => state.transactions.transactions,
  (transactions: Transaction[]) =>
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
);

export const selectBalanceSummary = createSelector(
  selectIncomeSummary,
  selectExpenseSummary,
  (income, expense) => income - expense
);

export const selectCategorySummary = createSelector(
  (state: RootState) => state.transactions.transactions,
  (transactions: Transaction[]): CategorySummary[] => {
    const categories: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((transaction) => {
      const { category, amount, type } = transaction;

      if (!categories[category]) {
        categories[category] = {
          income: 0,
          expense: 0,
        };
      }

      categories[category][type] += amount;
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      ...data,
    }));
  }
);

export const selectRecentTransactions = createSelector(
  (state: RootState) => state.transactions.transactions,
  (_, limit: number = 5) => limit,
  (transactions, limit) =>
    [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
);

export const selectTransactionById = createSelector(
  (state: RootState) => state.transactions.transactions,
  (_, id: string) => id,
  (transactions, id) => transactions.find((t: any) => t.id === id)
);
