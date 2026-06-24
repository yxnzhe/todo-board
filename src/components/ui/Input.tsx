import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] text-text-muted font-medium tracking-widest uppercase">{label}</label>}
      <input
        className={`bg-transparent border-b border-white/10 px-0 py-2 text-[13px] text-text-primary placeholder:text-text-muted/60 focus:border-white/30 transition-colors duration-300 outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
