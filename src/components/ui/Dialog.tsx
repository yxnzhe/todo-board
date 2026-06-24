import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Dialog({ open, onClose, title, children, width = 'max-w-lg' }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={`bg-bg-secondary border border-white/[0.06] rounded shadow-2xl w-full ${width} mx-4`}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04]">
          <h3 className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-secondary">{title}</h3>
          <button onClick={onClose} className="text-text-muted/40 hover:text-text-primary p-1 rounded hover:bg-white/[0.03] transition-all duration-200 cursor-pointer">
            <X size={13} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
