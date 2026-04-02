import { useDashboard } from '@/contexts/DashboardContext';
import { MONTH_NAMES } from '@/lib/data';
import { X, Filter } from 'lucide-react';
import { useState } from 'react';

export function FilterPanel() {
  const { filters, setFilters, availableStates, availableTypes, yearBounds } = useDashboard();
  const [stateSearch, setStateSearch] = useState('');

  const filteredStates = availableStates.filter(s => 
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const toggleState = (state: string) => {
    setFilters(f => ({
      ...f,
      states: f.states.includes(state) ? f.states.filter(s => s !== state) : [...f.states, state],
    }));
  };

  const toggleType = (type: string) => {
    setFilters(f => ({
      ...f,
      disasterTypes: f.disasterTypes.includes(type) ? f.disasterTypes.filter(t => t !== type) : [...f.disasterTypes, type],
    }));
  };

  const toggleMonth = (month: number) => {
    setFilters(f => ({
      ...f,
      months: f.months.includes(month) ? f.months.filter(m => m !== month) : [...f.months, month],
    }));
  };

  const clearAll = () => {
    setFilters({ states: [], disasterTypes: [], yearRange: yearBounds, months: [] });
  };

  const hasFilters = filters.states.length > 0 || filters.disasterTypes.length > 0 || filters.months.length > 0 ||
    filters.yearRange[0] !== yearBounds[0] || filters.yearRange[1] !== yearBounds[1];

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Filters</span>
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Year Range */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Year Range</label>
        <div className="flex items-center gap-2 mt-1.5">
          <input
            type="number"
            min={yearBounds[0]}
            max={filters.yearRange[1]}
            value={filters.yearRange[0]}
            onChange={e => setFilters(f => ({ ...f, yearRange: [parseInt(e.target.value) || yearBounds[0], f.yearRange[1]] }))}
            className="w-20 bg-secondary text-foreground text-xs px-2 py-1.5 rounded-md border border-border focus:border-primary outline-none"
          />
          <span className="text-muted-foreground text-xs">to</span>
          <input
            type="number"
            min={filters.yearRange[0]}
            max={yearBounds[1]}
            value={filters.yearRange[1]}
            onChange={e => setFilters(f => ({ ...f, yearRange: [f.yearRange[0], parseInt(e.target.value) || yearBounds[1]] }))}
            className="w-20 bg-secondary text-foreground text-xs px-2 py-1.5 rounded-md border border-border focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Disaster Types */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Disaster Type</label>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {availableTypes.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
                filters.disasterTypes.includes(type)
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:border-primary/30'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Months */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Month</label>
        <div className="grid grid-cols-6 gap-1 mt-1.5">
          {MONTH_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() => toggleMonth(i + 1)}
              className={`text-[10px] px-1 py-1 rounded border transition-all ${
                filters.months.includes(i + 1)
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:border-primary/30'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">State</label>
        <input
          type="text"
          placeholder="Search states..."
          value={stateSearch}
          onChange={e => setStateSearch(e.target.value)}
          className="w-full mt-1.5 bg-secondary text-foreground text-xs px-2 py-1.5 rounded-md border border-border focus:border-primary outline-none"
        />
        <div className="flex flex-wrap gap-1 mt-1.5 max-h-32 overflow-y-auto">
          {filteredStates.map(state => (
            <button
              key={state}
              onClick={() => toggleState(state)}
              className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                filters.states.includes(state)
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:border-primary/30'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
