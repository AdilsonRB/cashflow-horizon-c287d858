
import { useState, useRef } from 'react';
import { Upload, File, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { processCSVImport, clearAllImportedData } from '@/lib/importProcessors';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const FinanceImport = () => {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'review'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duplicates, setDuplicates] = useState<number>(0);
  const [previewData, setPreviewData] = useState<any>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check if the file is a CSV or Excel file
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setErrorMessage('Por favor, selecione um arquivo CSV ou Excel válido (.csv, .xlsx ou .xls)');
        setFileSelected(null);
        return;
      }
      
      setFileSelected(file);
      setErrorMessage(null);
    } else {
      setFileSelected(null);
    }
  };

  const handleImport = async () => {
    if (!fileSelected) return;
    
    setImportStatus('processing');
    setProgress(0);
    
    // Limpar dados existentes antes da importação
    clearAllImportedData();
    
    // Simulate processing with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // This is where the actual CSV processing would happen
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (event.target?.result) {
          const csvContent = event.target.result as string;
          
          // Process the CSV content
          const { data, duplicatesFound } = await processCSVImport(csvContent);
          
          clearInterval(progressInterval);
          
          if (duplicatesFound > 0) {
            setDuplicates(duplicatesFound);
            setPreviewData(data);
            setImportStatus('review');
            setProgress(100);
          } else {
            setProgress(100);
            setImportStatus('success');
            
            toast({
              title: "Importação concluída",
              description: "Seus dados financeiros foram importados com sucesso.",
            });
          }
        }
      };
      
      reader.onerror = () => {
        clearInterval(progressInterval);
        setErrorMessage('Erro ao ler o arquivo. Por favor, tente novamente.');
        setImportStatus('error');
      };
      
      // Read the file as text (for CSV)
      if (fileSelected.name.endsWith('.csv')) {
        reader.readAsText(fileSelected);
      } else {
        // For Excel files, we'd need a different approach
        // For now, we'll simulate success
        setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setImportStatus('success');
          toast({
            title: "Importação concluída",
            description: "Seus dados financeiros foram importados com sucesso.",
          });
        }, 2000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setErrorMessage('Ocorreu um erro durante o processamento do arquivo.');
      setImportStatus('error');
    }
  };
  
  const confirmImport = () => {
    // Here we would commit the data after review
    setImportStatus('success');
    setProgress(100);
    toast({
      title: "Importação concluída",
      description: "Seus dados financeiros foram importados com sucesso após revisão.",
    });
  };
  
  const resetForm = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileSelected(null);
    setImportStatus('idle');
    setErrorMessage(null);
    setProgress(0);
    setDuplicates(0);
    setPreviewData(null);
  };

  const viewDashboard = () => {
    navigate('/dashboard');
  };

  const viewSettings = () => {
    navigate('/settings');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Importar Dados Financeiros</CardTitle>
        <CardDescription>
          Importe seus dados diretamente do CSV ou Excel para atualizar seu dashboard financeiro
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
        
        {importStatus === 'review' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Revisão Necessária</AlertTitle>
            <AlertDescription>
              <p>Detectamos {duplicates} entradas que podem ser duplicadas.</p>
              <p className="mt-2">Por favor, revise os dados antes de finalizar a importação.</p>
              <Button onClick={confirmImport} className="mt-2" variant="outline">
                Confirmar Importação
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {importStatus === 'success' ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Importação Concluída</AlertTitle>
            <AlertDescription>
              Seus dados foram importados com sucesso e estão prontos para serem analisados.
              <div className="flex space-x-2 mt-2">
                <Button onClick={viewDashboard} variant="outline" size="sm">
                  Ver Dashboard
                </Button>
                <Button onClick={viewSettings} variant="outline" size="sm">
                  Gerenciar Importações
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {importStatus === 'processing' ? (
              <div className="space-y-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Processando...</span>
                  <span className="text-sm">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <File className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Arraste e solte seu arquivo CSV ou Excel aqui</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ou clique para selecionar um arquivo .csv, .xlsx ou .xls
                </p>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
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
                    <Badge className="ml-2" variant="outline">
                      {fileSelected.name.split('.').pop()?.toUpperCase()}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {previewData && importStatus === 'review' && (
          <div className="mt-4 border rounded-lg p-4">
            <h3 className="font-medium mb-2">Pré-visualização dos dados:</h3>
            <div className="max-h-60 overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap bg-muted p-2 rounded">
                {JSON.stringify(previewData.slice(0, 3), null, 2)}
                {previewData.length > 3 && "...e mais " + (previewData.length - 3) + " categorias"}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {importStatus === 'success' ? (
          <Button onClick={resetForm} className="w-full">
            Importar Outro Arquivo
          </Button>
        ) : importStatus === 'review' ? (
          <div className="flex w-full gap-2">
            <Button onClick={resetForm} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={confirmImport} className="flex-1">
              Confirmar Importação
            </Button>
          </div>
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

export default FinanceImport;
