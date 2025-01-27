import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[rgb(26,26,26)] border border-gray-800 rounded-lg ${className}`}>
      {children}
    </div>
  );
}
