
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import FinanceImport from '@/components/import/ExcelImport';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const Import = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Importar Dados</h1>
        <p className="text-muted-foreground">
          Importe seus dados financeiros diretamente dos seus arquivos CSV ou Excel
        </p>
      </div>
      
      <Alert variant="destructive" className="mb-6 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>
          <strong>Antes de importar, os dados existentes serão completamente limpos.</strong>
          <br />
          Certifique-se de fazer um backup ou exportar relatórios importantes antes de prosseguir.
        </AlertDescription>
      </Alert>
      
      <div className="max-w-4xl mx-auto">
        <FinanceImport />
        
        <div className="mt-10 bg-muted/50 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Estrutura de Importação</h2>
          <p className="mb-4">
            A plataforma foi projetada para reconhecer o formato semicolon-delimited (;) CSV, seguindo esta estrutura:
          </p>
          
          <div className="bg-background p-3 rounded border mb-4 overflow-x-auto">
            <code className="text-sm whitespace-nowrap">
              ;ID;DESCRIÇÃO;jan/25;fev/25;mar/25;abr/25;mai/25;jun/25;jul/25;ago/25;set/25;out/25;nov/25;dez/25;
            </code>
          </div>
          
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>IDs no formato <strong>XXX</strong> são considerados categorias principais</li>
            <li>IDs no formato <strong>XXX.XX</strong> são considerados subcategorias</li>
            <li>Valores entre parênteses (ex: "(769,46)") são tratados como negativos</li>
            <li>Valores sem parênteses (ex: "13.981,45") são tratados como positivos</li>
            <li>Use vírgula como separador decimal e ponto como separador de milhar</li>
          </ul>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
            <p className="text-sm text-yellow-800">
              <strong>Dica:</strong> Antes de importar, os dados existentes serão completamente limpos.
              Certifique-se de fazer um backup ou exportar relatórios importantes antes de prosseguir.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Import;
