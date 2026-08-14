import React from 'react';

interface AvatarProps {
  name: string;
  email: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const COLOR_PALETTE = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
  'bg-indigo-600',
  'bg-teal-600',
];

export const Avatar: React.FC<AvatarProps> = ({ name, email, avatarUrl, size = 'md', className = '' }) => {
  const initials = (name || email || '?')
    .split(' ')
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const colorIndex = (email || name || '')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % COLOR_PALETTE.length;
  const bgColor = COLOR_PALETTE[colorIndex];

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover shrink-0 shadow-xs ring-1 ring-black/5 dark:ring-white/10 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} ${bgColor} rounded-full flex items-center justify-center font-medium text-white shrink-0 shadow-xs select-none ${className}`}
    >
      {initials}
    </div>
  );
};
