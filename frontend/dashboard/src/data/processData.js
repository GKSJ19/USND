// Donut Chart
export const getIncidentDistribution = (data) => {
  const map = {};

  data.forEach((d) => {
    const type = d["incidentType"] || d["Incident Type"];

    if (!type) return;

    map[type] = (map[type] || 0) + 1;
  });

  return Object.keys(map).map((key) => ({
    name: key,
    value: map[key],
  }));
};

// Bar Chart
export const getYearlyData = (data) => {
  const map = {};

  data.forEach((d) => {
    const year = d["year"] || d["Year"];

    if (!year) return;

    map[year] = (map[year] || 0) + 1;
  });

  return Object.keys(map).map((key) => ({
    name: key,
    value: map[key],
  }));
};