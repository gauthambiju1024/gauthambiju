import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, FileText, Type, Link2, Layers, Lightbulb, LogIn, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const { user, loading, signIn, signOut } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setError('');
    const { error: err } = await signIn(email, password);
    if (err) setError(err.message);
    else { setEmail(''); setPassword(''); }
    setSigningIn(false);
  };

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
        <div className="p-4 border-t border-border">
          {loading ? (
            <p className="text-xs text-muted-foreground">Loading...</p>
          ) : user ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
                <LogOut className="h-3 w-3 mr-2" /> Sign Out
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-2">
              <p className="text-xs text-muted-foreground">Sign in for uploads</p>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-8 text-xs"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-8 text-xs"
                required
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" size="sm" className="w-full" disabled={signingIn}>
                <LogIn className="h-3 w-3 mr-2" /> {signingIn ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
