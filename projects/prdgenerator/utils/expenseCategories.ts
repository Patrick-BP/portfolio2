export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  taxDeductible: boolean;
}

export const categories: Category[] = [
  {
    id: 'fuel',
    name: 'Fuel',
    icon: 'gas-pump',
    color: '#ef4444',
    taxDeductible: true,
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    icon: 'wrench',
    color: '#3b82f6',
    taxDeductible: true,
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: 'shield-alt',
    color: '#10b981',
    taxDeductible: true,
  },
  {
    id: 'tolls',
    name: 'Tolls',
    icon: 'road',
    color: '#f59e0b',
    taxDeductible: true,
  },
  {
    id: 'parking',
    name: 'Parking',
    icon: 'parking',
    color: '#8b5cf6',
    taxDeductible: true,
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'ellipsis-h',
    color: '#6b7280',
    taxDeductible: false,
  },
];

export const expenseHelper = {
  getCategoryById(id: string): Category | undefined {
    return categories.find(cat => cat.id === id);
  },

  getTaxDeductibleExpenses(expenses: any[]): any[] {
    return expenses.filter(expense => {
      const category = this.getCategoryById(expense.category);
      return category?.taxDeductible;
    });
  },

  calculateTaxDeductions(expenses: any[]): number {
    const deductibleExpenses = this.getTaxDeductibleExpenses(expenses);
    return deductibleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  },

  getMonthlyBreakdown(expenses: any[], month: number, year: number): Record<string, number> {
    const monthlyExpenses = expenses.filter(expense => {
      const date = new Date(expense.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    return monthlyExpenses.reduce((acc, expense) => {
      const category = this.getCategoryById(expense.category);
      if (category) {
        acc[category.name] = (acc[category.name] || 0) + expense.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  }
};