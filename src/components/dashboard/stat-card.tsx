import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  alertLevel?: 'critical' | 'warning' | 'normal';
};

export function StatCard({ icon: Icon, title, value, description, alertLevel }: StatCardProps) {
  const alertVariant = alertLevel === 'critical' ? 'destructive' : alertLevel === 'warning' ? 'secondary' : 'default';
  const alertText = alertLevel === 'critical' ? 'Critical' : alertLevel === 'warning' ? 'Warning' : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{value}</span>
          {alertText && <Badge variant={alertVariant}>{alertText}</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
