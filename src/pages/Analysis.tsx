
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MonthSelector from '@/components/finance/MonthSelector';
import FinanceTable from '@/components/finance/FinanceTable';
import { formatCurrency } from '@/lib/formatters';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
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

const Analysis = () => {
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[4]); // Default to Mai/25
  const [activeTab, setActiveTab] = useState('receitas');

  // Filter categories based on active tab
  const filteredCategories = typedCategories.filter(category => 
    (activeTab === 'receitas' && category.type === 'income') || 
    (activeTab === 'despesas' && category.type === 'expense')
  );

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Análise Detalhada</h1>
            <p className="text-muted-foreground">Explore suas finanças em detalhes</p>
          </div>
          <MonthSelector 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
          />
        </div>
      </div>

      {/* Summary section */}
      <div className="mb-8 p-4 rounded-lg border bg-card">
        <h2 className="text-lg font-medium mb-4">Resumo do Mês: {selectedMonth}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Receitas</p>
            <p className="text-2xl font-bold text-income">{formatCurrency(financialSummary.totalIncome)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Despesas</p>
            <p className="text-2xl font-bold text-expense">{formatCurrency(financialSummary.totalExpenses)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resultado Bruto</p>
            <p className="text-2xl font-bold">{formatCurrency(financialSummary.grossResult)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resultado Ajustado</p>
            <p className="text-2xl font-bold">{formatCurrency(financialSummary.adjustedResult)}</p>
          </div>
        </div>
      </div>

      {/* Tabs for receitas/despesas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
        </TabsList>
        <TabsContent value="receitas">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Análise de Receitas</h2>
            <FinanceTable 
              data={filteredCategories}
              currentMonth={selectedMonth}
            />
          </div>
        </TabsContent>
        <TabsContent value="despesas">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Análise de Despesas</h2>
            <FinanceTable 
              data={filteredCategories}
              currentMonth={selectedMonth}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Adjustments section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Ajustes Aplicados</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Descrição do Ajuste</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Exclusão de Investimentos</TableCell>
                <TableCell>Receita Extraordinária</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(500)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Despesa Extraordinária</TableCell>
                <TableCell>Ajuste Pontual</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(300)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell className="font-medium">Total de Ajustes</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(800)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* SureBet & ACTA section */}
      <div>
        <h2 className="text-lg font-medium mb-4">Receitas Extraordinárias</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg border">
            <h3 className="font-medium mb-2">SureBet</h3>
            <Separator className="my-3" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor Acumulado</span>
                <span className="font-medium">{formatCurrency(12500)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{selectedMonth}</span>
                <span className="font-medium text-income">{formatCurrency(1500)}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border">
            <h3 className="font-medium mb-2">ACTA</h3>
            <Separator className="my-3" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor Acumulado</span>
                <span className="font-medium">{formatCurrency(8200)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{selectedMonth}</span>
                <span className="font-medium text-income">{formatCurrency(820)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analysis;
