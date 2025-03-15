
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, FileText, Trash2, FileX, CheckCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getImportHistory, removeImport, clearAllImportedData, ImportRecord } from '@/lib/importProcessors';

const Settings = () => {
  const [importHistory, setImportHistory] = useState<ImportRecord[]>(getImportHistory());
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleRemoveImport = (importId: string) => {
    if (removeImport(importId)) {
      setImportHistory(getImportHistory());
      toast({
        title: "Importação removida",
        description: "A importação foi removida com sucesso e os dados atualizados.",
      });
    } else {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a importação selecionada.",
        variant: "destructive"
      });
    }
  };
  
  const handleClearAll = () => {
    setIsClearing(true);
    setTimeout(() => {
      if (clearAllImportedData()) {
        setImportHistory([]);
        toast({
          title: "Dados limpos",
          description: "Todos os dados importados foram removidos com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao limpar",
          description: "Não foi possível limpar todos os dados importados.",
          variant: "destructive"
        });
      }
      setIsClearing(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações e dados do sistema
        </p>
      </div>
      
      <Tabs defaultValue="imports" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="imports">Importações</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="export">Exportação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="imports">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Importações</CardTitle>
              <CardDescription>
                Gerencie os arquivos que foram importados para o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {importHistory.length === 0 ? (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Nenhuma importação encontrada</AlertTitle>
                  <AlertDescription>
                    Você ainda não importou nenhum arquivo para o sistema.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableCaption>Lista de importações realizadas</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Arquivo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Registros</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.fileName}</TableCell>
                        <TableCell>{formatDate(record.dateImported)}</TableCell>
                        <TableCell>
                          {record.rowCount} registros
                          <div className="text-xs text-muted-foreground">
                            {record.categories} categorias, {record.subcategories} subcategorias
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" /> Concluído
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveImport(record.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="mt-6">
                <Button 
                  variant="destructive"
                  onClick={handleClearAll}
                  disabled={importHistory.length === 0 || isClearing}
                  className="flex items-center"
                >
                  {isClearing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Limpando...
                    </>
                  ) : (
                    <>
                      <FileX className="h-4 w-4 mr-2" />
                      Limpar Todos os Dados
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Esta ação removerá todos os dados financeiros importados e não pode ser desfeita.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Personalize as configurações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações</p>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas sobre suas finanças
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tema Escuro</p>
                  <p className="text-sm text-muted-foreground">
                    Ative o modo escuro para reduzir o cansaço visual
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Backup Automático</p>
                  <p className="text-sm text-muted-foreground">
                    Faça backup automaticamente de seus dados
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Moeda</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input placeholder="R$" />
                  </div>
                  <Button variant="secondary">Salvar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Exportação</CardTitle>
              <CardDescription>
                Defina como seus dados serão exportados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Incluir Gráficos</p>
                  <p className="text-sm text-muted-foreground">
                    Adicione gráficos aos relatórios exportados
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Detalhamento Completo</p>
                  <p className="text-sm text-muted-foreground">
                    Inclua todas as subcategorias nos relatórios
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Nome Padrão do Arquivo</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input placeholder="financas_relatorio" defaultValue="financas_relatorio" />
                  </div>
                  <Button variant="secondary">Salvar</Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar PDF Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
