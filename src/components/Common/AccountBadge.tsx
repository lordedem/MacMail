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
  size = 'xs',
  showName = true,
  className = '',
}) => {
  if (!account) return null;

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1.5',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2',
  }[size];

  // Clean account display name (e.g. "Work", "Gmail", "iCloud")
  const displayName = account.name
    .replace(/Edem\s*\((.*?)\)/i, '$1')
    .replace(/Alex Rivers\s*\((.*?)\)/i, '$1')
    .replace(/\(.*?\)/g, match => match.replace(/[()]/g, ''));

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-tight bg-white dark:bg-[#202124] border border-[#e2e8f0] dark:border-[#383a40] text-[#334155] dark:text-[#cbd5e1] select-none transition-colors shadow-2xs shrink-0 ${sizeClasses} ${className}`}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: account.color }}
      />
      {showName && <span className="truncate">{displayName}</span>}
    </span>
  );
};
