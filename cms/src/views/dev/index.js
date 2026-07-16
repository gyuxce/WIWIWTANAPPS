import { Pagination } from 'components/ui';
import React from 'react';

const Dev = () => {
  return (
    <div className="flex flex-col bg-white p-5 rounded">
      <p>Dev</p>
      <Pagination total={50} />
    </div>
  );
};

export default Dev;
