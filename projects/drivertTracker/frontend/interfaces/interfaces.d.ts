
type Expense = {
  _id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt?: Date;
};


interface MonthlyReport {
    _id: string;
    date: Date;
    totalExpenses: number;
    totalMileage: number;
    totalFuel: number;
    
}