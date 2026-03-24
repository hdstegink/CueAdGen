import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

interface PasswordGateProps {
  children: React.ReactNode;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('app_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('app_authenticated', 'true');
      } else {
        setError(data.message || 'Onjuist wachtwoord');
      }
    } catch (err) {
      setError('Er is een fout opgetreden bij de verificatie.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated === null) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#783C96] via-[#D23278] to-[#fabb22]"></div>
        <div className="p-8 md:p-10">
          <div className="w-16 h-16 bg-[#783C96]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-8 h-8 text-[#783C96]" />
          </div>
          
          <h1 className="text-2xl font-black text-center text-black mb-2">Beveiligde Toegang</h1>
          <p className="text-gray-500 text-center text-sm mb-8 font-medium">
            Voer het wachtwoord in om CUE: AdGen te openen.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <input
                autoFocus
                type="password"
                placeholder="Wachtwoord"
                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#783C96] focus:ring-2 focus:ring-[#783C96]/10 outline-none transition-all font-semibold text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-tight bg-red-50 p-3 rounded-lg border border-red-100">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#783C96] hover:bg-[#602f7a] text-white rounded-full font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Verifieer <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              CUE: AdGen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
