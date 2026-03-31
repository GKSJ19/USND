import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { loadCSVData } from "../data/loadData";
import { getYearlyData } from "../data/processData";

export default function CustomBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadCSVData().then((res) => {
      const processed = getYearlyData(res);
      setData(processed);
    });
  }, []);

  return (
    <BarChart width={500} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#22c55e" />
    </BarChart>
  );
}