import React from 'react';

const mobileRoute = [
  {
    key: 'mobileForum',
    path: `/mobile/forum/:id`,
    component: React.lazy(() => import('views/mobile/Forum')),
    authority: [],
  },
];

export default mobileRoute;
