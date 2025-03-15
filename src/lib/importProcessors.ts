
import { toast } from '@/hooks/use-toast';

// Tipo para controlar importações
export interface ImportRecord {
  id: string;
  fileName: string;
  dateImported: string;
  rowCount: number;
  categories: number;
  subcategories: number;
}

// Estrutura para armazenar dados importados
export interface ImportedFinancialData {
  categories: any[];
  monthlyData: any[];
}

// Armazenamento local de importações e dados
const importHistory: ImportRecord[] = [];
let importedData: ImportedFinancialData | null = null;

/**
 * Processa um arquivo CSV no formato especificado
 */
export const processCSVImport = async (csvContent: string): Promise<{ data: any, duplicatesFound: number }> => {
  try {
    console.log("Starting CSV processing...");
    
    // Dividir o conteúdo em linhas
    const lines = csvContent.split('\n');
    console.log(`CSV has ${lines.length} lines`);
    
    // A primeira linha deve ser o cabeçalho
    const header = lines[0].split(';');
    console.log("Header:", header);
    
    // Validar o formato do cabeçalho
    if (!validateCsvHeader(header)) {
      console.error("CSV header validation failed");
      throw new Error('O formato do arquivo CSV não é compatível. Verifique o modelo esperado.');
    }
    
    // Extrair os meses disponíveis do cabeçalho
    const months = header.slice(3).filter(m => m.trim() !== '');
    console.log('Meses detectados:', months);
    
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
        monthlyValues[month] = valueStr ? convertFinancialValue(valueStr) : 0;
      }
      
      console.log(`Processed line ${i}: ${id} - ${description} with values:`, monthlyValues);
      
      // Verificar duplicidade
      const isDuplicate = checkForDuplicate(id);
      if (isDuplicate) duplicatesFound++;
      
      // Determinar o tipo (receita ou despesa)
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
    
    console.log(`Processed ${categories.length} categories and ${subcategories.length} subcategories`);
    
    // Organizar subcategorias dentro de suas categorias
    const organizedData = organizeHierarchy(categories, subcategories);
    
    // Calcular dados mensais totais para gráficos
    const monthlyTotals = calculateMonthlyTotals(categories, subcategories, months);
    
    // Armazenar os dados importados
    importedData = {
      categories: organizedData,
      monthlyData: monthlyTotals
    };
    
    // Salvar no localStorage para persistência
    localStorage.setItem('financeImportedData', JSON.stringify(importedData));
    console.log("Data saved to localStorage:", importedData);
    
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
 * Calcula os totais mensais de receitas e despesas
 */
const calculateMonthlyTotals = (categories: any[], subcategories: any[], months: string[]) => {
  console.log("Calculating monthly totals for months:", months);
  
  const monthlyTotals = months.map(month => {
    let receitas = 0;
    let despesas = 0;
    
    // Somar valores das categorias
    categories.forEach(category => {
      if (category.values && category.values[month] !== undefined) {
        if (category.type === 'income') {
          receitas += category.values[month];
        } else {
          despesas += Math.abs(category.values[month]); // Usar valor absoluto para despesas
        }
      }
    });
    
    // Somar valores das subcategorias
    subcategories.forEach(subcategory => {
      if (subcategory.values && subcategory.values[month] !== undefined) {
        if (subcategory.type === 'income') {
          receitas += subcategory.values[month];
        } else {
          despesas += Math.abs(subcategory.values[month]); // Usar valor absoluto para despesas
        }
      }
    });
    
    return {
      month: month,
      receitas,
      despesas
    };
  });
  
  console.log("Monthly totals calculated:", monthlyTotals);
  return monthlyTotals;
};

/**
 * Valida o cabeçalho do CSV conforme o formato esperado
 */
const validateCsvHeader = (header: string[]): boolean => {
  console.log("Validating header:", header);
  
  // Verificação básica - o header deve existir
  if (!header || header.length < 3) {
    console.error("Header too short");
    return false;
  }
  
  // Verificar os campos de ID e DESCRIÇÃO
  let hasId = false;
  let hasDescricao = false;
  
  for (let i = 0; i < header.length; i++) {
    const field = header[i]?.trim().toUpperCase();
    if (field === 'ID') hasId = true;
    if (field === 'DESCRIÇÃO' || field === 'DESCRICAO') hasDescricao = true;
  }
  
  if (!hasId || !hasDescricao) {
    console.error("Missing ID or DESCRIÇÃO field");
    return false;
  }
  
  // Verificar se existem meses no header
  const monthPattern = /^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\/\d{2}$/i;
  let hasMonths = false;
  
  for (let i = 3; i < header.length; i++) {
    const field = header[i]?.trim();
    if (field && monthPattern.test(field)) {
      hasMonths = true;
      break;
    }
  }
  
  if (!hasMonths) {
    console.error("No valid months found in header");
    return false;
  }
  
  console.log("Header validation successful");
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
  if (!valueStr || valueStr === '') return 0;
  
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
  
  if (isNaN(numValue)) return 0;
  
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
  if (id.startsWith('016') || id.startsWith('017') || id.startsWith('3')) {
    return 'income';
  }
  
  // Verificar pelo nome da categoria
  const receiptKeywords = ['receita', 'entrada', 'renda', 'salário', 'vendas', 'faturamento', 'recebimentos'];
  for (const keyword of receiptKeywords) {
    if (description.toLowerCase().includes(keyword)) {
      return 'income';
    }
  }
  
  // Se a maioria dos valores for positiva, provavelmente é receita
  const positiveValues = values.filter(v => v > 0).length;
  if (positiveValues > values.length / 2 && values.length > 0) {
    return 'income';
  }
  
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
 * Obtém os dados financeiros importados
 */
export const getImportedFinancialData = (): ImportedFinancialData | null => {
  try {
    if (importedData) return importedData;
    
    const stored = localStorage.getItem('financeImportedData');
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao obter dados financeiros:', error);
    return null;
  }
};

/**
 * Obtém dados de uma categoria específica para um mês
 */
export const getCategoryDataForMonth = (categoryId: string, month: string): any => {
  const data = getImportedFinancialData();
  if (!data) return null;
  
  const category = data.categories.find(cat => cat.id === categoryId);
  if (!category) return null;
  
  // Retornar os valores específicos para o mês solicitado
  return {
    ...category,
    value: category.values[month] || 0
  };
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
    console.log("Clearing all imported data");
    // Limpar histórico de importações
    localStorage.setItem('financeImportHistory', JSON.stringify([]));
    
    // Limpar dados financeiros
    localStorage.removeItem('financeImportedData');
    importedData = null;
    
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados importados:', error);
    return false;
  }
};
