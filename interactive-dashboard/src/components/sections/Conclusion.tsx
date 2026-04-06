"use client";

import { motion } from 'framer-motion';
import { TrendingUp, MapPin, ShieldAlert } from 'lucide-react';

const insights = [
  {
    icon: TrendingUp,
    title: 'The Rising Tide',
    body: 'Disaster declarations have increased consistently over 70 years, driven primarily by the explosion in Severe Storm declarations. The 5-year moving average confirms a clear, accelerating upward trend since the 1990s.',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    icon: MapPin,
    title: 'Geographic Inequality',
    body: 'A small number of states — Texas, California, Florida, Oklahoma, Louisiana — bear a vastly disproportionate share of the national disaster burden. Each faces a unique threat profile requiring tailored emergency strategies.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: ShieldAlert,
    title: 'The Assistance Gap',
    body: 'Public Assistance is triggered at near-universal rates across all major disaster types. Individual Assistance reaches fewer events — high-frequency storms damage infrastructure but often don\'t trigger household aid.',
    gradient: 'from-cyan-500 to-teal-500',
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.2 } } };
const item = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Conclusion() {
  return (
    <section className="narrative-section">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-yellow-300/50 mb-3">Synthesis</p>
        <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-4">
          Key <em className="font-serif italic bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-normal">takeaways</em>
        </h2>
        <p className="text-white/50 max-w-xl text-lg mb-12">
          Three overarching narratives emerge from 70 years of federal disaster data.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {insights.map((ins, i) => (
          <motion.div
            key={ins.title}
            variants={item}
            className="liquid-glass-strong p-8 flex flex-col hover:scale-[1.02] transition-transform duration-300"
            style={{ '--radius': '1.5rem' } as any}
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${ins.gradient} flex items-center justify-center mb-6 opacity-80`}>
              <ins.icon size={22} className="text-white" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">{ins.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed flex-grow">{ins.body}</p>
            <div className={`mt-6 h-[2px] bg-gradient-to-r ${ins.gradient} opacity-30 rounded-full`} />
            <p className="text-xs text-white/20 mt-4 uppercase tracking-wider">Insight {i + 1} of 3</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="section-divider" />
        <p className="text-xs tracking-[0.2em] text-white/25 uppercase">USND Visualization Project — FEMA Dataset Analysis</p>
        <p className="text-xs text-white/10 mt-2">Built with Next.js · React · Recharts · React Simple Maps</p>
      </motion.div>
    </section>
  );
}
