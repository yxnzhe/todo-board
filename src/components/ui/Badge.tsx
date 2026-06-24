interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color = '#6b7280', size = 'sm' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-0.5 text-[10px]';
  return (
    <span
      className={`inline-flex items-center rounded font-medium tracking-widest uppercase ${sizeClasses}`}
      style={{ backgroundColor: `${color}12`, color }}
    >
      {label}
    </span>
  );
}
