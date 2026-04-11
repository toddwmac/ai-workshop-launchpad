import type { ReactNode } from 'react';
import clsx from 'clsx';

interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Tag({ children, variant = 'default', size = 'md', className }: TagProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'bg-brand-blue-100 text-brand-blue-800 dark:bg-brand-blue-900 dark:text-brand-blue-200',
    secondary: 'bg-brand-orange-100 text-brand-orange-800 dark:bg-brand-orange-900 dark:text-brand-orange-200',
    success: 'bg-brand-yellow-100 text-brand-yellow-800 dark:bg-brand-yellow-900 dark:text-brand-yellow-200',
    warning: 'bg-brand-yellow-100 text-brand-yellow-800 dark:bg-brand-yellow-900 dark:text-brand-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}