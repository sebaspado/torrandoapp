export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  name: string;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
} 