import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Transaction } from '@/types/finance';

export const useFinanceManager = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      try {
        const storedTransactions = localStorage.getItem(`finances_${session.user.email}`);
        if (storedTransactions) {
          const parsed = JSON.parse(storedTransactions);
          // Convert string dates back to Date objects
          setTransactions(parsed.map((t: any) => ({
            ...t,
            date: new Date(t.date),
            createdAt: new Date(t.createdAt)
          })));
        }
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    }
  }, [session]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => {
      const updated = [...prev, transaction];
      if (session?.user?.email) {
        localStorage.setItem(`finances_${session.user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    setTransactions(prev => {
      const updatedTransactions = prev.map(transaction =>
        transaction.id === transactionId
          ? { ...transaction, ...updates, updatedAt: new Date() }
          : transaction
      );
      if (session?.user?.email) {
        localStorage.setItem(`finances_${session.user.email}`, JSON.stringify(updatedTransactions));
      }
      return updatedTransactions;
    });
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== transactionId);
      if (session?.user?.email) {
        localStorage.setItem(`finances_${session.user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'INCOME' 
        ? acc + curr.amount 
        : acc - curr.amount;
    }, 0);
  };

  const getIncomes = () => transactions.filter(t => t.type === 'INCOME');
  const getExpenses = () => transactions.filter(t => t.type === 'EXPENSE');

  const getIncomeForMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-').map(Number);
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'INCOME' &&
          date.getFullYear() === year &&
          date.getMonth() === month - 1;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
    getIncomes,
    getExpenses,
    getIncomeForMonth
  };
}; 