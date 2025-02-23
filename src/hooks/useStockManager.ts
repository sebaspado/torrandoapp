import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { StockItem, StockMovement } from '@/types/stock';

export default function useStockManager() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      try {
        const storedStock = localStorage.getItem(`stock_${session.user.email}`);
        const storedMovements = localStorage.getItem(`stock_movements_${session.user.email}`);
        
        if (storedStock) {
          setStockItems(JSON.parse(storedStock));
        }
        if (storedMovements) {
          const parsedMovements = JSON.parse(storedMovements);
          setMovements(parsedMovements.map((m: any) => ({
            ...m,
            date: new Date(m.date)
          })));
        }
      } catch (error) {
        console.error('Failed to load stock data:', error);
      }
    }
  }, [session]);

  const saveData = (newStock: StockItem[], newMovements: StockMovement[]) => {
    if (session?.user?.email) {
      localStorage.setItem(`stock_${session.user.email}`, JSON.stringify(newStock));
      localStorage.setItem(`stock_movements_${session.user.email}`, JSON.stringify(newMovements));
    }
  };

  const addMovement = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    const newMovement: StockMovement = {
      id: `mov_${Date.now()}`,
      date: new Date(),
      ...movement
    };

    setMovements(prev => {
      const updated = [...prev, newMovement];
      updateStockQuantity(movement.productId, movement.type, movement.quantity);
      saveData(stockItems, updated);
      return updated;
    });
  };

  const updateStockQuantity = (productId: string, type: 'IN' | 'OUT', quantity: number) => {
    setStockItems(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      let updated: StockItem[];

      if (existingItem) {
        updated = prev.map(item => 
          item.productId === productId
            ? {
                ...item,
                quantity: type === 'IN' 
                  ? item.quantity + quantity 
                  : item.quantity - quantity,
                lastUpdated: new Date()
              }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            id: `stock_${Date.now()}`,
            productId,
            quantity: type === 'IN' ? quantity : -quantity,
            minQuantity: 5, // Default minimum quantity
            lastUpdated: new Date()
          }
        ];
      }

      saveData(updated, movements);
      return updated;
    });
  };

  const getMovements = (productId: string) => {
    return movements
      .filter(m => m.productId === productId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  return {
    stockItems,
    addMovement,
    getMovements
  };
} 