"use client";

import { Fragment } from 'react';
import { motion } from 'framer-motion';

interface Props {
  typeMonthHeatmap: any[];
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getHeatColor(value: number, max: number): string {
  if (value === 0) return 'rgba(255,255,255,0.03)';
  const t = Math.min(1, value / (max * 0.5));
  // Interpolate from dim purple to bright pink
  const r = Math.round(99 + (236 - 99) * t);
  const g = Math.round(102 + (72 - 102) * t);
  const b = Math.round(241 + (153 - 241) * t);
  return `rgba(${r}, ${g}, ${b}, ${(0.2 + 0.7 * t).toFixed(2)})`;
}

export default function SeasonalHeatmap({ typeMonthHeatmap }: Props) {
  let globalMax = 0;
  typeMonthHeatmap.forEach(row => {
    months.forEach(m => {
      if (row[m] > globalMax) globalMax = row[m];
    });
  });

  return (
    <section className="narrative-section">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left: Text */}
          <div className="lg:col-span-2">
            <p className="text-xs tracking-[0.3em] uppercase text-teal-300/50 mb-3">Seasonal Patterns</p>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-6">
              When do disasters <em className="font-serif italic bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent font-normal">strike?</em>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              Tornado season peaks in spring, hurricanes dominate late summer, and fires rage through autumn. Understanding these cycles is critical for preparedness planning.
            </p>

            <div className="space-y-3">
              {[
                { label: 'Tornado Season', period: 'Apr – Jun', color: 'bg-emerald-500' },
                { label: 'Hurricane Season', period: 'Aug – Oct', color: 'bg-pink-500' },
                { label: 'Fire Season', period: 'Jul – Nov', color: 'bg-amber-500' },
                { label: 'Storm Season', period: 'Mar – Jul', color: 'bg-purple-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.color} opacity-70`} />
                  <span className="text-sm text-white/60">{s.label}</span>
                  <span className="text-xs text-white/30 ml-auto font-mono">{s.period}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Heatmap Grid */}
          <motion.div
            className="lg:col-span-3 liquid-glass-strong p-6"
            style={{ '--radius': '1.5rem' } as any}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="text-white/80 font-medium mb-6">Disaster Type × Month Heatmap</h3>

            {/* Header row */}
            <div className="grid gap-1" style={{ gridTemplateColumns: '120px repeat(12, 1fr)' }}>
              <div />
              {months.map(m => (
                <div key={m} className="text-[10px] text-white/40 text-center font-medium">{m}</div>
              ))}

              {/* Data rows */}
              {typeMonthHeatmap.map((row, i) => (
                <Fragment key={row.type}>
                  <div className="text-xs text-white/60 pr-2 flex items-center truncate">{row.type}</div>
                  {months.map((m) => (
                    <motion.div
                      key={`${row.type}-${m}`}
                      className="aspect-square rounded-md flex items-center justify-center text-[9px] font-mono text-white/70 cursor-default hover:scale-110 transition-transform"
                      style={{ backgroundColor: getHeatColor(row[m], globalMax) }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      title={`${row.type} in ${m}: ${row[m]}`}
                    >
                      {row[m] > 0 ? row[m] : ''}
                    </motion.div>
                  ))}
                </Fragment>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <span className="text-[10px] text-white/30">Low</span>
              <div className="flex-grow h-2 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.2), rgba(168,85,247,0.5), rgba(236,72,153,0.9))' }} />
              <span className="text-[10px] text-white/30">High</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
