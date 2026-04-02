import { useState } from 'react';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { OverviewPage } from '@/components/dashboard/OverviewPage';
import { GeographicPage } from '@/components/dashboard/GeographicPage';
import { TemporalPage } from '@/components/dashboard/TemporalPage';
import { CategoryPage } from '@/components/dashboard/CategoryPage';
import { KeyFindingsPage } from '@/components/dashboard/KeyFindingsPage';
import { LayoutDashboard, MapPin, Clock, Layers, Lightbulb, Loader2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const pages = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'geographic', label: 'Geographic', icon: MapPin },
  { id: 'temporal', label: 'Temporal', icon: Clock },
  { id: 'category', label: 'Categories', icon: Layers },
  { id: 'findings', label: 'Key Findings', icon: Lightbulb },
];

function DashboardContent() {
  const { loading, filteredData } = useDashboard();
  const [activePage, setActivePage] = useState('overview');
  const [showFilters, setShowFilters] = useState(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading disaster data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">US Disaster Declarations</h1>
              <p className="text-[10px] text-muted-foreground">Analytics Dashboard • {filteredData.length.toLocaleString()} records</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {pages.map(page => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activePage === page.id
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <page.icon className="w-3.5 h-3.5" />
                {page.label}
              </button>
            ))}
          </div>

          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-secondary transition-all">
            {showFilters ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Mobile page tabs */}
        <div className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1">
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                activePage === page.id
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <page.icon className="w-3 h-3" />
              {page.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex">
        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border p-4 flex-shrink-0"
            >
              <FilterPanel />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activePage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activePage === 'overview' && <OverviewPage />}
              {activePage === 'geographic' && <GeographicPage />}
              {activePage === 'temporal' && <TemporalPage />}
              {activePage === 'category' && <CategoryPage />}
              {activePage === 'findings' && <KeyFindingsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

const Index = () => (
  <DashboardProvider>
    <DashboardContent />
  </DashboardProvider>
);

export default Index;
