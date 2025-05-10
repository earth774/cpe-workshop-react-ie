export interface User {
  id: number;
  status_id: number;
  google_id?: string | null;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
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
