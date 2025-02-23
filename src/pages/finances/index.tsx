import React, { useState } from 'react';
import { Transaction, TransactionType } from '@/types/finance';
import ProtectedLayout from '@/components/ProtectedLayout/ProtectedLayout';
import { Modal } from '@/components/Modal/Modal';
import TransactionForm from '@/components/TransactionForm/TransactionForm';
import { useFinanceManager } from '@/hooks/useFinanceManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faPencilAlt, faShoppingCart, faMinus } from '@fortawesome/free-solid-svg-icons';
import styles from './Finances.module.scss';
import { useProductManager } from '@/hooks/useProductManager';
import SalesForm from '@/components/SalesForm/SalesForm';
import ExpenseForm from '@/components/ExpenseForm/ExpenseForm';
import FinanceChart from '@/components/FinanceChart/FinanceChart';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';

export default function FinancesPage() {
  const { 
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
    getIncomes,
    getExpenses
  } = useFinanceManager();

  const { products, updateProduct } = useProductManager();

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSaleModalOpen, setSaleModalOpen] = useState(false);
  const [isQuickExpenseModalOpen, setQuickExpenseModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = (type: TransactionType) => (data: any) => {
    const newTransaction: Transaction = {
      id: `transaction_${Date.now()}`,
      type,
      name: data.name,
      amount: Number(data.amount),
      date: new Date(data.date),
      description: data.description,
      createdAt: new Date()
    };

    addTransaction(newTransaction);
    type === 'INCOME' ? setIsIncomeModalOpen(false) : setIsExpenseModalOpen(false);
  };

  const handleEditTransaction = (data: any) => {
    if (!editingTransaction) return;

    updateTransaction(editingTransaction.id, {
      name: data.name,
      amount: Number(data.amount),
      date: new Date(data.date),
      description: data.description
    });
    setEditingTransaction(null);
  };

  const handleSale = (data: any) => {
    const product = products.find(p => p.id === data.productId);
    if (!product) return;

    updateProduct(data.productId, {
      stock: product.stock - data.quantity
    });

    const newTransaction: Transaction = {
      id: `transaction_${Date.now()}`,
      type: 'INCOME',
      name: `Venta: ${product.name} (x${data.quantity})`,
      amount: data.total,
      date: new Date(),
      description: `Venta de ${data.quantity} unidad(es) de ${product.name}`,
      createdAt: new Date()
    };

    addTransaction(newTransaction);
    setSaleModalOpen(false);
  };

  const handleQuickExpense = (data: any) => {
    const newTransaction: Transaction = {
      id: `transaction_${Date.now()}`,
      type: 'EXPENSE',
      name: data.name,
      amount: Number(data.amount),
      date: new Date(),
      createdAt: new Date()
    };

    addTransaction(newTransaction);
    setQuickExpenseModalOpen(false);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const confirmDelete = () => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <ProtectedLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Finanzas</h1>
          <div className={styles.actions}>
            <button 
              className={styles.saleButton}
              onClick={() => setSaleModalOpen(true)}
            >
              <FontAwesomeIcon icon={faShoppingCart} /> Registrar Venta
            </button>
            <button 
              className={styles.quickExpenseButton}
              onClick={() => setQuickExpenseModalOpen(true)}
            >
              <FontAwesomeIcon icon={faMinus} /> Gasto Rápido
            </button>
            <button 
              className={styles.incomeButton}
              onClick={() => setIsIncomeModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar Ingreso
            </button>
            <button 
              className={styles.expenseButton}
              onClick={() => setIsExpenseModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar Gasto
            </button>
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h3>Balance Total</h3>
            <span className={styles.balance}>{formatCurrency(getBalance())}</span>
          </div>
          <div className={styles.summaryCard}>
            <h3>Ingresos Totales</h3>
            <span className={styles.income}>
              {formatCurrency(getIncomes().reduce((acc, curr) => acc + curr.amount, 0))}
            </span>
          </div>
          <div className={styles.summaryCard}>
            <h3>Gastos Totales</h3>
            <span className={styles.expense}>
              {formatCurrency(getExpenses().reduce((acc, curr) => acc + curr.amount, 0))}
            </span>
          </div>
        </div>

        <FinanceChart transactions={transactions} />

        <div className={styles.transactionList}>
          <h2>Movimientos Recientes</h2>
          {transactions
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map(transaction => (
              <div 
                key={transaction.id} 
                className={`${styles.transactionItem} ${
                  transaction.type === 'INCOME' ? styles.income : styles.expense
                }`}
              >
                <div className={styles.transactionInfo}>
                  <h3>{transaction.name}</h3>
                  <p>{transaction.description}</p>
                  <small>{transaction.date.toLocaleDateString()}</small>
                </div>
                <div className={styles.transactionAmount}>
                  <span>{formatCurrency(transaction.amount)}</span>
                  <div className={styles.actions}>
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className={styles.editButton}
                      aria-label="Editar transacción"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction)}
                      className={styles.deleteButton}
                      aria-label="Eliminar transacción"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <Modal
          isOpen={isIncomeModalOpen}
          onClose={() => setIsIncomeModalOpen(false)}
          title="Agregar Ingreso"
        >
          <TransactionForm 
            type="INCOME"
            onSubmit={handleAddTransaction('INCOME')}
          />
        </Modal>

        <Modal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          title="Agregar Gasto"
        >
          <TransactionForm 
            type="EXPENSE"
            onSubmit={handleAddTransaction('EXPENSE')}
          />
        </Modal>

        <Modal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          title={`Editar ${editingTransaction?.type === 'INCOME' ? 'Ingreso' : 'Gasto'}`}
        >
          {editingTransaction && (
            <TransactionForm
              type={editingTransaction.type}
              onSubmit={handleEditTransaction}
              initialData={editingTransaction}
            />
          )}
        </Modal>

        <Modal
          isOpen={isSaleModalOpen}
          onClose={() => setSaleModalOpen(false)}
          title="Registrar Venta"
        >
          <SalesForm 
            products={products}
            onSubmit={handleSale}
          />
        </Modal>

        <Modal
          isOpen={isQuickExpenseModalOpen}
          onClose={() => setQuickExpenseModalOpen(false)}
          title="Gasto Rápido"
        >
          <ExpenseForm onSubmit={handleQuickExpense} />
        </Modal>

        <ConfirmDialog
          isOpen={!!deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          onConfirm={confirmDelete}
          title="Eliminar Transacción"
          message="¿Estás seguro que deseas eliminar esta transacción? Esta acción no se puede deshacer."
        />
      </div>
    </ProtectedLayout>
  );
} 