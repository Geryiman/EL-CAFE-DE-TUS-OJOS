import { useEffect, useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export default function QuickLogin() {
  const { handleQuickAdminLogin } = useAuth();
  const { showToast } = useToast();
  const [isDemoEnabled, setIsDemoEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api
      .getDemoStatus()
      .then((data) => setIsDemoEnabled(data.demoMode))
      .catch(() => setIsDemoEnabled(false));
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await handleQuickAdminLogin();
      showToast('Bienvenido al panel demo');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDemoEnabled) return null;

  return (
    <button onClick={handleClick} disabled={isLoading} className="btn-primary w-full !py-3.5 text-base">
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
      Ingresar como Demo Admin (1-Clic)
    </button>
  );
}
