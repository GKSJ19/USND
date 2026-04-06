"use client";

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="narrative-section items-center text-center relative overflow-hidden">
      <motion.div
        className="relative z-10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="text-xs tracking-[0.3em] uppercase text-purple-300/60 mb-8">FEMA Disaster Declarations Dataset</p>

        <h1 className="text-5xl lg:text-7xl font-medium tracking-[-0.04em] text-white leading-[1.1]">
          Visualizing the{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            <em className="font-serif italic font-normal">impact</em>
          </span>
          <br />of natural disasters
        </h1>

        <p className="mt-8 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          An interactive exploration of 70 years of federally declared disasters across the United States — their frequency, geography, and composition.
        </p>

        <div className="mt-12 flex justify-center gap-4 flex-wrap">
          {[
            { label: 'Temporal Trends', color: 'from-purple-500/20 to-purple-500/5' },
            { label: 'Geographic Patterns', color: 'from-pink-500/20 to-pink-500/5' },
            { label: 'Incident Analysis', color: 'from-cyan-500/20 to-cyan-500/5' },
            { label: 'Policy Insights', color: 'from-emerald-500/20 to-emerald-500/5' },
          ].map(tag => (
            <span key={tag.label} className={`liquid-glass px-5 py-2 text-xs text-white/70 tracking-wide bg-gradient-to-r ${tag.color} hover:scale-105 transition-transform cursor-default`} style={{ '--radius': '9999px' } as any}>
              {tag.label}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-purple-300/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
}
