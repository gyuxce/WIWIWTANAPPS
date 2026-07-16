import React from 'react';

const managementRoute = [
  {
    key: 'about',
    path: `/about-us`,
    component: React.lazy(() => import('views/management/about')),
    authority: [],
    meta: {
      layout: 'blank',
    },
  },
  {
    key: 'termConditions',
    path: `/terms-condition`,
    component: React.lazy(() => import('views/management/term')),
    authority: [],
    meta: {
      layout: 'blank',
    },
  },
  {
    key: 'privacyPolicy',
    path: `/privacy-policy`,
    component: React.lazy(() => import('views/management/policy')),
    authority: [],
    meta: {
      layout: 'blank',
    },
  },
];

export default managementRoute;
