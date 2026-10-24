import { MapPin, MessageCircle } from 'lucide-react';

export default function Footer({ businessName, whatsapp }) {
  const cleanPhone = String(whatsapp || '').replace(/\D/g, '');

  return (
    <footer id="contacto" className="mx-auto mt-16 max-w-6xl px-4 pb-10">
      <div className="glass flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-bold">{businessName}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
            <MapPin size={14} /> Pide desde tu mesa, sin registros ni cuentas.
          </p>
        </div>
        {cleanPhone && (
          <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <MessageCircle size={16} /> Escríbenos por WhatsApp
          </a>
        )}
      </div>
      <p className="mt-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {businessName}. Todos los derechos reservados.
      </p>
    </footer>
  );
}
