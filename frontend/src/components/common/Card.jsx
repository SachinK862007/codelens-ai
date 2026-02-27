import React from 'react';

/**
 * Card component for displaying content in a styled container
 */
export const Card = ({
  children,
  className = '',
  onClick = null,
  title = null,
  icon = null,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3 text-xl">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="text-gray-700">{children}</div>
    </div>
  );
};

export default Card;
