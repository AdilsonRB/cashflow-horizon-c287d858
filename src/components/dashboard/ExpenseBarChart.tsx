
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from './ChartContainer';
import { formatCurrency } from '@/lib/formatters';

interface ExpenseBarChartProps {
  data: {
    name: string;
    value: number;
    code: string;
  }[];
}

const ExpenseBarChart: React.FC<ExpenseBarChartProps> = ({ data }) => {
  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">Código: {payload[0].payload.code}</p>
          <p className="text-expense">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer title="Maiores Despesas" description="Top categorias por valor">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={sortedData.slice(0, 10)} // Show only top 10
          margin={{
            top: 5,
            right: 30,
            left: 100,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={90}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#ef4444" barSize={20} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ExpenseBarChart;
