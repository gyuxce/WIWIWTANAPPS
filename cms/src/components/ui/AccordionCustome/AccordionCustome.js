// src/components/Accordion.js
import React, { useState, useEffect } from 'react';
import Progress from '../Progress';

const AccordionItemCustome = ({
  containerClass = null,
  headerClass = null,
  title,
  children,
  isActive,
  onItemClick,
  progress = null,
}) => {
  return (
    <div className={containerClass ?? 'mx-4 my-2'}>
      <div
        className={`flex items-center justify-between bg-white cursor-pointer border-b-[1px] border-b-second-600 ${headerClass}`}
        onClick={onItemClick}
      >
        <div className={`text-gray-800 text-xl font-normal font-opificio ${!headerClass && 'mb-2'}`}>{title}</div>
        <div className="flex items-center">
          {progress && (
            <div className="flex items-center mr-2 text-end text-xs">
              <span className="mr-1">{`${progress} %`}</span>
              <Progress className="!h-3 !w-[100px]" color="indigo-500" showInfo={false} percent={progress} />
            </div>
          )}
          <svg
            className={`w-6 h-6 text-main-200 transition-transform transform ${isActive ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {isActive && <div className=" bg-white">{children}</div>}
    </div>
  );
};

const AccordionCustome = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  useEffect(() => {
    // Automatically set the first item as active when the component mounts
    if (React.Children.count(children) > 0) {
      setActiveIndex(0);
    }
  }, [children]);

  return (
    <div>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isActive: index === activeIndex,
            onItemClick: () => handleItemClick(index),
          });
        }
        return null;
      })}
    </div>
  );
};

export { AccordionCustome, AccordionItemCustome };
