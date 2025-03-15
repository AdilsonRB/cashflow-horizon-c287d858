
import React, { useState, useEffect } from 'react';
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
  BarChart4,
  FileQuestion
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getImportHistory, getImportedFinancialData } from '@/lib/importProcessors';
import { availableMonths } from '@/data/mockData';

// Tipos
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

// Estado inicial vazio
const emptyFinancialSummary = {
  totalIncome: 0,
  totalExpenses: 0,
  grossResult: 0,
  adjustedResult: 0,
  incomeChange: 0,
  expensesChange: 0,
  resultChange: 0,
};

const emptyMonthlyData = [
  { month: 'Jan/25', receitas: 0, despesas: 0 },
  { month: 'Fev/25', receitas: 0, despesas: 0 },
  { month: 'Mar/25', receitas: 0, despesas: 0 },
  { month: 'Abr/25', receitas: 0, despesas: 0 },
  { month: 'Mai/25', receitas: 0, despesas: 0 },
  { month: 'Jun/25', receitas: 0, despesas: 0 },
];

const emptyExpenseDistribution = [
  { name: 'Moradia', value: 0, color: '#ef4444' },
  { name: 'Alimentação', value: 0, color: '#f97316' },
  { name: 'Transporte', value: 0, color: '#eab308' },
  { name: 'Saúde', value: 0, color: '#22c55e' },
  { name: 'Lazer', value: 0, color: '#3b82f6' },
  { name: 'Educação', value: 0, color: '#8b5cf6' },
];

const emptyTopExpenses = [
  { name: 'Sem dados', value: 0, code: '000.00' },
];

const emptyCategories: CategoryItem[] = [];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0]); // Default to Jan/25
  const [hasData, setHasData] = useState(false);
  const [financialSummary, setFinancialSummary] = useState(emptyFinancialSummary);
  const [monthlyData, setMonthlyData] = useState(emptyMonthlyData);
  const [expenseDistribution, setExpenseDistribution] = useState(emptyExpenseDistribution);
  const [topExpenses, setTopExpenses] = useState(emptyTopExpenses);
  const [categories, setCategories] = useState<CategoryItem[]>(emptyCategories);

  // Carregar dados com base no mês selecionado
  useEffect(() => {
    const importHistory = getImportHistory();
    const dataExists = importHistory.length > 0;
    setHasData(dataExists);
    
    if (!dataExists) {
      // Definir todos os dados para zero quando não houver importação
      setFinancialSummary(emptyFinancialSummary);
      setMonthlyData(emptyMonthlyData);
      setExpenseDistribution(emptyExpenseDistribution);
      setTopExpenses(emptyTopExpenses);
      setCategories(emptyCategories);
    } else {
      // Carregar dados reais do localStorage
      const importedData = getImportedFinancialData();
      
      if (importedData) {
        // Usar dados dos meses importados
        setMonthlyData(importedData.monthlyData);
        
        // Filtrar categorias e calcular valores para o mês selecionado
        const categoriesWithMonthlyValues = importedData.categories.map((category: any) => {
          // Verificar se o mês selecionado existe nos dados
          const monthValue = category.values && category.values[selectedMonth] 
            ? category.values[selectedMonth] 
            : 0;
            
          // Processar subcategorias com valores do mês
          const subcategoriesWithValues = category.subcategories?.map((sub: any) => {
            const subMonthValue = sub.values && sub.values[selectedMonth]
              ? sub.values[selectedMonth]
              : 0;
              
            return {
              ...sub,
              value: subMonthValue
            };
          }) || [];
          
          return {
            ...category,
            value: monthValue,
            subcategories: subcategoriesWithValues
          };
        });
        
        setCategories(categoriesWithMonthlyValues);
        
        // Calcular resumo financeiro
        const totalIncome = calculateTotal(categoriesWithMonthlyValues, 'income');
        const totalExpenses = calculateTotal(categoriesWithMonthlyValues, 'expense');
        
        setFinancialSummary({
          totalIncome,
          totalExpenses,
          grossResult: totalIncome - totalExpenses,
          adjustedResult: totalIncome - totalExpenses * 0.9, // Exemplo de ajuste
          incomeChange: 0, // Seria calculado com base no mês anterior
          expensesChange: 0,
          resultChange: 0
        });
        
        // Gerar distribuição de despesas para o mês selecionado
        const expensesByCategory = generateExpenseDistribution(categoriesWithMonthlyValues);
        setExpenseDistribution(expensesByCategory);
        
        // Gerar top despesas
        const topExpensesList = generateTopExpenses(categoriesWithMonthlyValues);
        setTopExpenses(topExpensesList);
      }
    }
  }, [selectedMonth]);

  // Função auxiliar para calcular total de receitas ou despesas
  const calculateTotal = (categories: any[], type: 'income' | 'expense'): number => {
    return categories.reduce((total, category) => {
      // Soma da categoria
      const categoryValue = category.type === type ? Math.abs(category.value) : 0;
      
      // Soma das subcategorias
      const subcategoriesValue = category.subcategories?.reduce((subTotal: number, sub: any) => {
        return subTotal + (sub.type === type ? Math.abs(sub.value) : 0);
      }, 0) || 0;
      
      return total + categoryValue + subcategoriesValue;
    }, 0);
  };

  // Função para gerar distribuição de despesas
  const generateExpenseDistribution = (categories: any[]): any[] => {
    const colorPalette = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
    
    // Se não houver dados, retornar lista vazia
    if (!hasData) return emptyExpenseDistribution;
    
    // Obter principais categorias de despesa
    const expenseCategories = categories
      .filter(cat => cat.type === 'expense' && Math.abs(cat.value) > 0)
      .map((cat, index) => ({
        name: cat.name,
        value: Math.abs(cat.value),
        color: colorPalette[index % colorPalette.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
      
    // Se não houver categorias, retornar lista vazia
    return expenseCategories.length > 0 ? expenseCategories : emptyExpenseDistribution;
  };

  // Função para gerar top despesas
  const generateTopExpenses = (categories: any[]): any[] => {
    if (!hasData) return emptyTopExpenses;
    
    // Obter todas as subcategorias de despesa
    const allExpenses: any[] = [];
    
    categories.forEach(category => {
      if (category.type === 'expense') {
        // Adicionar categoria principal
        allExpenses.push({
          name: category.name,
          value: Math.abs(category.value),
          code: category.code
        });
        
        // Adicionar subcategorias
        category.subcategories?.forEach((sub: any) => {
          if (sub.type === 'expense') {
            allExpenses.push({
              name: sub.name,
              value: Math.abs(sub.value),
              code: sub.code
            });
          }
        });
      }
    });
    
    // Ordenar por valor e pegar os 5 maiores
    const topExpenses = allExpenses
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
      
    return topExpenses.length > 0 ? topExpenses : emptyTopExpenses;
  };

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

      {!hasData && (
        <Alert className="mb-6">
          <FileQuestion className="h-4 w-4" />
          <AlertTitle>Nenhum dado importado</AlertTitle>
          <AlertDescription>
            Importe seus dados financeiros para visualizar o dashboard completo.
            <div className="mt-2">
              <a href="/import" className="text-primary hover:underline">
                Ir para página de importação
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
                  <span className="text-sm font-medium text-income">
                    {financialSummary.resultChange > 0 ? '+' : ''}{financialSummary.resultChange}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded overflow-hidden">
                  <div 
                    className="h-full bg-income" 
                    style={{ width: `${Math.min(Math.max(financialSummary.resultChange, 0), 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Resultado Ajustado</span>
                  <span className="text-sm font-medium text-income">
                    {(financialSummary.resultChange - 0.5) > 0 ? '+' : ''}{financialSummary.resultChange - 0.5}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded overflow-hidden">
                  <div 
                    className="h-full bg-income" 
                    style={{ width: `${Math.min(Math.max(financialSummary.resultChange - 0.5, 0), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Table */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Detalhamento por Categoria</h2>
        {categories.length > 0 ? (
          <FinanceTable 
            data={categories}
            currentMonth={selectedMonth}
          />
        ) : (
          <div className="border rounded-lg p-6 text-center bg-muted/10">
            <p className="text-muted-foreground">Nenhum dado disponível para exibição.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
