/* ═══════════════════════════════════════════════
   US Natural Disasters Dashboard — app.js
   Loads data.json and renders all charts & map
═══════════════════════════════════════════════ */

/* ── Chart defaults ── */
const GC  = 'rgba(0,0,0,0.05)';
const TC  = '#6b6b8a';
const TIP = {
  backgroundColor: '#ffffff',
  titleColor: '#1a1a2e',
  bodyColor: '#6b6b8a',
  borderColor: 'rgba(0,0,0,0.1)',
  borderWidth: 1
};
const FONT = { family: 'DM Mono', size: 11 };

const BASE_SCALES = {
  x: { ticks: { color: TC, font: FONT }, grid: { color: GC } },
  y: { ticks: { color: TC, font: FONT }, grid: { color: GC } }
};

const TYPE_COLORS = {
  Storm:     '#6c63ff',
  Flood:     '#0f9e75',
  Hurricane: '#d94040',
  Snow:      '#2a6fc4',
  Fire:      '#c47a00',
  Tornado:   '#b940d4',
  Ice:       '#5a5a8a',
  Drought:   '#2e7d32'
};

/* ── Section navigation ── */
function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
  if (id === 'm3') initMap(window._DATA);
}

/* ── Formatters ── */
const fmtK  = v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(v);
const fmtN  = v => Number(v).toLocaleString();
const fmtPct = v => v + '%';

/* ═══════════════════════════════
   OVERVIEW CHARTS
═══════════════════════════════ */
function buildOverview(D) {
  /* Donut — type distribution */
  new Chart(document.getElementById('c-donut'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(D.type_counts),
      datasets: [{
        data: Object.values(D.type_counts),
        backgroundColor: Object.keys(D.type_counts).map(t => TYPE_COLORS[t] || '#888'),
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '68%',
      plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => '  ' + fmtN(c.raw) } } }
    }
  });

  /* Bar — decades */
  new Chart(document.getElementById('c-decade'), {
    type: 'bar',
    data: {
      labels: ["'50s","'60s","'70s","'80s","'90s","'00s","'10s"],
      datasets: [{
        data: [94, 1615, 5522, 2164, 10052, 17613, 9125],
        backgroundColor: [.3,.4,.5,.55,.65,.9,.7].map(a => `rgba(91,82,232,${a})`),
        borderColor: 'rgba(108,99,255,0.8)',
        borderWidth: 1, borderRadius: 4, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => '  ' + fmtN(c.raw) } } },
      scales: BASE_SCALES
    }
  });

  /* Bar — declaration types (horizontal) */
  new Chart(document.getElementById('c-decltype'), {
    type: 'bar',
    data: {
      labels: Object.keys(D.decl_types),
      datasets: [{
        data: Object.values(D.decl_types),
        indexAxis: 'y',
        backgroundColor: ['rgba(108,99,255,0.7)', 'rgba(67,232,200,0.7)', 'rgba(255,179,71,0.7)'],
        borderColor: ['#6c63ff', '#43e8c8', '#ffb347'],
        borderWidth: 1, borderRadius: 4, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false }, tooltip: { ...TIP } },
      scales: {
        x: { ...BASE_SCALES.x, ticks: { ...BASE_SCALES.x.ticks, callback: fmtK } },
        y: { ...BASE_SCALES.y, grid: { display: false } }
      }
    }
  });
}

/* ═══════════════════════════════
   M2 — TEMPORAL CHARTS
═══════════════════════════════ */
function buildTemporal(D) {
  const years = Array.from({ length: 65 }, (_, i) => 1953 + i);

  /* Line — yearly + rolling avg */
  new Chart(document.getElementById('c-yearly'), {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Declarations',
          data: years.map(y => D.year_counts[y] || 0),
          borderColor: '#6c63ff',
          backgroundColor: 'rgba(108,99,255,0.07)',
          borderWidth: 1.5, pointRadius: 0, fill: true, tension: 0.3, order: 2
        },
        {
          label: '5-yr avg',
          data: years.map(y => D.rolling_avg[y] || 0),
          borderColor: '#43e8c8',
          borderWidth: 2, pointRadius: 0, fill: false, tension: 0.4,
          borderDash: [5, 3], order: 1
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...TIP, mode: 'index' } },
      scales: {
        x: { ...BASE_SCALES.x, ticks: { ...BASE_SCALES.x.ticks, maxTicksLimit: 12 } },
        y: BASE_SCALES.y
      }
    }
  });

  /* Multi-line — type trends */
  const top5 = ['Storm', 'Flood', 'Hurricane', 'Fire', 'Tornado', 'Snow'];
  new Chart(document.getElementById('c-typetrend'), {
    type: 'line',
    data: {
      labels: years,
      datasets: top5.map(t => ({
        label: t,
        data: years.map(y => (D.type_year[t] || {})[y] || 0),
        borderColor: TYPE_COLORS[t],
        borderWidth: 1.5, pointRadius: 0, fill: false, tension: 0.3
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...TIP, mode: 'index' } },
      scales: {
        x: { ...BASE_SCALES.x, ticks: { ...BASE_SCALES.x.ticks, maxTicksLimit: 10 } },
        y: BASE_SCALES.y
      }
    }
  });

  /* Bar — seasonality */
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mVals  = Object.values(D.month_counts);
  const mColors = mVals.map((_, i) =>
    i === 8 ? '#ff6b6b' : (i <= 2 || i === 4) ? 'rgba(108,99,255,0.55)' : 'rgba(108,99,255,0.3)'
  );
  new Chart(document.getElementById('c-monthly'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        data: mVals,
        backgroundColor: mColors,
        borderColor: mColors.map(c => c.replace('0.3', '0.8').replace('0.55', '0.8')),
        borderWidth: 1, borderRadius: 4, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => '  ' + fmtN(c.raw) } } },
      scales: {
        x: { ...BASE_SCALES.x, ticks: { ...BASE_SCALES.x.ticks, autoSkip: false } },
        y: BASE_SCALES.y
      }
    }
  });
}

/* ═══════════════════════════════
   M3 — GEOGRAPHIC CHARTS
═══════════════════════════════ */
function buildGeo(D) {
  const states  = Object.keys(D.state_counts);
  const counts  = Object.values(D.state_counts);
  const top6    = ['Storm', 'Flood', 'Hurricane', 'Snow', 'Fire', 'Tornado'];

  /* Horizontal bar — top states */
  new Chart(document.getElementById('c-states'), {
    type: 'bar',
    data: {
      labels: states,
      datasets: [{
        data: counts,
        backgroundColor: counts.map(v => `rgba(91,82,232,${(0.3 + v / 3842 * 0.65).toFixed(2)})`),
        borderColor: 'rgba(91,82,232,0.7)',
        borderWidth: 1, borderRadius: 4, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => '  ' + fmtN(c.raw) } } },
      scales: {
        x: { ...BASE_SCALES.x, ticks: { ...BASE_SCALES.x.ticks, callback: fmtK } },
        y: { ...BASE_SCALES.y, grid: { display: false } }
      }
    }
  });

  /* Stacked bar — type composition */
  new Chart(document.getElementById('c-stacked'), {
    type: 'bar',
    data: {
      labels: states,
      datasets: top6.map(t => ({
        label: t,
        data: states.map(s => (D.state_type[s] || {})[t] || 0),
        backgroundColor: (TYPE_COLORS[t] || '#888') + '99',
        borderColor: TYPE_COLORS[t] || '#888',
        borderWidth: 0.5, borderRadius: 0
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false }, tooltip: { ...TIP, mode: 'index' } },
      scales: {
        x: { ...BASE_SCALES.x, stacked: true, ticks: { ...BASE_SCALES.x.ticks, callback: fmtK } },
        y: { ...BASE_SCALES.y, stacked: true, grid: { display: false } }
      }
    }
  });

  /* Heatmap */
  buildHeatmap(D, states, top6);
}

function buildHeatmap(D, states, types) {
  const allVals = states.flatMap(s => types.map(t => (D.state_type[s] || {})[t] || 0));
  const maxV    = Math.max(...allVals);
  const getColor = v => `rgba(91,82,232,${(0.07 + (v / maxV) * 0.86).toFixed(2)})`;
  const textCol  = v => (v / maxV) > 0.45 ? '#ffffff' : '#4a4a6a';

  let html = '<table class="hm"><tr><th></th>' +
    types.map(t => `<th>${t}</th>`).join('') + '</tr>';

  states.forEach(s => {
    html += `<tr><th>${s}</th>`;
    types.forEach(t => {
      const v = (D.state_type[s] || {})[t] || 0;
      html += `<td style="background:${getColor(v)};color:${textCol(v)}">${v > 0 ? v.toLocaleString() : '—'}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  document.getElementById('heatmap-container').innerHTML = html;
}

/* ═══════════════════════════════
   M4 — INCIDENT CHARTS
═══════════════════════════════ */
function buildIncident(D) {
  const types8  = ['Storm','Flood','Hurricane','Snow','Fire','Ice','Tornado','Drought'];
  const typeVals = types8.map(t => D.type_counts[t] || 0);
  const ihVals   = [5059, 628, 2097, 0, 431, 16, 88, 0];
  const paVals   = [15722, 9143, 8720, 3544, 2498, 1960, 1257, 1287];
  const totals   = typeVals.map(v => v || 1);

  /* Bar — type frequency */
  new Chart(document.getElementById('c-types'), {
    type: 'bar',
    data: {
      labels: types8,
      datasets: [{
        data: typeVals,
        backgroundColor: types8.map(t => (TYPE_COLORS[t] || '#888') + '99'),
        borderColor: types8.map(t => TYPE_COLORS[t] || '#888'),
        borderWidth: 1, borderRadius: 4, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...TIP, callbacks: { label: c => '  ' + fmtN(c.raw) } } },
      scales: {
        x: { ...BASE_SCALES.x, ticks: { ...BASE_SCALES.x.ticks, autoSkip: false } },
        y: BASE_SCALES.y
      }
    }
  });

  /* Grouped bar — IH vs PA counts */
  new Chart(document.getElementById('c-assist'), {
    type: 'bar',
    data: {
      labels: types8,
      datasets: [
        { label: 'IH Program', data: ihVals, backgroundColor: 'rgba(91,82,232,0.75)', borderColor: '#5b52e8', borderWidth: 1, borderRadius: 4, borderSkipped: false },
        { label: 'PA Program', data: paVals, backgroundColor: 'rgba(8,145,178,0.6)',   borderColor: '#0891b2', borderWidth: 1, borderRadius: 4, borderSkipped: false }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...TIP, mode: 'index', callbacks: { label: c => '  ' + c.dataset.label + ': ' + fmtN(c.raw) } } },
      scales: BASE_SCALES
    }
  });

  /* Grouped bar — activation rate % */
  new Chart(document.getElementById('c-rate'), {
    type: 'bar',
    data: {
      labels: types8,
      datasets: [
        { label: 'IH %', data: ihVals.map((v, i) => Math.round(v / totals[i] * 100)), backgroundColor: 'rgba(91,82,232,0.75)', borderColor: '#5b52e8', borderWidth: 1, borderRadius: 4, borderSkipped: false },
        { label: 'PA %', data: paVals.map((v, i) => Math.round(v / totals[i] * 100)), backgroundColor: 'rgba(8,145,178,0.6)',   borderColor: '#0891b2', borderWidth: 1, borderRadius: 4, borderSkipped: false }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...TIP, mode: 'index', callbacks: { label: c => '  ' + c.dataset.label + ': ' + c.raw + '%' } } },
      scales: {
        x: { ...BASE_SCALES.x, ticks: { ...BASE_SCALES.x.ticks, autoSkip: false } },
        y: { ...BASE_SCALES.y, max: 100, ticks: { ...BASE_SCALES.y.ticks, callback: fmtPct } }
      }
    }
  });
}

/* ═══════════════════════════════
   M3 — CHOROPLETH MAP
═══════════════════════════════ */
let _mapDone = false;

function initMap(D) {
  if (_mapDone || !D) return;
  _mapDone = true;

  const stateData = D.all_state_counts;
  const maxV = Math.max(...Object.values(stateData));

  const colorFor = v => {
    const t = v / maxV;
    const r = Math.round(220 - t * 150);
    const g = Math.round(220 - t * 140);
    const b = Math.round(255 - t * 60);
    return `rgb(${r},${g},${b})`;
  };

  const svg = d3.select('#map-container')
    .append('svg')
    .attr('viewBox', '0 0 960 580')
    .attr('width', '100%');

  const proj = d3.geoAlbersUsa().scale(1220).translate([480, 290]);
  const path = d3.geoPath(proj);
  const tip  = document.getElementById('map-tip');

  /* Load local topology file */
  d3.json('static/js/us-states.json').then(us => {
    svg.selectAll('path')
      .data(topojson.feature(us, us.objects.states).features)
      .join('path')
      .attr('d', path)
      .attr('stroke', 'rgba(255,255,255,0.85)')
      .attr('stroke-width', 0.6)
      .attr('fill', d => {
        const v = stateData[d.properties.name] || 0;
        return v > 0 ? colorFor(v) : '#ececf8';
      })
      .style('cursor', 'pointer')
      .on('mousemove', (e, d) => {
        const v = stateData[d.properties.name] || 0;
        tip.style.opacity = '1';
        tip.style.left = (e.offsetX + 14) + 'px';
        tip.style.top  = (e.offsetY - 38) + 'px';
        tip.innerHTML  = `<strong>${d.properties.name}</strong>&nbsp;&nbsp;${fmtN(v)} declarations`;
      })
      .on('mouseleave', () => { tip.style.opacity = '0'; });

  }).catch(() => {
    document.getElementById('map-container').innerHTML =
      '<p style="color:#7878a0;padding:2rem;font-size:12px">Map unavailable — place us-states.json in static/js/ folder.</p>';
  });
}

/* ═══════════════════════════════
   EXPORT — CSV & PDF
═══════════════════════════════ */

/** Export the raw disaster data as CSV */
function exportCSV() {
  const D = window._DATA;
  if (!D) { alert('Data not loaded yet — please wait a moment.'); return; }

  const rows = [['Year', 'Disaster Type', 'Count']];

  // Year × type breakdown
  const types = ['Storm', 'Flood', 'Hurricane', 'Fire', 'Tornado', 'Snow'];
  const years  = Array.from({ length: 65 }, (_, i) => 1953 + i);

  years.forEach(y => {
    types.forEach(t => {
      const v = (D.type_year[t] || {})[y] || 0;
      if (v > 0) rows.push([y, t, v]);
    });
  });

  // Also append state totals
  rows.push([], ['State', 'Total Declarations', '']);
  Object.entries(D.state_counts).forEach(([s, v]) => rows.push([s, v, '']));

  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'us_disasters.csv' });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Export a summary PDF — downloads directly using jsPDF */
function exportPDF() {
  const D = window._DATA;
  if (!D) { alert('Data not loaded yet — please wait a moment.'); return; }

  // jsPDF is loaded from CDN in index.html
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210, margin = 18, col2 = W / 2 + 4;
  let y = 20;

  const accent  = [91, 82, 232];
  const cyan    = [8, 145, 178];
  const red     = [220, 38, 38];
  const muted   = [138, 139, 170];
  const text    = [26, 27, 46];
  const light   = [238, 238, 248];

  // ── Header bar ──
  doc.setFillColor(...accent);
  doc.rect(0, 0, W, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.text('DISASTERVIZ  ·  US NATURAL DISASTERS REPORT', margin, 9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}`, W - margin, 9, { align: 'right' });

  y = 26;

  // ── Title ──
  doc.setTextColor(...text);
  doc.setFontSize(22); doc.setFont('helvetica', 'bold');
  doc.text('US Natural Disasters', margin, y); y += 9;
  doc.setTextColor(...accent);
  doc.text('Federal Declaration Analysis', margin, y); y += 7;
  doc.setTextColor(...muted);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Source: FEMA OpenFEMA Database  ·  Coverage: 1953 – 2017  ·  46,185 records', margin, y); y += 10;

  // ── Divider ──
  doc.setDrawColor(...accent); doc.setLineWidth(0.5);
  doc.line(margin, y, W - margin, y); y += 8;

  // ── KPI boxes (2×2) ──
  const v = window._DATA.validation;
  const kpis = [
    { label: 'Total Declarations', value: v.total_records.toLocaleString(), color: accent },
    { label: 'Disaster Types',     value: String(v.unique_types),           color: cyan  },
    { label: 'States & Territories', value: String(v.unique_states),        color: red   },
    { label: 'Years of Data',      value: `${v.year_range[0]}–${v.year_range[1]}`, color: [217,119,6] },
  ];
  const bw = (W - margin * 2 - 6) / 4;
  kpis.forEach((k, i) => {
    const bx = margin + i * (bw + 2);
    doc.setFillColor(...light); doc.roundedRect(bx, y, bw, 18, 2, 2, 'F');
    doc.setDrawColor(...k.color); doc.setLineWidth(0.8);
    doc.line(bx, y, bx + bw, y);
    doc.setTextColor(...k.color); doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text(k.value, bx + bw / 2, y + 9, { align: 'center' });
    doc.setTextColor(...muted); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text(k.label.toUpperCase(), bx + bw / 2, y + 15, { align: 'center' });
  });
  y += 26;

  // ── Section: Disaster Types ──
  doc.setFillColor(...accent); doc.rect(margin, y, 3, 5, 'F');
  doc.setTextColor(...text); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text('Disaster Type Breakdown', margin + 6, y + 4); y += 10;

  const top = Object.entries(D.type_counts).slice(0, 8);
  const maxT = top[0][1];
  doc.setFontSize(8.5);
  top.forEach(([t, n]) => {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...text);
    doc.text(t, margin, y + 3.5);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
    doc.text(n.toLocaleString(), margin + 38, y + 3.5);
    const barW = Math.round((n / maxT) * 90);
    doc.setFillColor(...light); doc.roundedRect(margin + 55, y, 90, 5, 1, 1, 'F');
    doc.setFillColor(...accent); doc.roundedRect(margin + 55, y, barW, 5, 1, 1, 'F');
    const pct = Math.round(n / v.total_records * 100);
    doc.setTextColor(...muted); doc.text(`${pct}%`, margin + 55 + 92, y + 3.5);
    y += 8;
  });
  y += 4;

  // ── Section: Top States ──
  doc.setFillColor(...cyan); doc.rect(margin, y, 3, 5, 'F');
  doc.setTextColor(...text); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text('Top States by Declarations', margin + 6, y + 4); y += 10;

  const sts = Object.entries(D.state_counts).slice(0, 10);
  const maxS = sts[0][1];
  doc.setFontSize(8.5);
  sts.forEach(([s, n]) => {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...text);
    doc.text(s, margin, y + 3.5);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
    doc.text(n.toLocaleString(), margin + 18, y + 3.5);
    const barW = Math.round((n / maxS) * 110);
    doc.setFillColor(...light); doc.roundedRect(margin + 35, y, 110, 5, 1, 1, 'F');
    doc.setFillColor(...cyan); doc.roundedRect(margin + 35, y, barW, 5, 1, 1, 'F');
    y += 8;
  });
  y += 4;

  // ── Section: Declaration Types ──
  doc.setFillColor(217,119,6); doc.rect(margin, y, 3, 5, 'F');
  doc.setTextColor(...text); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text('Declaration Type Summary', margin + 6, y + 4); y += 10;

  doc.setFontSize(8.5);
  Object.entries(D.decl_types).forEach(([dt, n]) => {
    const pct = (n / v.total_records * 100).toFixed(1);
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...text);
    doc.text(dt, margin, y + 3.5);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
    doc.text(`${n.toLocaleString()}  (${pct}%)`, margin + 40, y + 3.5);
    y += 7;
  });
  y += 6;

  // ── Key Insights ──
  doc.setFillColor(...red); doc.rect(margin, y, 3, 5, 'F');
  doc.setTextColor(...text); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text('Key Insights', margin + 6, y + 4); y += 10;

  const insights = [
    'Storm declarations grew 8× from the 1980s to the 2000s.',
    '2005 saw 4,736 declarations — driven by Hurricane Katrina.',
    'Texas leads all states with 3,842 total declarations.',
    'September has 2.5× more declarations than the average month.',
    'Public Assistance is activated in nearly every disaster event.',
    'Hurricanes trigger IH assistance at the highest rate (24%).',
  ];
  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  insights.forEach(ins => {
    doc.setFillColor(...accent); doc.circle(margin + 1.5, y + 2, 1, 'F');
    doc.setTextColor(...text); doc.text(ins, margin + 5, y + 3.5);
    y += 8;
  });

  // ── Footer ──
  doc.setDrawColor(...light); doc.setLineWidth(0.4);
  doc.line(margin, 282, W - margin, 282);
  doc.setTextColor(...muted); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  doc.text('DisasterViz  ·  FEMA Disaster Declarations 1953–2017  ·  disasterviz.local', W / 2, 287, { align: 'center' });

  doc.save('us_disasters_report.pdf');
}

/* ═══════════════════════════════
   BOOTSTRAP — load data.json
═══════════════════════════════ */
fetch('output/data.json')
  .then(r => r.json())
  .then(D => {
    window._DATA = D;
    buildOverview(D);
    buildTemporal(D);
    buildGeo(D);
    buildIncident(D);
  })
  .catch(err => {
    console.error('Failed to load data.json. Run python/analyze.py first.', err);
    document.body.innerHTML = `
      <div style="padding:3rem;color:#ff6b6b;font-family:monospace">
        <h2>data.json not found</h2>
        <p style="margin-top:1rem;color:#7878a0">Run: <code style="color:#43e8c8">python python/analyze.py</code></p>
      </div>`;
  });