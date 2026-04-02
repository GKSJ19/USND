import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { DisasterRecord, loadDisasterData } from '@/lib/data';

interface FilterState {
  states: string[];
  disasterTypes: string[];
  yearRange: [number, number];
  months: number[];
}

interface DashboardContextType {
  data: DisasterRecord[];
  filteredData: DisasterRecord[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  loading: boolean;
  availableStates: string[];
  availableTypes: string[];
  yearBounds: [number, number];
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DisasterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    states: [],
    disasterTypes: [],
    yearRange: [1953, 2025],
    months: [],
  });

  useEffect(() => {
    loadDisasterData().then(records => {
      setData(records);
      const years = records.map(r => r.year).filter(y => y > 0);
      setFilters(f => ({ ...f, yearRange: [Math.min(...years), Math.max(...years)] }));
      setLoading(false);
    });
  }, []);

  const availableStates = useMemo(() => 
    [...new Set(data.map(r => r.state))].filter(Boolean).sort(), [data]);
  
  const availableTypes = useMemo(() => 
    [...new Set(data.map(r => r.disasterType))].filter(Boolean).sort(), [data]);

  const yearBounds = useMemo<[number, number]>(() => {
    const years = data.map(r => r.year).filter(y => y > 0);
    return years.length ? [Math.min(...years), Math.max(...years)] : [1953, 2025];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(r => {
      if (filters.states.length && !filters.states.includes(r.state)) return false;
      if (filters.disasterTypes.length && !filters.disasterTypes.includes(r.disasterType)) return false;
      if (r.year < filters.yearRange[0] || r.year > filters.yearRange[1]) return false;
      if (filters.months.length && !filters.months.includes(r.month)) return false;
      return true;
    });
  }, [data, filters]);

  return (
    <DashboardContext.Provider value={{ data, filteredData, filters, setFilters, loading, availableStates, availableTypes, yearBounds }}>
      {children}
    </DashboardContext.Provider>
  );
}
