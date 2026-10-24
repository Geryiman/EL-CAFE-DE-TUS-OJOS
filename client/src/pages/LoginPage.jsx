import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Loader2 } from 'lucide-react';
import QuickLogin from '../components/admin/QuickLogin';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { handleLogin } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await handleLogin(username, password);
      showToast('Sesión iniciada');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="absolute left-4 top-4 flex w-[calc(100%-2rem)] items-center justify-between">
        <Link to="/" className="btn-ghost">
          <ArrowLeft size={16} /> Volver al menú
        </Link>
        <ThemeToggle />
      </div>

      <div className="glass-strong w-full max-w-sm animate-slide-up p-7">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-coffee-700 text-white shadow-lg">
            <Coffee size={26} />
          </span>
          <h1 className="mt-4 text-xl font-bold">Panel de administración</h1>
          <p className="text-sm text-neutral-500">El Café de Tus Ojos</p>
        </div>

        <QuickLogin />

        <div className="my-5 flex items-center gap-3 text-xs text-neutral-500">
          <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          o con tus credenciales
          <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            autoComplete="username"
            className="input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
            className="input"
            required
          />
          <button type="submit" disabled={isLoading} className="btn-ghost w-full !py-3">
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
