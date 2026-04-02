import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: 'primary' | 'accent' | 'warning' | 'destructive';
}

const colorMap = {
  primary: 'from-primary/20 to-primary/5 border-primary/30',
  accent: 'from-accent/20 to-accent/5 border-accent/30',
  warning: 'from-warning/20 to-warning/5 border-warning/30',
  destructive: 'from-destructive/20 to-destructive/5 border-destructive/30',
};

const iconColorMap = {
  primary: 'text-primary',
  accent: 'text-accent',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

export function StatCard({ title, value, subtitle, icon, color = 'primary' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card bg-gradient-to-br ${colorMap[color]} p-5 stat-glow`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`${iconColorMap[color]} opacity-80`}>{icon}</div>
      </div>
    </motion.div>
  );
}
