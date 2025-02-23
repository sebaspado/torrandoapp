export interface StockItem {
  id: string;
  productId: string;
  quantity: number;
  minQuantity: number;
  lastUpdated: Date;
  location?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: Date;
  reason: string;
  reference?: string;
} 