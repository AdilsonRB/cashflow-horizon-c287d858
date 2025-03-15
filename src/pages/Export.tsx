
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { FileText, AlertCircle, FileQuestion, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getImportHistory } from '@/lib/importProcessors';

const Export = () => {
  const { toast } = useToast();
  const [fileName, setFileName] = useState("relatorio_financeiro");
  const [includeGraphs, setIncludeGraphs] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [hasData, setHasData] = useState(false);
  
  // Verificar se existem dados importados
  React.useEffect(() => {
    const importHistory = getImportHistory();
    setHasData(importHistory.length > 0);
  }, []);

  const handleExport = () => {
    if (!hasData) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Importe dados financeiros antes de gerar um relatório PDF.",
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    
    // Simular geração de PDF
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "PDF gerado com sucesso",
        description: `O arquivo ${fileName}.pdf foi gerado e será baixado automaticamente.`,
      });
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Exportar Relatório PDF</h1>
        <p className="text-muted-foreground">
          Gere relatórios detalhados dos seus dados financeiros
        </p>
      </div>
      
      {!hasData && (
        <Alert className="mb-6">
          <FileQuestion className="h-4 w-4" />
          <AlertTitle>Nenhum dado disponível para exportação</AlertTitle>
          <AlertDescription>
            Você precisa importar dados financeiros antes de poder exportá-los.
            <div className="mt-2">
              <a href="/import" className="text-primary hover:underline">
                Ir para página de importação
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Relatório PDF</CardTitle>
            <FileText className="h-5 w-5 text-red-600" />
          </div>
          <CardDescription>
            Configurações para geração do relatório em PDF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fileName">Nome do arquivo</Label>
            <div className="flex gap-2 items-center">
              <Input 
                id="fileName" 
                value={fileName} 
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground">.pdf</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Conteúdo do relatório</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Incluir gráficos</p>
                <p className="text-xs text-muted-foreground">
                  Adiciona gráficos visuais ao relatório
                </p>
              </div>
              <Switch 
                checked={includeGraphs} 
                onCheckedChange={setIncludeGraphs} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Detalhamento completo</p>
                <p className="text-xs text-muted-foreground">
                  Inclui todas as subcategorias no relatório
                </p>
              </div>
              <Switch 
                checked={includeDetails} 
                onCheckedChange={setIncludeDetails} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cabeçalho com informações</p>
                <p className="text-xs text-muted-foreground">
                  Inclui data, período e informações do usuário
                </p>
              </div>
              <Switch 
                checked={includeHeader} 
                onCheckedChange={setIncludeHeader} 
              />
            </div>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Relatório completo</AlertTitle>
            <AlertDescription>
              O PDF gerado incluirá exatamente os mesmos gráficos, tabelas e análises presentes no dashboard, 
              formatados de maneira profissional para impressão.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="justify-end">
          <Button 
            onClick={handleExport} 
            disabled={isExporting || !hasData}
            className="w-full"
          >
            {isExporting ? 'Gerando PDF...' : 'Exportar PDF'}
            {!isExporting && <Download className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Visualização do relatório</CardTitle>
          <CardDescription>
            Prévia do que será incluído no seu PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="rounded-lg border p-6 bg-muted/10 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {includeGraphs ? "Gráficos, " : ""}
                {includeDetails ? "detalhamento completo, " : "detalhamento resumido, "}
                {includeHeader ? "cabeçalho com informações" : "sem cabeçalho"}
              </p>
              <p className="mt-2 text-sm font-medium">
                {fileName}.pdf
              </p>
            </div>
          ) : (
            <div className="rounded-lg border p-6 bg-muted/10 text-center">
              <p className="text-muted-foreground">Nenhum dado disponível para prévia.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Export;
