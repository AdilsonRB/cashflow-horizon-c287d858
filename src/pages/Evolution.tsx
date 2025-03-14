
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MonthlyLineChart from '@/components/dashboard/MonthlyLineChart';

// Dados de exemplo para o gráfico de evolução mensal
const mockEvolutionData = [
  { month: 'Jan', receitas: 12500, despesas: 9800 },
  { month: 'Fev', receitas: 13200, despesas: 10100 },
  { month: 'Mar', receitas: 14800, despesas: 10500 },
  { month: 'Abr', receitas: 13900, despesas: 11200 },
  { month: 'Mai', receitas: 15300, despesas: 10800 },
  { month: 'Jun', receitas: 16200, despesas: 11500 },
  { month: 'Jul', receitas: 15800, despesas: 12200 },
  { month: 'Ago', receitas: 16500, despesas: 11800 },
  { month: 'Set', receitas: 17200, despesas: 12500 },
  { month: 'Out', receitas: 18100, despesas: 13200 },
  { month: 'Nov', receitas: 17500, despesas: 12800 },
  { month: 'Dez', receitas: 19200, despesas: 14500 },
];

const Evolution = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Evolução Mensal</h1>
        <p className="text-muted-foreground">
          Acompanhe a evolução das suas finanças ao longo do tempo
        </p>
      </div>

      <div className="space-y-6">
        {/* Gráfico de evolução anual */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Evolução Anual</CardTitle>
            <CardDescription>
              Comparativo de receitas e despesas ao longo dos últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <MonthlyLineChart data={mockEvolutionData} />
            </div>
          </CardContent>
        </Card>

        {/* Análise de tendências */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Receitas</CardTitle>
              <CardDescription>
                Análise do comportamento das suas receitas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Média mensal</span>
                  <span className="text-lg font-bold text-green-500">R$ 15.850,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Crescimento anual</span>
                  <span className="text-lg font-bold text-green-500">+7,8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Previsão próximo mês</span>
                  <span className="text-lg font-bold text-green-500">R$ 18.300,00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendência de Despesas</CardTitle>
              <CardDescription>
                Análise do comportamento das suas despesas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Média mensal</span>
                  <span className="text-lg font-bold text-red-500">R$ 11.741,67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Crescimento anual</span>
                  <span className="text-lg font-bold text-red-500">+4,3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Previsão próximo mês</span>
                  <span className="text-lg font-bold text-red-500">R$ 13.500,00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projeção futura */}
        <Card>
          <CardHeader>
            <CardTitle>Projeção de Resultados</CardTitle>
            <CardDescription>
              Estimativa de resultados para os próximos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium">Mês</th>
                    <th className="text-right py-2 px-4 font-medium">Receitas</th>
                    <th className="text-right py-2 px-4 font-medium">Despesas</th>
                    <th className="text-right py-2 px-4 font-medium">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">Janeiro 2025</td>
                    <td className="text-right py-2 px-4 text-green-500">R$ 19.500,00</td>
                    <td className="text-right py-2 px-4 text-red-500">R$ 14.800,00</td>
                    <td className="text-right py-2 px-4 font-medium">R$ 4.700,00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Fevereiro 2025</td>
                    <td className="text-right py-2 px-4 text-green-500">R$ 19.800,00</td>
                    <td className="text-right py-2 px-4 text-red-500">R$ 15.100,00</td>
                    <td className="text-right py-2 px-4 font-medium">R$ 4.700,00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Março 2025</td>
                    <td className="text-right py-2 px-4 text-green-500">R$ 20.200,00</td>
                    <td className="text-right py-2 px-4 text-red-500">R$ 15.400,00</td>
                    <td className="text-right py-2 px-4 font-medium">R$ 4.800,00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Abril 2025</td>
                    <td className="text-right py-2 px-4 text-green-500">R$ 20.500,00</td>
                    <td className="text-right py-2 px-4 text-red-500">R$ 15.700,00</td>
                    <td className="text-right py-2 px-4 font-medium">R$ 4.800,00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Maio 2025</td>
                    <td className="text-right py-2 px-4 text-green-500">R$ 20.800,00</td>
                    <td className="text-right py-2 px-4 text-red-500">R$ 16.000,00</td>
                    <td className="text-right py-2 px-4 font-medium">R$ 4.800,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Junho 2025</td>
                    <td className="text-right py-2 px-4 text-green-500">R$ 21.200,00</td>
                    <td className="text-right py-2 px-4 text-red-500">R$ 16.300,00</td>
                    <td className="text-right py-2 px-4 font-medium">R$ 4.900,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Evolution;
