import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
}

const variants = {
  primary: 'bg-accent hover:bg-accent-hover text-white',
  secondary: 'bg-bg-tertiary hover:bg-bg-hover text-text-primary border border-border',
  ghost: 'hover:bg-bg-hover text-text-secondary hover:text-text-primary',
  danger: 'bg-danger/10 hover:bg-danger/20 text-danger',
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-xs',
};

export function Button({ variant = 'secondary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
