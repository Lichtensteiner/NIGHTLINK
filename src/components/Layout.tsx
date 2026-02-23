import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Calendar, User, Settings, LogOut, MessageSquare } from 'lucide-react';
import { cn } from '../components/ui';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/dashboard' },
    { icon: Briefcase, label: 'Missions', path: '/missions' },
    { icon: Calendar, label: 'Planning', path: '/planning' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-night-black text-white pb-20 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-night-black/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-night-purple to-night-gold" />
            <span className="text-xl font-bold tracking-tight">NIGHTLINK</span>
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {user.first_name} {user.last_name}
              </span>
              <button 
                onClick={() => signOut()}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-night-black/90 backdrop-blur-lg md:hidden">
          <div className="flex h-16 items-center justify-around px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-16",
                    isActive ? "text-night-purple" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
