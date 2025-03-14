
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onMonthChange, availableMonths }) => {
  const goToPreviousMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex > 0) {
      onMonthChange(availableMonths[currentIndex - 1]);
    }
  };

  const goToNextMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex < availableMonths.length - 1) {
      onMonthChange(availableMonths[currentIndex + 1]);
    }
  };

  const isPreviousDisabled = availableMonths.indexOf(selectedMonth) === 0;
  const isNextDisabled = availableMonths.indexOf(selectedMonth) === availableMonths.length - 1;

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={goToPreviousMonth}
        disabled={isPreviousDisabled}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o mês" />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={goToNextMonth}
        disabled={isNextDisabled}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;
