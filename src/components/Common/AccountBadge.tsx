import React from 'react';
import { Account } from '../../types/mail';

interface AccountBadgeProps {
  account?: Account | { name: string; color: string; email?: string };
  size?: 'xs' | 'sm' | 'md';
  showName?: boolean;
  className?: string;
}

export const AccountBadge: React.FC<AccountBadgeProps> = ({
  account,
  size = 'sm',
  showName = true,
  className = '',
}) => {
  if (!account) return null;

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-2',
  }[size];

  // Clean account display name (e.g. "Work", "Personal", "Rivers Advisory")
  const displayName = account.name.replace(/Alex Rivers\s*\((.*?)\)/i, '$1').replace(/\(.*?\)/g, (match) => match.replace(/[()]/g, ''));

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium tracking-tight border select-none transition-colors ${sizeClasses} ${className}`}
      style={{
        backgroundColor: `${account.color}15`,
        borderColor: `${account.color}35`,
        color: account.color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
        style={{ backgroundColor: account.color }}
      />
      {showName && <span className="truncate max-w-[120px]">{displayName}</span>}
    </span>
  );
};
