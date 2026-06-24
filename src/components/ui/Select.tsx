import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] text-text-muted font-medium tracking-widest uppercase">{label}</label>}
      <select
        className={`bg-transparent border-b border-border-light px-0 py-1.5 text-[12px] text-text-primary focus:border-chrome transition-colors duration-300 outline-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-bg-secondary">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
