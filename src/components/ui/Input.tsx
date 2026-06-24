import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-text-secondary font-medium">{label}</label>}
      <input
        className={`bg-bg-tertiary border border-border rounded px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-accent transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
