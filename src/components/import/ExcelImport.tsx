
import { useState } from 'react';
import { Upload, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const ExcelImport = () => {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check if the file is an Excel file
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setErrorMessage('Por favor, selecione um arquivo Excel válido (.xlsx ou .xls)');
        setFileSelected(null);
        return;
      }
      
      setFileSelected(file);
      setErrorMessage(null);
    } else {
      setFileSelected(null);
    }
  };

  const handleImport = () => {
    if (!fileSelected) return;
    
    setImportStatus('processing');
    
    // Simulate processing delay
    setTimeout(() => {
      // This is where you would implement the actual Excel import logic
      // For now we'll just simulate success
      setImportStatus('success');
      
      toast({
        title: "Importação concluída",
        description: "Seus dados financeiros foram importados com sucesso.",
      });
    }, 2000);
  };
  
  const resetForm = () => {
    setFileSelected(null);
    setImportStatus('idle');
    setErrorMessage(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Importar Dados Financeiros</CardTitle>
        <CardDescription>
          Importe seus dados diretamente da sua planilha Excel para manter a mesma estrutura e organização
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {importStatus === 'success' ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Importação Concluída</AlertTitle>
            <AlertDescription>
              Seus dados foram importados com sucesso e estão prontos para serem analisados.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <File className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Arraste e solte seu arquivo Excel aqui</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ou clique para selecionar um arquivo .xlsx ou .xls
            </p>
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={importStatus === 'processing'}
              />
              <Button variant="outline" className="w-full">
                Selecionar Arquivo
              </Button>
            </div>
            {fileSelected && (
              <div className="mt-4 p-2 bg-muted rounded flex items-center">
                <File className="h-4 w-4 mr-2" />
                <span className="text-sm truncate">{fileSelected.name}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {importStatus === 'success' ? (
          <Button onClick={resetForm} className="w-full">
            Importar Outro Arquivo
          </Button>
        ) : (
          <Button 
            onClick={handleImport} 
            disabled={!fileSelected || importStatus === 'processing'} 
            className="w-full"
          >
            {importStatus === 'processing' ? 'Processando...' : 'Importar Dados'}
            {importStatus !== 'processing' && <Upload className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ExcelImport;
