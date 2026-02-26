// frontend/src/components/common/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title, 
  actions, 
  className = '', 
  headerClassName = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {(title || actions) && (
        <div className={`p-4 border-b ${headerClassName}`}>
          <div className="flex justify-between items-center">
            {title && (
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            )}
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
