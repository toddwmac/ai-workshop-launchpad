import type { ReactNode } from 'react';
import clsx from 'clsx';

type ColorVariant = 'blue' | 'green' | 'purple' | 'default';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  colorVariant?: ColorVariant;
}

const colorStyles: Record<ColorVariant, string> = {
  default: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
  blue: 'border-brand-blue-200 bg-brand-blue-50 dark:border-brand-blue-800 dark:bg-brand-blue-950',
  green: 'border-brand-yellow-200 bg-brand-yellow-50 dark:border-brand-yellow-800 dark:bg-brand-yellow-950',
  purple: 'border-brand-orange-200 bg-brand-orange-50 dark:border-brand-orange-800 dark:bg-brand-orange-950',
};

export function Card({ children, className, hoverable, onClick, colorVariant }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border p-6 shadow-sm',
        colorStyles[colorVariant ?? 'default'],
        hoverable && 'cursor-pointer transition-shadow hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}