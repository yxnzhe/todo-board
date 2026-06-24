import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
}

const variants = {
  primary: 'bg-white/10 hover:bg-white/15 text-text-primary border border-white/10 hover:border-white/20',
  secondary: 'bg-bg-tertiary hover:bg-bg-hover text-text-secondary hover:text-text-primary border border-border hover:border-border-light',
  ghost: 'hover:bg-white/5 text-text-secondary hover:text-text-primary',
  danger: 'bg-danger/10 hover:bg-danger/15 text-danger border border-danger/20',
};

const sizes = {
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3.5 py-1.5 text-[11px]',
};

export function Button({ variant = 'secondary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
