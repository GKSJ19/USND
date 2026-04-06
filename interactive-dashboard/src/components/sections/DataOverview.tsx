"use client";

import { motion } from 'framer-motion';
import { Database, Calendar, MapPin, Zap } from 'lucide-react';

interface Props {
  meta: { totalRows: number; uniqueDeclarations: number; minYear: number; maxYear: number; stateCount: number; typeCount: number };
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function DataOverview({ meta }: Props) {
  const stats = [
    { icon: Database, label: 'Total Records', value: meta.totalRows.toLocaleString(), sub: 'county-level rows in the dataset', accent: 'from-purple-500 to-indigo-500' },
    { icon: Zap, label: 'Unique Declarations', value: meta.uniqueDeclarations.toLocaleString(), sub: 'distinct disaster events', accent: 'from-pink-500 to-rose-500' },
    { icon: Calendar, label: 'Time Span', value: `${meta.minYear} – ${meta.maxYear}`, sub: `${meta.maxYear - meta.minYear + 1} years of data`, accent: 'from-cyan-500 to-blue-500' },
    { icon: MapPin, label: 'Coverage', value: `${meta.stateCount} States`, sub: `across ${meta.typeCount} disaster types`, accent: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <section className="narrative-section">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-purple-300/50 mb-3">Milestone 1</p>
        <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-4">
          The <em className="font-serif italic bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-normal">data</em>
        </h2>
        <p className="text-white/50 max-w-xl text-lg mb-12">
          We start with FEMA&apos;s public dataset — every federally declared disaster since 1953, cleaned and validated.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {stats.map(s => (
          <motion.div
            key={s.label}
            variants={item}
            className="liquid-glass-strong p-6 stat-glow transition-all duration-300 hover:scale-[1.03] group"
            style={{ '--radius': '1.25rem' } as any}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.accent} flex items-center justify-center mb-5 opacity-80 group-hover:opacity-100 transition-opacity`}>
              <s.icon size={18} className="text-white" />
            </div>
            <p className="text-3xl font-semibold text-white tracking-tight">{s.value}</p>
            <p className="text-sm text-white/60 mt-1">{s.label}</p>
            <p className="text-xs text-white/30 mt-2">{s.sub}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
