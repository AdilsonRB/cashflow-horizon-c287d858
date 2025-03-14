
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PieChart, 
  LineChart, 
  Upload, 
  Download, 
  Settings,
  Home
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const items = [
    {
      title: "Início",
      icon: Home,
      href: "/",
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Análise Detalhada",
      icon: PieChart,
      href: "/analysis",
    },
    {
      title: "Evolução Mensal",
      icon: LineChart,
      href: "/evolution",
    },
    {
      title: "Importar Dados",
      icon: Upload,
      href: "/import",
    },
    {
      title: "Exportar Relatórios",
      icon: Download,
      href: "/export",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar p-4 border-r">
      <div className="mb-8 mt-4 px-4">
        <h1 className="text-2xl font-bold text-primary">CashFlow Horizon</h1>
        <p className="text-sm text-muted-foreground">Gestão Financeira Pessoal</p>
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
              location.pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
