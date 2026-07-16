import { ChevronRightIcon, HomeIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="text-sm font-medium mb-2">
      <ol className="list-none p-0 inline-flex">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.path === '/' ? (
              <Link to={item.path} className="hover:underline text-xs text-grey-500 leading-none">
                <HomeIcon />
              </Link>
            ) : index < items.length - 1 ? (
              <Link to={item.path} className="hover:underline text-xs text-grey-500 leading-none">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500 text-xs leading-none">{item.label}</span>
            )}

            {index < items.length - 1 && (
              <span className="mx-1">
                <ChevronRightIcon />
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
