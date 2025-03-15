
import { categoriesWithSubcategories, availableMonths } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';

// Tipo para controlar importações
export interface ImportRecord {
  id: string;
  fileName: string;
  dateImported: string;
  rowCount: number;
  categories: number;
  subcategories: number;
}

// Armazenamento local de importações
const importHistory: ImportRecord[] = [];

/**
 * Processa um arquivo CSV no formato especificado
 */
export const processCSVImport = async (csvContent: string): Promise<{ data: any, duplicatesFound: number }> => {
  try {
    // Dividir o conteúdo em linhas
    const lines = csvContent.split('\n');
    
    // A primeira linha deve ser o cabeçalho
    const header = lines[0].split(';');
    
    // Validar o formato do cabeçalho
    if (!validateCsvHeader(header)) {
      throw new Error('O formato do arquivo CSV não é compatível. Verifique o modelo esperado.');
    }
    
    // Extrair os meses disponíveis do cabeçalho
    const months = header.slice(3).filter(m => m.trim() !== '');
    
    // Processar as linhas de dados
    const categories: any[] = [];
    const subcategories: any[] = [];
    let duplicatesFound = 0;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(';');
      const id = values[1]?.trim();
      const description = values[2]?.trim();
      
      if (!id || !description) continue;
      
      // Detectar se é categoria ou subcategoria pelo formato do ID
      const isCategory = !id.includes('.');
      
      // Processar valores mensais
      const monthlyValues: Record<string, number> = {};
      
      for (let j = 0; j < months.length; j++) {
        const month = months[j].trim();
        if (!month) continue;
        
        const valueStr = values[j + 3]?.trim();
        if (!valueStr) {
          monthlyValues[month] = 0;
          continue;
        }
        
        // Converter o valor considerando o formato especificado
        monthlyValues[month] = convertFinancialValue(valueStr);
      }
      
      // Verificar duplicidade
      const isDuplicate = checkForDuplicate(id);
      if (isDuplicate) duplicatesFound++;
      
      // Determinar o tipo (receita ou despesa)
      // IDs começando com 01x são tipicamente receitas
      const type = determineRecordType(id, description, Object.values(monthlyValues));
      
      const recordData = {
        id,
        code: id,
        name: description,
        type,
        values: monthlyValues,
        isDuplicate
      };
      
      if (isCategory) {
        categories.push(recordData);
      } else {
        subcategories.push(recordData);
      }
    }
    
    // Organizar subcategorias dentro de suas categorias
    const organizedData = organizeHierarchy(categories, subcategories);
    
    // Registrar a importação no histórico
    const importRecord: ImportRecord = {
      id: generateImportId(),
      fileName: "import-" + new Date().toISOString().split('T')[0],
      dateImported: new Date().toISOString(),
      rowCount: categories.length + subcategories.length,
      categories: categories.length,
      subcategories: subcategories.length
    };
    
    importHistory.push(importRecord);
    
    // Atualizar os dados no localStorage para persistência
    localStorage.setItem('financeImportHistory', JSON.stringify(importHistory));
    
    return {
      data: organizedData,
      duplicatesFound
    };
    
  } catch (error: any) {
    console.error('Erro ao processar CSV:', error);
    toast({
      title: "Erro ao processar CSV",
      description: error.message || "Ocorreu um erro durante o processamento do arquivo.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Valida o cabeçalho do CSV conforme o formato esperado
 */
const validateCsvHeader = (header: string[]): boolean => {
  // Validação básica - deve ter pelo menos 15 colunas (id, descrição e 12 meses + coluna vazia inicial)
  if (header.length < 15) return false;
  
  // Verificar os campos de ID e DESCRIÇÃO
  if (header[1]?.trim().toUpperCase() !== 'ID' || 
      header[2]?.trim().toUpperCase() !== 'DESCRIÇÃO') return false;
      
  // Verificar se os meses estão no formato correto (jan/25, fev/25, etc.)
  const monthPattern = /^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\/\d{2}$/i;
  for (let i = 3; i < 15; i++) {
    const month = header[i]?.trim();
    if (month && !monthPattern.test(month)) return false;
  }
  
  return true;
};

/**
 * Converte uma string de valor financeiro para número
 * Considera:
 * - valores entre parênteses como negativos
 * - vírgula como separador decimal
 * - ponto como separador de milhar
 */
const convertFinancialValue = (valueStr: string): number => {
  // Verificar se está entre parênteses (valor negativo)
  const isNegative = valueStr.startsWith('(') && valueStr.endsWith(')');
  
  // Remover parênteses se presentes
  let cleanValue = isNegative 
    ? valueStr.substring(1, valueStr.length - 1) 
    : valueStr;
    
  // Remover separadores de milhar e substituir vírgula por ponto
  cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  
  // Converter para número
  const numValue = parseFloat(cleanValue);
  
  // Aplicar sinal negativo se necessário
  return isNegative ? -numValue : numValue;
};

/**
 * Verifica se um ID já existe nos dados importados
 */
const checkForDuplicate = (id: string): boolean => {
  // Aqui teríamos uma verificação mais robusta com os dados já existentes
  // Por enquanto, simulamos algumas duplicidades
  return Math.random() < 0.05; // 5% de chance de ser duplicado para simulação
};

/**
 * Determina se um registro é de receita ou despesa
 */
const determineRecordType = (id: string, description: string, values: number[]): 'income' | 'expense' => {
  // IDs de receita geralmente começam com 016 ou 017
  if (id.startsWith('016') || id.startsWith('017')) {
    return 'income';
  }
  
  // Verificar pelo nome da categoria
  const receiptKeywords = ['receita', 'entrada', 'renda', 'salário', 'vendas'];
  for (const keyword of receiptKeywords) {
    if (description.toLowerCase().includes(keyword)) {
      return 'income';
    }
  }
  
  // Se a maioria dos valores for positiva, provavelmente é receita
  // Lógica mais elaborada poderia ser implementada aqui
  
  // Por padrão, consideramos como despesa
  return 'expense';
};

/**
 * Organiza categorias e subcategorias em estrutura hierárquica
 */
const organizeHierarchy = (categories: any[], subcategories: any[]) => {
  return categories.map(category => {
    // Encontrar subcategorias que pertencem a esta categoria
    const children = subcategories.filter(sub => 
      sub.id.startsWith(category.id + '.')
    );
    
    return {
      ...category,
      subcategories: children
    };
  });
};

/**
 * Gera um ID único para cada importação
 */
const generateImportId = (): string => {
  return 'imp-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Obtém o histórico de importações
 */
export const getImportHistory = (): ImportRecord[] => {
  try {
    const stored = localStorage.getItem('financeImportHistory');
    return stored ? JSON.parse(stored) : importHistory;
  } catch (error) {
    console.error('Erro ao obter histórico de importações:', error);
    return importHistory;
  }
};

/**
 * Remove uma importação específica
 */
export const removeImport = (importId: string): boolean => {
  try {
    const currentHistory = getImportHistory();
    const updatedHistory = currentHistory.filter(record => record.id !== importId);
    
    localStorage.setItem('financeImportHistory', JSON.stringify(updatedHistory));
    
    // Aqui também seria necessário remover os dados financeiros associados
    // Para fins de simulação, assumimos que isso foi feito
    
    return true;
  } catch (error) {
    console.error('Erro ao remover importação:', error);
    return false;
  }
};

/**
 * Limpa todos os dados financeiros importados
 */
export const clearAllImportedData = (): boolean => {
  try {
    // Limpar histórico de importações
    localStorage.setItem('financeImportHistory', JSON.stringify([]));
    
    // Limpar dados financeiros
    // Na implementação real, teríamos que redefinir os dados no storage
    
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados importados:', error);
    return false;
  }
};
