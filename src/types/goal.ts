export interface Goal {
  id: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
  description?: string;
  createdAt: Date;
} 