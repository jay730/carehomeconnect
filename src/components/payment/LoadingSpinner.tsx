
import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="container py-12 px-4 flex justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
