
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from './ChartContainer';
import { formatCurrency } from '@/lib/formatters';

interface MonthlyLineChartProps {
  data: {
    month: string;
    receitas: number;
    despesas: number;
  }[];
}

const MonthlyLineChart: React.FC<MonthlyLineChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-income">
            Receitas: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-expense">
            Despesas: {formatCurrency(payload[1].value)}
          </p>
          <p className="text-primary font-semibold">
            Saldo: {formatCurrency(payload[0].value - payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer title="Evolução Mensal" description="Receitas vs Despesas">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="receitas" 
            stroke="#10b981" 
            strokeWidth={2}
            activeDot={{ r: 6 }} 
            name="Receitas"
          />
          <Line 
            type="monotone" 
            dataKey="despesas" 
            stroke="#ef4444" 
            strokeWidth={2}
            activeDot={{ r: 6 }} 
            name="Despesas"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MonthlyLineChart;
