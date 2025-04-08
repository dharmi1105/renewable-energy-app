import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-secondary-dark rounded-lg shadow-lg overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-tertiary-dark">
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;