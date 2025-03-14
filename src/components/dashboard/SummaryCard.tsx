
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  changeType = "neutral",
  className,
}) => {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="py-0">
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {change !== undefined && (
          <div className="flex items-center mt-2 text-sm">
            {changeType === "positive" ? (
              <ArrowUp className="w-3 h-3 text-income mr-1" />
            ) : changeType === "negative" ? (
              <ArrowDown className="w-3 h-3 text-expense mr-1" />
            ) : (
              <Minus className="w-3 h-3 text-neutral mr-1" />
            )}
            <span
              className={cn(
                "font-medium",
                changeType === "positive" && "text-income",
                changeType === "negative" && "text-expense",
                changeType === "neutral" && "text-neutral"
              )}
            >
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-muted-foreground ml-1 text-xs">em relação ao mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
