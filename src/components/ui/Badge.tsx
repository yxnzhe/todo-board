interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color = '#6b7280', size = 'sm' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span
      className={`inline-flex items-center rounded font-medium ${sizeClasses}`}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </span>
  );
}
