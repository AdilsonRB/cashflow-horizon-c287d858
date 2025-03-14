import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileDown, FileText, FileSpreadsheet, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Export = () => {
  const { toast } = useToast();

  const handleExport = (type: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Seu relatório ${type} será baixado em instantes.`,
    });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Exportar Relatórios</h1>
        <p className="text-muted-foreground">
          Exporte seus dados financeiros em diferentes formatos
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Excel Completo</CardTitle>
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
            </div>
            <CardDescription>
              Exporta todos os dados no formato Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Inclui todas as categorias, subcategorias e valores mensais em uma planilha completa, mantendo a mesma estrutura da sua planilha original.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleExport('Excel')} 
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Relatório PDF</CardTitle>
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <CardDescription>
              Gera um relatório detalhado em PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cria um documento PDF formatado com gráficos, tabelas e análises detalhadas do período selecionado, ideal para impressão.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleExport('PDF')} 
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>CSV para Análise</CardTitle>
              <FileDown className="h-5 w-5 text-blue-600" />
            </div>
            <CardDescription>
              Exporta dados em formato CSV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Formato simplificado para importação em outras ferramentas de análise de dados ou planilhas, mantendo apenas os dados essenciais.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleExport('CSV')} 
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Exportação Programada</CardTitle>
            <CardDescription>
              Configure exportações automáticas periódicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Configure a exportação automática dos seus relatórios financeiros em intervalos regulares (mensal, trimestral, etc.) e receba-os diretamente por e-mail.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg border">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                    Relatório Mensal (Excel)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enviado automaticamente no último dia de cada mês.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FilePdf className="h-4 w-4 mr-2 text-red-600" />
                    Resumo Trimestral (PDF)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Relatório consolidado enviado ao final de cada trimestre.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Configurar Exportação Automática
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Compartilhamento</CardTitle>
          <CardDescription>
            Compartilhe seus relatórios com outras pessoas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Gere links de compartilhamento temporários para permitir que outras pessoas visualizem seus relatórios financeiros sem precisar de uma conta.
          </p>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Gerar Link de Compartilhamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Export;
