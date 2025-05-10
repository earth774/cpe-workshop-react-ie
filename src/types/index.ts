export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionFormData {
  type: "income" | "expense";
  amount: string;
  category: string;
  date: string;
  description: string;
}

export interface CategorySummary {
  name: string;
  income: number;
  expense: number;
}
