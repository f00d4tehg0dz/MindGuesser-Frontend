import React from 'react';

const ProgressBar = ({ progress }) => {
  const maxTicks = 20;
  const filledTicks = Math.min(progress, maxTicks); 
  const emptyTicks = maxTicks - filledTicks;

  return (
    <div className="w-full h-3.5 flex">
      {Array.from({ length: filledTicks }).map((_, index) => (
        <div key={index} className="flex-1 bg-indigo-500 rounded-lg mx-0.5"></div>
      ))}
      {Array.from({ length: emptyTicks }).map((_, index) => (
        <div key={index} className="flex-1 bg-neutral-700 rounded-lg mx-0.5"></div>
      ))}
    </div>
  );
};

export default ProgressBar;
