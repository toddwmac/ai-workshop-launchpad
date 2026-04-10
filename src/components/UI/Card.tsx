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
  blue: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
  green: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
  purple: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950',
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