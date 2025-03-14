
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { monthlyData, availableMonths } from '@/data/mockData';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Extended data with results calculated
const monthlyDataWithResults = monthlyData.map(month => ({
  ...month,
  resultadoBruto: month.receitas - month.despesas,
  resultadoAjustado: (month.receitas - month.despesas) * 0.8, // Simplified adjustment for demo
}));

const Evolution = () => {
  const [dataTimeframe, setDataTimeframe] = useState('6m');
  const [visualizationType, setVisualizationType] = useState('barras');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={`item-${index}`} 
              style={{ color: entry.color }}
              className="text-sm"
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Filter data based on timeframe
  const getFilteredData = () => {
    switch(dataTimeframe) {
      case '3m':
        return monthlyDataWithResults.slice(-3);
      case '6m':
        return monthlyDataWithResults.slice(-6);
      case '12m':
        return monthlyDataWithResults;
      default:
        return monthlyDataWithResults;
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Evolução Mensal</h1>
            <p className="text-muted-foreground">Acompanhe a evolução dos seus resultados financeiros</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Período:</span>
            <Select value={dataTimeframe} onValueChange={setDataTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 meses</SelectItem>
                <SelectItem value="6m">6 meses</SelectItem>
                <SelectItem value="12m">12 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Visualization Tabs */}
      <Tabs value={visualizationType} onValueChange={setVisualizationType} className="mb-6">
        <TabsList>
          <TabsTrigger value="barras">Gráfico de Barras</TabsTrigger>
          <TabsTrigger value="linhas">Gráfico de Linhas</TabsTrigger>
          <TabsTrigger value="area">Gráfico de Área</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Chart section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Evolução Mensal dos Resultados</CardTitle>
          <CardDescription>
            Visualize a tendência de receitas, despesas e resultados ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {visualizationType === 'barras' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getFilteredData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 40,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="receitas" name="Receitas" fill="#10b981" />
                  <Bar dataKey="despesas" name="Despesas" fill="#ef4444" />
                  <Bar dataKey="resultadoBruto" name="Resultado Bruto" fill="#3b82f6" />
                  <Bar dataKey="resultadoAjustado" name="Resultado Ajustado" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {visualizationType === 'linhas' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={getFilteredData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 40,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="receitas" name="Receitas" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="despesas" name="Despesas" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="resultadoBruto" name="Resultado Bruto" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="resultadoAjustado" name="Resultado Ajustado" stroke="#8b5cf6" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            {visualizationType === 'area' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={getFilteredData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 40,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="receitas" name="Receitas" fill="#10b98133" stroke="#10b981" strokeWidth={2} />
                  <Area type="monotone" dataKey="despesas" name="Despesas" fill="#ef444433" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="resultadoBruto" name="Resultado Bruto" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="resultadoAjustado" name="Resultado Ajustado" stroke="#8b5cf6" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary statistics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Média de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              {formatCurrency(
                getFilteredData().reduce((acc, curr) => acc + curr.receitas, 0) / getFilteredData().length
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nos últimos {dataTimeframe === '3m' ? '3' : dataTimeframe === '6m' ? '6' : '12'} meses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Média de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              {formatCurrency(
                getFilteredData().reduce((acc, curr) => acc + curr.despesas, 0) / getFilteredData().length
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nos últimos {dataTimeframe === '3m' ? '3' : dataTimeframe === '6m' ? '6' : '12'} meses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Melhor Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                Math.max(...getFilteredData().map(item => item.resultadoBruto))
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Resultado bruto mais alto no período
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tendência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              Em alta
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado na variação dos últimos 3 meses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Growth statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Crescimento</CardTitle>
          <CardDescription>
            Variação percentual comparando períodos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Receitas</p>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-income" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Mês anterior</span>
                <span className="font-medium text-income">+6.5%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Despesas</p>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-expense" style={{ width: '42%' }}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Mês anterior</span>
                <span className="font-medium text-expense">+4.2%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Resultado</p>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '78%' }}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Mês anterior</span>
                <span className="font-medium text-primary">+7.8%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Evolution;
