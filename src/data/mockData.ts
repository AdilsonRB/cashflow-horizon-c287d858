
// This file contains mock data for the finance application
// In a real implementation, this would be replaced with API calls to fetch data

export const monthlyData = [
  { month: 'Jan/25', receitas: 12500, despesas: 8700 },
  { month: 'Fev/25', receitas: 12800, despesas: 7900 },
  { month: 'Mar/25', receitas: 13200, despesas: 9200 },
  { month: 'Abr/25', receitas: 12900, despesas: 8800 },
  { month: 'Mai/25', receitas: 13500, despesas: 9100 },
  { month: 'Jun/25', receitas: 14000, despesas: 9500 },
];

export const expenseDistribution = [
  { name: 'Moradia', value: 3200, color: '#ef4444' },
  { name: 'Alimentação', value: 1800, color: '#f97316' },
  { name: 'Transporte', value: 1500, color: '#eab308' },
  { name: 'Saúde', value: 1200, color: '#22c55e' },
  { name: 'Lazer', value: 800, color: '#3b82f6' },
  { name: 'Educação', value: 500, color: '#8b5cf6' },
  { name: 'Outros', value: 500, color: '#6b7280' },
];

export const topExpenses = [
  { name: 'Aluguel', value: 2500, code: '001.01' },
  { name: 'Supermercado', value: 1200, code: '002.01' },
  { name: 'Combustível', value: 600, code: '003.01' },
  { name: 'Plano de Saúde', value: 700, code: '004.01' },
  { name: 'Streaming', value: 250, code: '005.01' },
  { name: 'Internet', value: 200, code: '006.01' },
  { name: 'Restaurantes', value: 500, code: '002.02' },
  { name: 'Energia', value: 300, code: '001.02' },
  { name: 'Água', value: 150, code: '001.03' },
  { name: 'Telefone', value: 180, code: '006.02' },
  { name: 'Seguro Auto', value: 350, code: '003.02' },
  { name: 'Academia', value: 160, code: '005.02' },
];

export const categoriesWithSubcategories = [
  {
    id: '001',
    code: '001',
    name: 'Moradia',
    type: 'expense',
    value: 3200,
    subcategories: [
      { id: '001.01', code: '001.01', name: 'Aluguel', type: 'expense', value: 2500 },
      { id: '001.02', code: '001.02', name: 'Energia', type: 'expense', value: 300 },
      { id: '001.03', code: '001.03', name: 'Água', type: 'expense', value: 150 },
      { id: '001.04', code: '001.04', name: 'Condomínio', type: 'expense', value: 250 },
    ],
  },
  {
    id: '002',
    code: '002',
    name: 'Alimentação',
    type: 'expense',
    value: 1800,
    subcategories: [
      { id: '002.01', code: '002.01', name: 'Supermercado', type: 'expense', value: 1200 },
      { id: '002.02', code: '002.02', name: 'Restaurantes', type: 'expense', value: 500 },
      { id: '002.03', code: '002.03', name: 'Delivery', type: 'expense', value: 100 },
    ],
  },
  {
    id: '003',
    code: '003',
    name: 'Transporte',
    type: 'expense',
    value: 1500,
    subcategories: [
      { id: '003.01', code: '003.01', name: 'Combustível', type: 'expense', value: 600 },
      { id: '003.02', code: '003.02', name: 'Seguro Auto', type: 'expense', value: 350 },
      { id: '003.03', code: '003.03', name: 'Manutenção', type: 'expense', value: 300 },
      { id: '003.04', code: '003.04', name: 'Estacionamento', type: 'expense', value: 150 },
      { id: '003.05', code: '003.05', name: 'Transporte Público', type: 'expense', value: 100 },
    ],
  },
  {
    id: '016',
    code: '016',
    name: 'Receitas',
    type: 'income',
    value: 13500,
    subcategories: [
      { id: '016.01', code: '016.01', name: 'Salário', type: 'income', value: 10000 },
      { id: '016.02', code: '016.02', name: 'Investimentos', type: 'income', value: 2000 },
      { id: '016.03', code: '016.03', name: 'Freelance', type: 'income', value: 1500 },
    ],
  },
];

export const availableMonths = [
  'Jan/25',
  'Fev/25',
  'Mar/25',
  'Abr/25',
  'Mai/25',
  'Jun/25',
  'Jul/25',
  'Ago/25',
  'Set/25',
  'Out/25',
  'Nov/25',
  'Dez/25',
];

export const financialSummary = {
  totalIncome: 13500,
  totalExpenses: 9500,
  grossResult: 4000,
  adjustedResult: 3200,
  incomeChange: 3.8,
  expensesChange: 4.4,
  resultChange: 2.5,
};
