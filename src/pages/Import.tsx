
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ExcelImport from '@/components/import/ExcelImport';

const Import = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Importar Dados</h1>
        <p className="text-muted-foreground">
          Importe seus dados financeiros diretamente da sua planilha Excel
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <ExcelImport />
        
        <div className="mt-10 bg-muted/50 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Estrutura de Importação</h2>
          <p className="mb-4">
            A plataforma foi projetada para reconhecer automaticamente a estrutura da sua planilha Excel atual, incluindo:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Categorias principais com códigos (016, 001, 002, etc.)</li>
            <li>Subcategorias com códigos decimais (016.01, 001.01, etc.)</li>
            <li>Valores mensais distribuídos em colunas (jan/25 a dez/25)</li>
            <li>Cálculos de totais e ajustes específicos</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Dica: Mantenha sua planilha Excel organizada da mesma forma para garantir uma importação perfeita.
            Os dados importados serão automaticamente refletidos nos dashboards e relatórios.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Import;
