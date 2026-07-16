import React from 'react';
import { PageConfig as RoleConfig } from 'views/role/config';
import { PageConfig as UserConfig } from 'views/user/config';

const adminRoute = [
  {
    key: 'admin.role',
    path: RoleConfig.url,
    component: React.lazy(() => import('views/role')),
    authority: ['manajemen_admin'],
  },
  {
    key: 'admin.role',
    path: RoleConfig.createUrl,
    component: React.lazy(() => import('views/role/form')),
    authority: ['manajemen_admin'],
  },
  {
    key: 'admin.role',
    path: RoleConfig.editUrl,
    component: React.lazy(() => import('views/role/form')),
    authority: ['manajemen_admin'],
  },
  {
    key: 'admin.user',
    path: UserConfig.url,
    component: React.lazy(() => import('views/user')),
    authority: ['manajemen_admin'],
  },
  {
    key: 'admin.user',
    path: UserConfig.createUrl,
    component: React.lazy(() => import('views/user/form')),
    authority: ['manajemen_admin'],
  },
  {
    key: 'admin.user',
    path: UserConfig.editUrl,
    component: React.lazy(() => import('views/user/form')),
    authority: ['manajemen_admin'],
  },
];

export default adminRoute;
