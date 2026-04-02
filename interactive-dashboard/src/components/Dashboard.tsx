"use client";

import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Menu, ArrowRight, Twitter, Linkedin, Instagram, Sparkles, Wand2, BookOpen, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function Dashboard() {
  const [data, setData] = useState<{ yearly: any, states: any } | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/disasters').then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">
      <div className="liquid-glass-strong p-8 text-white/80" style={{'--radius': '1.5rem'} as any}>Loading USND Data...</div>
    </div>
  );

  let maxState = 1;
  Object.values(data.states).forEach((s: any) => { if (s.total > maxState) maxState = s.total; });

  const getGrayscaleColor = (stateName: string) => {
      const s = data.states[stateName];
      if (!s || s.total === 0) return "rgba(255, 255, 255, 0.05)";
      const intensity = Math.min(1, s.total / (maxState * 0.4));
      // Strict grayscale using HSL: 0 0% X% => returning rgba with alpha
      // 0.2 to 0.9 based on intensity
      const alpha = 0.1 + (0.8 * intensity);
      return `rgba(255, 255, 255, ${alpha})`;
  };

  const chartData = Object.keys(data.yearly)
    .sort((a,b)=>Number(a)-Number(b))
    .slice(-40) // Last 40 years for cleaner UI
    .map(y => ({ year: y, total: data.yearly[y].total }));

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row relative font-sans text-white p-4 lg:p-6 gap-6">

      {/* LEFT PANEL */}
      <div className="w-full lg:w-[52%] relative flex flex-col h-[calc(100vh-3rem)]">
        {/* The background overlay for left panel */}
        <div className="absolute inset-0 liquid-glass-strong z-0" style={{'--radius': '1.5rem'} as any}></div>

        <div className="relative z-10 flex flex-col h-full p-8 lg:p-12 overflow-y-auto">
            {/* Nav */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 liquid-glass flex items-center justify-center" style={{'--radius': '9999px'} as any}>
                    <span className="font-bold text-xs">US</span>
                </div>
                <span className="font-semibold text-2xl tracking-tighter text-white">usnd</span>
              </div>
              <button className="liquid-glass w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform" style={{'--radius': '9999px'} as any}>
                <Menu size={16} className="text-white/80" />
              </button>
            </div>

            {/* Hero center */}
            <div className="flex-1 flex flex-col justify-center items-start mt-12 mb-12 max-w-xl">
              <div className="w-20 h-20 liquid-glass mb-8 flex items-center justify-center" style={{'--radius': '9999px'} as any}>
                  <AlertTriangle size={32} className="text-white" />
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-medium tracking-[-0.05em] text-white leading-tight">
                Visualizing the <em className="font-serif italic text-white/80 font-normal">impact</em> of<br/>natural disasters
              </h1>
              
              <button className="mt-10 liquid-glass-strong px-6 py-3 flex items-center gap-4 hover:scale-105 active:scale-95 transition-transform group" style={{'--radius': '9999px'} as any}>
                <span className="font-medium text-lg text-white">Explore Dashboard</span>
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <ArrowRight size={16} className="text-white/80 group-hover:text-white transition-colors" />
                </div>
              </button>

              <div className="mt-8 flex flex-wrap gap-3">
                {['Temporal Trends', 'Geographic Hotspots', 'Policy Analysis'].map(t => (
                  <div key={t} className="liquid-glass px-4 py-2 text-xs text-white/80 font-medium" style={{'--radius': '9999px'} as any}>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="mt-auto pt-8">
              <div className="text-xs tracking-widest uppercase text-white/50 mb-3">CRISIS VISUALIZATION</div>
              <p className="text-xl text-white/80 italic font-serif leading-relaxed line-clamp-2">
                "Revealing patterns of vulnerability and resilience."
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="h-[1px] w-8 bg-white/20"></div>
                <span className="text-xs tracking-widest text-white/50 uppercase">FEMA DATABASE</span>
                <div className="h-[1px] w-8 bg-white/20"></div>
              </div>
            </div>
        </div>
      </div>

      {/* RIGHT PANEL Desktop Only */}
      <div className="hidden lg:flex w-[48%] flex-col gap-6 h-[calc(100vh-3rem)]">
        
        {/* Top Bar */}
        <div className="flex justify-end gap-3 z-10 w-full pl-6">
           <div className="liquid-glass px-4 py-2 flex items-center gap-4" style={{'--radius': '9999px'} as any}>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white/80 hover:scale-105 transition-all"><Twitter size={14}/></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white/80 hover:scale-105 transition-all"><Linkedin size={14}/></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white/80 hover:scale-105 transition-all"><Instagram size={14}/></a>
              <ArrowRight size={16} className="text-white/50 ml-2" />
           </div>
           <button className="liquid-glass w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform" style={{'--radius': '9999px'} as any}>
              <Sparkles size={18} className="text-white/90" />
           </button>
        </div>

        {/* Community Card (Trend Line) */}
        <div className="liquid-glass w-72 p-5 self-end flex flex-col z-10 mt-4" style={{'--radius': '1.5rem'} as any}>
            <h3 className="font-semibold text-white">Declaration History</h3>
            <p className="text-xs text-white/60 mb-4 tracking-wide">Last 40 years of disasters</p>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                      <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px'}} itemStyle={{color:'white'}} />
                      <Area type="monotone" dataKey="total" stroke="rgba(255,255,255,0.8)" fill="rgba(255,255,255,0.1)" strokeWidth={2} />
                  </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Bottom Feature Section */}
        <div className="mt-auto liquid-glass p-5 flex flex-col gap-5 z-10" style={{'--radius': '2.5rem'} as any}>
            {/* Side by side cards */}
            <div className="flex gap-5">
                <div className="liquid-glass flex-1 p-5 hover:scale-105 transition-transform flex flex-col justify-between min-h-[140px]" style={{'--radius': '1.5rem'} as any}>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4"><Wand2 size={18} /></div>
                    <div>
                        <h4 className="font-medium text-white/90">Processing Data</h4>
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">Analyzing disaster frequency over decades.</p>
                    </div>
                </div>
                <div className="liquid-glass flex-1 p-5 hover:scale-105 transition-transform flex flex-col justify-between min-h-[140px]" style={{'--radius': '1.5rem'} as any}>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4"><BookOpen size={18} /></div>
                    <div>
                        <h4 className="font-medium text-white/90">Growth Archive</h4>
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">Evaluating localized hazard vulnerabilities.</p>
                    </div>
                </div>
            </div>

            {/* Bottom Map Card */}
            <div className="liquid-glass p-6 relative flex flex-col min-h-[280px]" style={{'--radius': '1.5rem'} as any}>
                <div className="absolute top-6 left-6 z-20">
                    <h4 className="font-medium text-lg text-white">Advanced Risk Mapping</h4>
                    <p className="text-xs text-white/50 mt-1 tracking-wide">US Hazard Density Analysis</p>
                    {hoveredState && (
                        <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg inline-block">
                           <p className="font-bold text-white text-sm">{hoveredState}</p>
                           <p className="text-xl font-black mt-1 text-white/90">{data.states[hoveredState]?.total || 0}</p>
                           <p className="text-[10px] text-white/50 uppercase">Total Declarations</p>
                        </div>
                    )}
                </div>
                
                <div className="flex-1 w-full h-full pt-16 -mb-8 relative z-10">
                    <ComposableMap projection="geoAlbersUsa" className="w-full h-full opacity-90 stroke-white/20">
                        <Geographies geography={geoUrl}>
                            {({ geographies }) => 
                                geographies.map(geo => {
                                    const stateName = geo.properties.name;
                                    return (
                                        <Geography 
                                            key={geo.rsmKey} 
                                            geography={geo}
                                            fill={getGrayscaleColor(stateName)}
                                            stroke="rgba(255,255,255,0.2)"
                                            strokeWidth={0.5}
                                            onMouseEnter={() => setHoveredState(stateName)}
                                            onMouseLeave={() => setHoveredState(null)}
                                            style={{
                                                default: { outline: 'none', transition: 'fill 0.3s' },
                                                hover: { fill: 'rgba(255,255,255,1)', outline: 'none' },
                                                pressed: { outline: 'none' }
                                            }}
                                        />
                                    )
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                </div>
                
                {/* Floating Plus button */}
                <button className="absolute bottom-6 right-6 w-10 h-10 liquid-glass flex items-center justify-center hover:scale-110 transition-transform z-20" style={{'--radius': '9999px'} as any}>
                    <span className="text-xl leading-none font-light">+</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
