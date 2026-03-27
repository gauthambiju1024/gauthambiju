import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, FileText, Type, Link2, Layers, Lightbulb } from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/admin/case-studies', icon: Lightbulb, label: 'Case Studies' },
  { to: '/admin/blog', icon: FileText, label: 'Blog' },
  { to: '/admin/content', icon: Type, label: 'Content' },
  { to: '/admin/links', icon: Link2, label: 'Links' },
  { to: '/admin/sections', icon: Layers, label: 'Sections' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-handwritten text-2xl text-card-foreground">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
