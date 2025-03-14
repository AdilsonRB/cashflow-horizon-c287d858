
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SummaryCard from '@/components/dashboard/SummaryCard';
import MonthlyLineChart from '@/components/dashboard/MonthlyLineChart';
import ExpensePieChart from '@/components/dashboard/ExpensePieChart';
import ExpenseBarChart from '@/components/dashboard/ExpenseBarChart';
import FinanceTable from '@/components/finance/FinanceTable';
import MonthSelector from '@/components/finance/MonthSelector';
import { formatCurrency } from '@/lib/formatters';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  PiggyBank, 
  CreditCard, 
  BarChart4 
} from 'lucide-react';
import { 
  monthlyData, 
  expenseDistribution, 
  topExpenses, 
  categoriesWithSubcategories,
  availableMonths,
  financialSummary
} from '@/data/mockData';

// Define the TypeScript types
type CategoryType = "income" | "expense";

interface Subcategory {
  id: string;
  code: string;
  name: string;
  type: CategoryType;
  value: number;
}

interface CategoryItem {
  id: string;
  code: string;
  name: string;
  type: CategoryType;
  value: number;
  subcategories: Subcategory[];
}

// Explicitly cast the data to ensure type safety
const typedCategories = categoriesWithSubcategories as CategoryItem[];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[4]); // Default to Mai/25

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
            <p className="text-muted-foreground">Visualize e analise suas finanças pessoais</p>
          </div>
          <MonthSelector 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <SummaryCard
          title="Receitas"
          value={formatCurrency(financialSummary.totalIncome)}
          description="Total de receitas no mês"
          icon={<DollarSign className="h-5 w-5 text-income" />}
          change={financialSummary.incomeChange}
          changeType="positive"
        />
        <SummaryCard
          title="Despesas"
          value={formatCurrency(financialSummary.totalExpenses)}
          description="Total de despesas no mês"
          icon={<CreditCard className="h-5 w-5 text-expense" />}
          change={financialSummary.expensesChange}
          changeType="negative"
        />
        <SummaryCard
          title="Resultado Bruto"
          value={formatCurrency(financialSummary.grossResult)}
          description="Receitas - Despesas"
          icon={<BarChart4 className="h-5 w-5 text-primary" />}
          change={financialSummary.resultChange}
          changeType="positive"
        />
        <SummaryCard
          title="Resultado Ajustado"
          value={formatCurrency(financialSummary.adjustedResult)}
          description="Após exclusões e ajustes"
          icon={<PiggyBank className="h-5 w-5 text-primary" />}
          change={financialSummary.resultChange - 0.5}
          changeType="positive"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <MonthlyLineChart data={monthlyData} />
        <ExpensePieChart data={expenseDistribution} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <ExpenseBarChart data={topExpenses} />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Evolução de Resultados</h2>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Mês Atual vs. Anterior</span>
              <span className="text-xs text-muted-foreground">{selectedMonth}</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Resultado Bruto</span>
                  <span className="text-sm font-medium text-income">+{financialSummary.resultChange}%</span>
                </div>
                <div className="h-2 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-income" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Resultado Ajustado</span>
                  <span className="text-sm font-medium text-income">+{financialSummary.resultChange - 0.5}%</span>
                </div>
                <div className="h-2 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-income" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Table */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Detalhamento por Categoria</h2>
        <FinanceTable 
          data={typedCategories}
          currentMonth={selectedMonth}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
