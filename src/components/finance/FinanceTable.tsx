
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface Subcategory {
  id: string;
  code: string;
  name: string;
  type: 'income' | 'expense';
  value: number;
  monthlyValues?: Record<string, number>;
}

interface CategoryItem {
  id: string;
  code: string;
  name: string;
  type: 'income' | 'expense';
  value: number;
  monthlyValues?: Record<string, number>;
  subcategories?: Subcategory[];
}

interface FinanceTableProps {
  data: CategoryItem[];
  currentMonth: string;
}

const FinanceTable: React.FC<FinanceTableProps> = ({ data, currentMonth }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
  };

  const getCategoryValueClass = (type: 'income' | 'expense', value: number) => {
    if (type === 'income') return 'text-income';
    if (type === 'expense') return 'text-expense';
    return '';
  };

  // Função para obter o valor mensal específico ou usar o valor padrão
  const getValueForMonth = (item: CategoryItem | Subcategory, month: string): number => {
    // Se temos valores mensais, usar o valor do mês atual
    if (item.monthlyValues && month in item.monthlyValues) {
      return item.monthlyValues[month];
    }
    // Caso contrário, usar o valor padrão
    return item.value;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Categoria</TableHead>
            <TableHead>Código</TableHead>
            <TableHead className="text-right">Valor ({currentMonth})</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category) => (
            <React.Fragment key={category.id}>
              <TableRow className={category.subcategories?.length ? "cursor-pointer hover:bg-muted/50" : ""} onClick={() => category.subcategories?.length && toggleCategory(category.id)}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {category.subcategories?.length ? (
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-2">
                        {isCategoryExpanded(category.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    ) : (
                      <div className="w-7"></div>
                    )}
                    {category.name}
                  </div>
                </TableCell>
                <TableCell>{category.code}</TableCell>
                <TableCell 
                  className={cn(
                    "text-right font-medium", 
                    getCategoryValueClass(
                      category.type, 
                      getValueForMonth(category, currentMonth)
                    )
                  )}
                >
                  {formatCurrency(getValueForMonth(category, currentMonth))}
                </TableCell>
              </TableRow>
              
              {/* Render subcategories if category is expanded */}
              {isCategoryExpanded(category.id) && category.subcategories?.map((subcategory) => (
                <TableRow key={subcategory.id} className="bg-muted/30">
                  <TableCell className="font-normal pl-10">
                    {subcategory.name}
                  </TableCell>
                  <TableCell>{subcategory.code}</TableCell>
                  <TableCell 
                    className={cn(
                      "text-right font-medium", 
                      getCategoryValueClass(
                        subcategory.type, 
                        getValueForMonth(subcategory, currentMonth)
                      )
                    )}
                  >
                    {formatCurrency(getValueForMonth(subcategory, currentMonth))}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FinanceTable;
