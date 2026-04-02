import { NavLink, useLocation } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const navItems = [
  { title: "Overview", path: "/" },
  { title: "Approach", path: "/approach" },
  { title: "Temporal", path: "/temporal" },
  { title: "Geographic", path: "/geographic" },
  { title: "Incident Type", path: "/incident-type" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex-shrink-0 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-10">
        <BarChart3 className="w-5 h-5 text-sidebar-foreground" />
        <h1 className="text-lg font-bold text-sidebar-foreground">Disaster Analytics</h1>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={() => {
              const isActive = location.pathname === item.path;
              return `px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-active text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground"
              }`;
            }}
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebar;
