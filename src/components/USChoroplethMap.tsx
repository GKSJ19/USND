import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

import { 
  Plus, 
  Minus, 
  RotateCcw,
  Maximize2
} from 'lucide-react';

interface StateData {
  id: string;
  name: string;
  count: number;
}

const USChoroplethMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [data, setData] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Expanded dataset for all states (mocked based on general trends)
  const stateDisasterCounts: Record<string, number> = {
    "Alabama": 1850, "Alaska": 450, "Arizona": 820, "Arkansas": 1240, "California": 3840,
    "Colorado": 980, "Connecticut": 320, "Delaware": 150, "Florida": 3120, "Georgia": 1980,
    "Hawaii": 280, "Idaho": 410, "Illinois": 1150, "Indiana": 920, "Iowa": 1050,
    "Kansas": 1180, "Kentucky": 3400, "Louisiana": 2850, "Maine": 210, "Maryland": 480,
    "Massachusetts": 390, "Michigan": 850, "Minnesota": 720, "Mississippi": 1720, "Missouri": 2800,
    "Montana": 540, "Nebraska": 890, "Nevada": 310, "New Hampshire": 190, "New Jersey": 640,
    "New Mexico": 710, "New York": 1650, "North Carolina": 2500, "North Dakota": 420, "Ohio": 1280,
    "Oklahoma": 2410, "Oregon": 680, "Pennsylvania": 1120, "Rhode Island": 110, "South Carolina": 1340,
    "South Dakota": 510, "Tennessee": 1580, "Texas": 5200, "Utah": 290, "Vermont": 230,
    "Virginia": 2800, "Washington": 2100, "West Virginia": 940, "Wisconsin": 610, "Wyoming": 240,
    "Puerto Rico": 2200
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch US TopoJSON
        const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
        const us = await response.json();
        
        // Convert TopoJSON to GeoJSON
        const states = topojson.feature(us, us.objects.states) as any;
        
        // Map state names to their IDs in the TopoJSON
        // Note: states-10m.json uses FIPS codes as IDs. We need a mapping or just use the names if available.
        // The us-atlas states-10m.json includes names in the properties.
        
        setData(states.features.map((f: any) => ({
          id: f.id,
          name: f.properties.name,
          count: stateDisasterCounts[f.properties.name] || 0
        })));
        
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

    const colorScale = d3.scaleSequential(d3.interpolateReds)
      .domain([0, 5500]);

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-slate-900 text-white p-2 rounded-lg text-xs border border-white/10 shadow-xl pointer-events-none z-50")
      .style("backdrop-filter", "blur(8px)");

    const g = svg.append("g")
      .attr("ref", "g-element");

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
      .attr("fill", (d: any) => {
        const count = stateDisasterCounts[d.properties.name] || 0;
        return colorScale(count);
      })
      .attr("stroke", "#ffffff20")
      .attr("stroke-width", "0.5")
      .attr("class", "transition-all duration-200 cursor-pointer hover:stroke-white hover:stroke-1")
      .on("mouseover", (event, d: any) => {
        const count = stateDisasterCounts[d.properties.name] || 0;
        tooltip.transition().duration(200).style("opacity", .9).style("display", "block");
        tooltip.html(`<strong>${d.properties.name}</strong><br/>Declarations: ${count.toLocaleString()}`)
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

    // Legend
    const legendWidth = 12;
    const legendHeight = 200;
    const legendX = width - legendWidth - 60;
    const legendY = height - legendHeight - 60;

    const legend = svg.append("g")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    // Generate 10 stops for the gradient
    const stops = d3.range(0, 1.1, 0.1).map(t => ({
      offset: `${t * 100}%`,
      color: colorScale(t * 5500)
    }));

    linearGradient.selectAll("stop")
      .data(stops)
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#linear-gradient)")
      .attr("rx", 2);

    legend.append("text")
      .attr("x", -10)
      .attr("y", -15)
      .attr("fill", "#94a3b8")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("text-transform", "uppercase")
      .text("disaster_count");

    legend.append("text")
      .attr("x", legendWidth + 10)
      .attr("y", legendHeight)
      .attr("fill", "#64748b")
      .style("font-size", "10px")
      .text("0");

    legend.append("text")
      .attr("x", legendWidth + 10)
      .attr("y", 10)
      .attr("fill", "#64748b")
      .style("font-size", "10px")
      .text("5,000+");
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
            <p className="text-blue-400 font-medium animate-pulse">Loading Geographic Data...</p>
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

export default USChoroplethMap;
