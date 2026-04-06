import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

let cachedData: any = null;

export async function GET() {
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  const csvPath = path.join(process.cwd(), 'public', 'database.csv');
  if (!fs.existsSync(csvPath)) {
    return NextResponse.json({ error: 'database.csv not found' }, { status: 404 });
  }

  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const results = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
  const data = results.data as any[];

  const yearly: Record<string, { total: number; types: Record<string, number> }> = {};
  const states: Record<string, { total: number; types: Record<string, number>; programs: { ih: number; pa: number } }> = {};
  const monthly: Record<number, number[]> = {};
  const typeCounts: Record<string, number> = {};
  const seen = new Set<string>();

  let minYear = 9999, maxYear = 0, totalRows = data.length;

  data.forEach((row) => {
    const decNum = row['Declaration Number'];
    if (!decNum || seen.has(decNum)) return;
    seen.add(decNum);

    const dateStr = row['Declaration Date'];
    if (!dateStr) return;

    let year = '', monthNum = 0;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      monthNum = parseInt(parts[0]);
      year = parts[2];
    } else if (dateStr.includes('-')) {
      year = dateStr.split('-')[0];
      monthNum = parseInt(dateStr.split('-')[1]);
    }
    if (!year) return;

    const yearNum = parseInt(year);
    if (yearNum < minYear) minYear = yearNum;
    if (yearNum > maxYear) maxYear = yearNum;

    const type = row['Disaster Type'] || 'Unknown';
    const state = row['State'] || 'Unknown';
    const ih = row['Individual Assistance Program'] === 'Yes';
    const pa = row['Public Assistance Program'] === 'Yes';

    // Yearly
    if (!yearly[year]) yearly[year] = { total: 0, types: {} };
    yearly[year].total += 1;
    yearly[year].types[type] = (yearly[year].types[type] || 0) + 1;

    // States
    if (!states[state]) states[state] = { total: 0, types: {}, programs: { ih: 0, pa: 0 } };
    states[state].total += 1;
    states[state].types[type] = (states[state].types[type] || 0) + 1;
    if (ih) states[state].programs.ih += 1;
    if (pa) states[state].programs.pa += 1;

    // Monthly (accumulate per month across all years)
    if (monthNum >= 1 && monthNum <= 12) {
      if (!monthly[monthNum]) monthly[monthNum] = [];
      monthly[monthNum].push(yearNum);
    }

    // Type counts
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // Build monthly averages
  const yearSpan = maxYear - minYear + 1 || 1;
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyAvg = monthNames.map((name, i) => ({
    month: name,
    avg: Math.round((monthly[i + 1]?.length || 0) / yearSpan * 10) / 10,
  }));

  // Build top types sorted
  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type, count]) => ({ type, count }));

  // Build state × type matrix for top 15 states × top 8 types
  const top15States = Object.entries(states)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 15)
    .map(([s]) => s);
  const top8Types = topTypes.slice(0, 8).map(t => t.type);

  const stateTypeMatrix = top15States.map(s => {
    const row: Record<string, any> = { state: s };
    top8Types.forEach(t => { row[t] = states[s]?.types[t] || 0; });
    return row;
  });

  // Assistance by type
  const assistanceByType = topTypes.slice(0, 6).map(t => {
    let ihCount = 0, paCount = 0, totalForType = 0;
    Object.values(states).forEach((s: any) => {
      // Approximate: distribute state-level program counts by type proportion
    });
    return { type: t.type };
  });

  // Better: re-scan for assistance by type
  const typeAssistance: Record<string, { total: number; ih: number; pa: number }> = {};
  const seen2 = new Set<string>();
  data.forEach((row) => {
    const decNum = row['Declaration Number'];
    if (!decNum || seen2.has(decNum)) return;
    seen2.add(decNum);
    const type = row['Disaster Type'];
    if (!type) return;
    if (!typeAssistance[type]) typeAssistance[type] = { total: 0, ih: 0, pa: 0 };
    typeAssistance[type].total += 1;
    if (row['Individual Assistance Program'] === 'Yes') typeAssistance[type].ih += 1;
    if (row['Public Assistance Program'] === 'Yes') typeAssistance[type].pa += 1;
  });

  const assistanceData = topTypes.slice(0, 6).map(t => ({
    type: t.type,
    total: typeAssistance[t.type]?.total || 0,
    ihPct: Math.round(((typeAssistance[t.type]?.ih || 0) / (typeAssistance[t.type]?.total || 1)) * 100),
    paPct: Math.round(((typeAssistance[t.type]?.pa || 0) / (typeAssistance[t.type]?.total || 1)) * 100),
  }));

  // ═══════ NEW: Decade breakdowns ═══════
  const decades: Record<string, { total: number; types: Record<string, number> }> = {};
  Object.entries(yearly).forEach(([y, d]) => {
    const dec = `${Math.floor(parseInt(y) / 10) * 10}s`;
    if (!decades[dec]) decades[dec] = { total: 0, types: {} };
    decades[dec].total += d.total;
    Object.entries(d.types).forEach(([t, c]) => {
      decades[dec].types[t] = (decades[dec].types[t] || 0) + c;
    });
  });

  const decadeData = Object.entries(decades)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([decade, d]) => ({ decade, total: d.total, ...d.types }));

  // ═══════ NEW: Type trends (top 5 types over time) ═══════
  const top5TypeNames = topTypes.slice(0, 5).map(t => t.type);
  const typeTrends = Object.keys(yearly)
    .sort((a, b) => Number(a) - Number(b))
    .map(y => {
      const row: Record<string, any> = { year: y };
      top5TypeNames.forEach(t => { row[t] = yearly[y].types[t] || 0; });
      return row;
    });

  // ═══════ NEW: Top 15 states ranking ═══════
  const topStatesRanking = Object.entries(states)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 15)
    .map(([state, d]) => ({
      state,
      total: d.total,
      topType: Object.entries(d.types).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown',
      ihPct: Math.round((d.programs.ih / (d.total || 1)) * 100),
      paPct: Math.round((d.programs.pa / (d.total || 1)) * 100),
    }));

  // ═══════ NEW: Type × Month heatmap ═══════
  const typeMonthMap: Record<string, Record<number, number>> = {};
  const seen3 = new Set<string>();
  data.forEach((row) => {
    const decNum = row['Declaration Number'];
    if (!decNum || seen3.has(decNum)) return;
    seen3.add(decNum);
    const dateStr = row['Declaration Date'];
    if (!dateStr) return;
    let monthN = 0;
    if (dateStr.includes('/')) monthN = parseInt(dateStr.split('/')[0]);
    else if (dateStr.includes('-')) monthN = parseInt(dateStr.split('-')[1]);
    const type = row['Disaster Type'];
    if (!type || monthN < 1 || monthN > 12) return;
    if (!top5TypeNames.includes(type)) return;
    if (!typeMonthMap[type]) typeMonthMap[type] = {};
    typeMonthMap[type][monthN] = (typeMonthMap[type][monthN] || 0) + 1;
  });

  const typeMonthHeatmap = top5TypeNames.map(type => {
    const row: Record<string, any> = { type };
    monthNames.forEach((m, i) => { row[m] = typeMonthMap[type]?.[i + 1] || 0; });
    return row;
  });

  const uniqueStates = new Set(Object.keys(states));

  cachedData = {
    meta: { totalRows, uniqueDeclarations: seen.size, minYear, maxYear, stateCount: uniqueStates.size, typeCount: Object.keys(typeCounts).length },
    yearly,
    states,
    monthlyAvg,
    topTypes,
    stateTypeMatrix,
    assistanceData,
    decadeData,
    typeTrends,
    top5TypeNames,
    topStatesRanking,
    typeMonthHeatmap,
  };

  return NextResponse.json(cachedData);
}
