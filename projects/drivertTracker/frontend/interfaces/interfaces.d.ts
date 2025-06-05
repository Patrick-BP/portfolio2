
type Expense = {
  _id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt?: Date;
  createdAt?: string;
  receipt?: string | null; // Receipt URL
};


interface MonthlyReport {
    _id: string;
    date: Date;
    totalExpenses: number;
    totalMileage: number;
    totalFuel: number;
    
}

 interface Expense  {
    _id: string;
    date: Date;
    category: string;
    description: string;
    amount: number;
    createdAt?: string; // Add createdAt field for sorting
    receipt?: string | null; // Receipt URL
  };
interface ExpenseFormProps {
  onSubmit: (expense: {
    category: string;
    date: string;
    description: string;
    amount: number;
    current_mileage?: number;
    previous_mileage?: number;
    gallons?: number;
    receipt?: any;
  }) => void;
  initialValues?: {
    category: string;
    date: string;
    description: string;
    amount: number;
    current_mileage?: number;
    previous_mileage?: number;
    gallons?: number;
  };
}
