import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 text-primary mx-auto flex items-center justify-center shadow-soft">
        <Activity className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-5xl font-heading font-black text-ink">404</h1>
        <h2 className="text-xl font-heading font-bold text-ink">Page Not Found</h2>
        <p className="text-sm text-ink-muted">
          We couldn't find the page you were looking for. Let's get you back on track.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        <Link to="/analyze" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full">
            Analyze Report
          </Button>
        </Link>
      </div>
    </div>
  );
};
