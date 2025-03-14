
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-accent p-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">CashFlow Horizon</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10">
          Sua plataforma de gestão financeira pessoal, adaptada à sua planilha Excel
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 mb-10">
          <div className="bg-card p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-3">Visualize suas Finanças</h2>
            <p className="mb-4 text-muted-foreground">
              Dashboards interativos que mostram exatamente como você gerencia seu dinheiro, seguindo a mesma estrutura da sua planilha.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-3">Importe seus Dados</h2>
            <p className="mb-4 text-muted-foreground">
              Mantenha a mesma categorização que você já usa, com importação direta da sua planilha Excel existente.
            </p>
          </div>
        </div>
        
        <Button 
          size="lg" 
          className="px-8 gap-2"
          onClick={() => navigate('/dashboard')}
        >
          Acessar Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
