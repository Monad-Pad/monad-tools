import React from 'react';

interface RequiredAsterixProps {
  className?: string;
}

const RequiredAsterix: React.FC<RequiredAsterixProps> = ({ className }) => {
  return <span className={`text-red-500 ${className || ''}`}>*</span>;
};

export default RequiredAsterix;
