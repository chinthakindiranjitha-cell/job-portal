import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/AuthDialog';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthDialog(true);
  };

  return (
    <>
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold">JobHub</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-blue-100 font-medium">Jobs</a>
                <a href="#" className="hover:text-blue-100 font-medium">Companies</a>
                <a href="#" className="hover:text-blue-100 font-medium">Salary</a>
                <a href="#" className="hover:text-blue-100 font-medium">Resources</a>
              </nav>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus:bg-white focus:text-foreground focus:placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <span className="hidden sm:block text-sm">
                    Welcome, {user.name} ({user.role})
                  </span>
                  <Button 
                    variant="jobhub-outline" 
                    size="sm"
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="jobhub-outline" 
                    size="sm"
                    onClick={() => handleAuthClick('signin')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white text-primary hover:bg-gray-100"
                    onClick={() => handleAuthClick('signup')}
                  >
                    Post a Job
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthDialog 
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        mode={authMode}
      />
    </>
  );
};