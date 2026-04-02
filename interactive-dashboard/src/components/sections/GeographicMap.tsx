"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Full state name → abbreviation used in the FEMA CSV
const STATE_ABBR: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC', 'Puerto Rico': 'PR', 'Virgin Islands': 'VI', 'Guam': 'GU',
  'American Samoa': 'AS', 'Northern Mariana Islands': 'MP',
};

interface Props {
  states: Record<string, { total: number; types: Record<string, number>; programs: { ih: number; pa: number } }>;
}

export default function GeographicMap({ states }: Props) {
  const [hovered, setHovered] = useState<{ fullName: string; abbr: string } | null>(null);

  let maxVal = 1;
  Object.values(states).forEach((s: any) => { if (s.total > maxVal) maxVal = s.total; });

  const getColor = (fullName: string) => {
    const abbr = STATE_ABBR[fullName];
    const s = abbr ? states[abbr] : null;
    if (!s || s.total === 0) return 'rgba(139, 92, 246, 0.05)';
    const t = Math.min(1, s.total / (maxVal * 0.35));
    const r = Math.round(99 + (236 - 99) * t);
    const g = Math.round(102 + (72 - 102) * t);
    const b = Math.round(241 + (153 - 241) * t);
    const a = (0.15 + 0.75 * t).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const hoveredData = hovered ? states[hovered.abbr] : null;
  const topThreat = hoveredData ? Object.entries(hoveredData.types).sort((a, b) => b[1] - a[1])[0] : null;

  return (
    <section className="narrative-section">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-cyan-300/50 mb-3">Milestone 3</p>
        <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-4">
          Geographic <em className="font-serif italic bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-normal">patterns</em>
        </h2>
        <p className="text-white/50 max-w-xl text-lg mb-12">
          Disaster risk is geographically concentrated. Hover to explore each state&apos;s risk profile.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          className="lg:col-span-3 liquid-glass-strong p-6 relative"
          style={{ '--radius': '1.5rem' } as any}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ComposableMap projection="geoAlbersUsa" className="w-full h-auto">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const fullName = geo.properties.name;
                  const abbr = STATE_ABBR[fullName] || '';
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColor(fullName)}
                      stroke="rgba(139, 92, 246, 0.2)"
                      strokeWidth={0.5}
                      onMouseEnter={() => setHovered({ fullName, abbr })}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        default: { outline: 'none', transition: 'fill 0.3s' },
                        hover: { fill: '#a855f7', outline: 'none', cursor: 'pointer' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </motion.div>

        <motion.div
          className="liquid-glass-strong p-6 flex flex-col justify-center"
          style={{ '--radius': '1.5rem' } as any}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {hoveredData && hovered ? (
            <div>
              <p className="text-xs tracking-widest uppercase text-purple-300/40 mb-2">State Profile</p>
              <h3 className="text-3xl font-semibold text-white">{hovered.fullName}</h3>
              <p className="text-xs text-white/30 mt-1">{hovered.abbr}</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-4">{hoveredData.total}</p>
              <p className="text-sm text-white/40 mt-1">total declarations</p>

              {topThreat && (
                <div className="mt-6 liquid-glass p-4" style={{ '--radius': '0.75rem' } as any}>
                  <p className="text-xs text-cyan-300/50">Top Threat</p>
                  <p className="text-white font-medium mt-1">{topThreat[0]}</p>
                  <p className="text-xs text-white/30 mt-1">{topThreat[1]} events</p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="liquid-glass p-3 text-center" style={{ '--radius': '0.75rem' } as any}>
                  <p className="text-lg font-semibold text-emerald-400">{hoveredData.programs.ih}</p>
                  <p className="text-[10px] text-white/40 uppercase">Individual Aid</p>
                </div>
                <div className="liquid-glass p-3 text-center" style={{ '--radius': '0.75rem' } as any}>
                  <p className="text-lg font-semibold text-cyan-400">{hoveredData.programs.pa}</p>
                  <p className="text-[10px] text-white/40 uppercase">Public Aid</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                <span className="text-purple-300/50 text-2xl">↤</span>
              </div>
              <p className="text-white/30 text-sm">Hover over a state to explore its risk profile</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
