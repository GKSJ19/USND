"use client";

import { useState, useEffect } from 'react';
import HeroSection from './sections/HeroSection';
import DataOverview from './sections/DataOverview';
import TemporalTrends from './sections/TemporalTrends';
import DecadeView from './sections/DecadeView';
import TypeTrends from './sections/TypeTrends';
import GeographicMap from './sections/GeographicMap';
import TopStates from './sections/TopStates';
import SeasonalHeatmap from './sections/SeasonalHeatmap';
import IncidentAnalysis from './sections/IncidentAnalysis';
import Conclusion from './sections/Conclusion';

export default function NarrativeDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/disasters')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data || !data.meta) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="mesh-gradient-bg">
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /><div className="orb orb-4" />
        </div>
        <div className="liquid-glass-strong p-8 flex flex-col items-center relative z-10" style={{ '--radius': '1.5rem' } as any}>
          <div className="w-10 h-10 border-2 border-purple-400/50 border-t-purple-400 rounded-full animate-spin" />
          <p className="mt-5 text-white/60 text-sm tracking-wide">Loading FEMA dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="mesh-gradient-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <DataOverview meta={data.meta} />
        <TemporalTrends yearly={data.yearly} monthlyAvg={data.monthlyAvg} />
        <DecadeView decadeData={data.decadeData} />
        <TypeTrends typeTrends={data.typeTrends} top5TypeNames={data.top5TypeNames} />
        <GeographicMap states={data.states} />
        <TopStates topStatesRanking={data.topStatesRanking} />
        <SeasonalHeatmap typeMonthHeatmap={data.typeMonthHeatmap} />
        <IncidentAnalysis topTypes={data.topTypes} assistanceData={data.assistanceData} />
        <Conclusion />
      </div>
    </div>
  );
}
