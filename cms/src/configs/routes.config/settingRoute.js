import React from 'react';

const settingRoute = [
  {
    key: 'setting.profile',
    path: '/setting/profile',
    component: React.lazy(() => import('views/pengaturan/profile')),
    authority: ['pengaturan'],
  },
  {
    key: 'setting.sistem',
    path: '/setting/sistem',
    component: React.lazy(() => import('views/pengaturan/sistem')),
    authority: ['pengaturan'],
  },
];

export default settingRoute;
