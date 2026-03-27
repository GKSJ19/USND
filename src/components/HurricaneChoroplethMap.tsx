import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

import { 
  Plus, 
  Minus, 
  RotateCcw
} from 'lucide-react';

interface StateData {
  id: string;
  name: string;
  count: number;
}

const HurricaneChoroplethMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Mock Hurricane data based on historical impact
  const hurricaneImpact: Record<string, number> = {
    "Florida": 100, "Texas": 95, "Louisiana": 90, "Mississippi": 85, "Alabama": 80,
    "Georgia": 70, "South Carolina": 75, "North Carolina": 78, "Virginia": 65,
    "Maryland": 55, "Delaware": 50, "New Jersey": 58, "New York": 52, "Connecticut": 45,
    "Rhode Island": 42, "Massachusetts": 40, "New Hampshire": 30, "Maine": 25,
    "Puerto Rico": 98, "Hawaii": 35, "California": 5, "Oregon": 2, "Washington": 2,
    "Arizona": 10, "New Mexico": 15, "Nevada": 5, "Utah": 5, "Colorado": 5,
    "Wyoming": 2, "Montana": 2, "Idaho": 2, "North Dakota": 2, "South Dakota": 2,
    "Nebraska": 5, "Kansas": 10, "Oklahoma": 15, "Arkansas": 30, "Tennessee": 35,
    "Kentucky": 25, "Missouri": 20, "Illinois": 15, "Indiana": 15, "Ohio": 15,
    "West Virginia": 20, "Pennsylvania": 30, "Vermont": 20, "Michigan": 10,
    "Wisconsin": 5, "Minnesota": 5, "Iowa": 10
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
        const us = await response.json();
        const states = topojson.feature(us, us.objects.states) as any;
        
        setLoading(false);
        renderMap(states);
      } catch (error) {
        console.error("Error loading map data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderMap = (states: any) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 960;
    const height = 600;

    const projection = d3.geoAlbersUsa()
      .scale(1280)
      .translate([width / 2, height / 2 + 40]);

    const path = d3.geoPath().projection(projection);

    // Custom color scale to match the user's image
    // Yellow (High) -> Pink/Orange (Med-High) -> Purple (Med) -> Dark Blue (Low) -> Light Blue (Very Low)
    const colorScale = (val: number) => {
      if (val >= 80) return "#facc15"; // Yellow (TX, LA, MS, AL, FL)
      if (val >= 60) return "#fb923c"; // Orange (GA, SC, NC, VA)
      if (val >= 40) return "#db2777"; // Pink (MD, DE, NJ, NY, CT, RI, MA)
      if (val >= 15) return "#4c1d95"; // Purple (Central/Midwest)
      return "#eff6ff"; // Light Blue (West/Mountain)
    };

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-slate-900 text-white p-2 rounded-lg text-xs border border-white/10 shadow-xl pointer-events-none z-50")
      .style("backdrop-filter", "blur(8px)");

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom as any);

    // Store zoom for external controls
    (svg.node() as any).__zoomBehavior = zoom;

    g.selectAll("path")
      .data(states.features)
      .enter().append("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => colorScale(hurricaneImpact[d.properties.name] || 0))
      .attr("stroke", "#ffffff20")
      .attr("stroke-width", "0.5")
      .attr("class", "transition-all duration-200 cursor-pointer hover:stroke-white hover:stroke-1")
      .on("mouseover", (event, d: any) => {
        const impact = hurricaneImpact[d.properties.name] || 0;
        tooltip.transition().duration(200).style("opacity", .9).style("display", "block");
        tooltip.html(`<strong>${d.properties.name}</strong><br/>Hurricane Risk Index: ${impact}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        
        d3.select(event.currentTarget)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", "1.5");
      })
      .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event) => {
        tooltip.transition().duration(500).style("opacity", 0).style("display", "none");
        d3.select(event.currentTarget)
          .attr("stroke", "#ffffff20")
          .attr("stroke-width", "0.5");
      });

    // Vertical Legend
    const legendWidth = 12;
    const legendHeight = 160;
    const legendX = width - legendWidth - 60;
    const legendY = height - legendHeight - 60;

    const legend = svg.append("g")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    const legendData = [
      { color: "#facc15", label: "High Risk" },
      { color: "#fb923c", label: "Med-High" },
      { color: "#db2777", label: "Medium" },
      { color: "#4c1d95", label: "Low Risk" },
      { color: "#eff6ff", label: "Minimal" }
    ];

    const itemHeight = legendHeight / legendData.length;

    legend.selectAll("rect")
      .data(legendData)
      .enter().append("rect")
      .attr("y", (d, i) => i * itemHeight)
      .attr("width", legendWidth)
      .attr("height", itemHeight)
      .attr("fill", d => d.color)
      .attr("rx", 2);

    legend.selectAll("text")
      .data(legendData)
      .enter().append("text")
      .attr("x", legendWidth + 10)
      .attr("y", (d, i) => i * itemHeight + itemHeight / 2 + 4)
      .attr("fill", "#94a3b8")
      .style("font-size", "10px")
      .text(d => d.label);

    legend.append("text")
      .attr("x", -10)
      .attr("y", -15)
      .attr("fill", "#94a3b8")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .text("risk_level");
  };

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = (svg.node() as any).__zoomBehavior;
    if (zoom) {
      svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = (svg.node() as any).__zoomBehavior;
    if (zoom) {
      svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    }
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = (svg.node() as any).__zoomBehavior;
    if (zoom) {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative rounded-2xl overflow-hidden group">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-blue-400 font-medium animate-pulse">Loading Hurricane Data...</p>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handleZoomIn}
          className="w-10 h-10 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-pink-600 hover:border-pink-500 transition-all shadow-xl"
          title="Zoom In"
        >
          <Plus size={20} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-10 h-10 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-pink-600 hover:border-pink-500 transition-all shadow-xl"
          title="Zoom Out"
        >
          <Minus size={20} />
        </button>
        <button 
          onClick={handleReset}
          className="w-10 h-10 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-pink-600 hover:border-pink-500 transition-all shadow-xl"
          title="Reset View"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Zoom Indicator */}
      <div className="absolute bottom-6 right-6 z-20 px-3 py-1.5 bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-full text-[10px] font-mono text-slate-400 uppercase tracking-widest">
        Zoom: {zoomLevel.toFixed(1)}x
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 960 600"
        className="w-full h-full max-h-[600px] cursor-move"
        style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.3))' }}
      />
    </div>
  );
};

export default HurricaneChoroplethMap;
