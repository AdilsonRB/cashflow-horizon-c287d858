
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartContainer from './ChartContainer';
import { formatCurrency } from '@/lib/formatters';

interface ExpensePieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const RADIAN = Math.PI / 180;

// Custom label that renders the percentage inside the pie chart slices
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  );
};

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-muted-foreground text-xs">
            {(payload[0].payload.percent * 100).toFixed(1)}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer title="Distribuição de Despesas" description="Por categoria principal">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: '10px',
              fontSize: '12px',
            }}
            formatter={(value, entry, index) => {
              return (
                <span className="text-xs">{value}</span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ExpensePieChart;
