import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const ChartCard = ({ title, children, className = "" }: ChartCardProps) => (
  <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
    <h3 className="text-xs font-semibold text-chart-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-chart-cyan inline-block" />
      {title}
    </h3>
    {children}
  </div>
);

export default ChartCard;
