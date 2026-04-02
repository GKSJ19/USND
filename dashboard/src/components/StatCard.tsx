import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

const StatCard = ({ icon: Icon, value, label }: StatCardProps) => (
  <div className="bg-card rounded-lg p-5 flex flex-col gap-2 border border-border">
    <Icon className="w-5 h-5 text-muted-foreground" />
    <span className="text-3xl font-bold text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
  </div>
);

export default StatCard;
