
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, RefreshCw, FileSearch, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { getImportHistory, removeImport, clearAllImportedData, ImportRecord } from '@/lib/importProcessors';

const Settings = () => {
  const [importHistory, setImportHistory] = useState<ImportRecord[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('importacoes');
  const { toast } = useToast();

  useEffect(() => {
    // Carregar histórico de importações
    loadImportHistory();
  }, []);

  const loadImportHistory = () => {
    const history = getImportHistory();
    setImportHistory(history);
  };

  const handleRemoveImport = (importId: string) => {
    const success = removeImport(importId);
    
    if (success) {
      loadImportHistory();
      toast({
        title: "Importação removida",
        description: "Os dados associados a esta importação foram removidos com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao remover importação",
        description: "Ocorreu um erro ao tentar remover esta importação.",
        variant: "destructive",
      });
    }
  };

  const handleClearAllData = () => {
    const success = clearAllImportedData();
    
    if (success) {
      loadImportHistory();
      toast({
        title: "Dados limpos",
        description: "Todos os dados financeiros importados foram removidos com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao limpar dados",
        description: "Ocorreu um erro ao tentar limpar todos os dados importados.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas importações e configure o sistema
        </p>
      </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="importacoes">Importações</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="importacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Importações</CardTitle>
              <CardDescription>
                Gerencie arquivos importados e evite duplicidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {importHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Arquivo</TableHead>
                      <TableHead>Data de Importação</TableHead>
                      <TableHead>Registros</TableHead>
                      <TableHead>Categorias</TableHead>
                      <TableHead>Subcategorias</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.fileName}</TableCell>
                        <TableCell>
                          {format(new Date(record.dateImported), 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                        <TableCell>{record.rowCount}</TableCell>
                        <TableCell>{record.categories}</TableCell>
                        <TableCell>{record.subcategories}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" title="Visualizar">
                              <FileSearch className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" title="Remover">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remover importação</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso removerá permanentemente os dados desta importação.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoveImport(record.id)}>
                                    Continuar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Nenhuma importação encontrada</p>
                  <Button variant="outline">Importar Agora</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={loadImportHistory}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={importHistory.length === 0}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Limpar Todos os Dados
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Limpar todos os dados</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso removerá permanentemente todos os dados financeiros importados.
                      O dashboard será redefinido para o estado vazio.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllData}>
                      Sim, limpar tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detecção de Duplicidades</CardTitle>
              <CardDescription>
                Configurações para identificação automática de dados duplicados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Verificar por ID</p>
                    <p className="text-sm text-muted-foreground">
                      Impedir importação de IDs já existentes
                    </p>
                  </div>
                  <input type="checkbox" checked readOnly className="h-4 w-4" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Verificar por nome e período</p>
                    <p className="text-sm text-muted-foreground">
                      Detectar categorias com mesmo nome e período
                    </p>
                  </div>
                  <input type="checkbox" checked readOnly className="h-4 w-4" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Solicitar confirmação</p>
                    <p className="text-sm text-muted-foreground">
                      Mostrar tela de confirmação antes da importação
                    </p>
                  </div>
                  <input type="checkbox" checked readOnly className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências Gerais</CardTitle>
              <CardDescription>
                Configure as opções gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mês inicial</p>
                    <p className="text-sm text-muted-foreground">
                      Definir qual mês deve ser mostrado inicialmente
                    </p>
                  </div>
                  <select className="border rounded p-1">
                    <option>Janeiro</option>
                    <option>Fevereiro</option>
                    <option selected>Maio</option>
                    <option>Dezembro</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Formato de data</p>
                    <p className="text-sm text-muted-foreground">
                      Como as datas devem ser exibidas
                    </p>
                  </div>
                  <select className="border rounded p-1">
                    <option selected>DD/MM/AAAA</option>
                    <option>MM/DD/AAAA</option>
                    <option>AAAA-MM-DD</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Carregar dados automaticamente</p>
                    <p className="text-sm text-muted-foreground">
                      Carregar dados ao abrir o dashboard
                    </p>
                  </div>
                  <input type="checkbox" checked readOnly className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classificação de Categorias</CardTitle>
              <CardDescription>
                Configure quais IDs são considerados receitas ou despesas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">IDs de Receitas</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-green-100 rounded-full text-green-800">016</div>
                    <div className="px-3 py-1 bg-green-100 rounded-full text-green-800">017</div>
                    <Button variant="outline" className="rounded-full text-xs h-7">
                      Adicionar
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">IDs de Despesas</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-red-100 rounded-full text-red-800">001</div>
                    <div className="px-3 py-1 bg-red-100 rounded-full text-red-800">002</div>
                    <div className="px-3 py-1 bg-red-100 rounded-full text-red-800">003</div>
                    <Button variant="outline" className="rounded-full text-xs h-7">
                      Adicionar
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="font-medium mb-2">Palavras-chave para identificar receitas</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-green-100 rounded-full text-green-800">receita</div>
                    <div className="px-3 py-1 bg-green-100 rounded-full text-green-800">entrada</div>
                    <div className="px-3 py-1 bg-green-100 rounded-full text-green-800">renda</div>
                    <div className="px-3 py-1 bg-green-100 rounded-full text-green-800">salário</div>
                    <Button variant="outline" className="rounded-full text-xs h-7">
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
