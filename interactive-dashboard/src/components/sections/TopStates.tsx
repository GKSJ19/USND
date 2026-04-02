"use client";

import { motion } from 'framer-motion';

interface Props {
  topStatesRanking: { state: string; total: number; topType: string; ihPct: number; paPct: number }[];
}

const RANK_COLORS = ['#a855f7', '#ec4899', '#f59e0b', '#06b6d4', '#10b981', '#6366f1', '#f43f5e', '#14b8a6', '#8b5cf6', '#f97316', '#84cc16', '#e879f9', '#0ea5e9', '#fb923c', '#a3e635'];

export default function TopStates({ topStatesRanking }: Props) {
  const maxTotal = topStatesRanking[0]?.total || 1;

  return (
    <section className="narrative-section">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-amber-300/50 mb-3">State Rankings</p>
        <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-4">
          Most <em className="font-serif italic bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent font-normal">vulnerable</em> states
        </h2>
        <p className="text-white/50 max-w-2xl text-lg mb-12">
          These 15 states account for the vast majority of all federal disaster declarations. Each faces a unique risk profile.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar ranking */}
        <motion.div
          className="liquid-glass-strong p-6"
          style={{ '--radius': '1.5rem' } as any}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-3">
            {topStatesRanking.map((s, i) => {
              const pct = (s.total / maxTotal) * 100;
              return (
                <motion.div
                  key={s.state}
                  className="flex items-center gap-3 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <span className="text-xs text-white/30 w-5 text-right font-mono">{i + 1}</span>
                  <span className="text-sm text-white/80 font-medium w-8">{s.state}</span>
                  <div className="flex-grow h-7 bg-white/5 rounded-md overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-md flex items-center px-3"
                      style={{ width: `${pct}%`, backgroundColor: RANK_COLORS[i], opacity: 0.7 }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    >
                      <span className="text-[10px] text-white font-bold whitespace-nowrap">{s.total}</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Top state cards */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {topStatesRanking.slice(0, 5).map((s, i) => (
            <div key={s.state} className="liquid-glass p-5 flex items-center gap-5 hover:scale-[1.01] transition-transform" style={{ '--radius': '1rem' } as any}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: RANK_COLORS[i], opacity: 0.8 }}>
                {s.state}
              </div>
              <div className="flex-grow">
                <p className="text-white font-medium">{s.state} — <span className="text-white/60 font-normal">{s.total} declarations</span></p>
                <p className="text-xs text-white/40 mt-1">Top threat: <span className="text-white/70">{s.topType}</span></p>
              </div>
              <div className="flex gap-3 text-center">
                <div>
                  <p className="text-sm font-semibold text-purple-400">{s.ihPct}%</p>
                  <p className="text-[9px] text-white/30 uppercase">IA</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cyan-400">{s.paPct}%</p>
                  <p className="text-[9px] text-white/30 uppercase">PA</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
