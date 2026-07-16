import React from 'react';
import authRoute from './authRoute';
import studentRoute from './studentRoute';
import pageRoute from './pageRoute';
import testRoute from './testRoute';
import trainingRoute from './trainingRoute';
import mobileRoute from './mobileRoute';
import settingRoute from './settingRoute';
import certificationRoute from './certificationRoute';
import adminRoute from './adminRoute';
import { PageConfig as LogConfig } from 'views/log_aktifitas/config';
import managementRoute from './managementRoute';

export const publicRoutes = [...authRoute, ...mobileRoute, ...managementRoute];

export const protectedRoutes = [
  ...studentRoute,
  ...pageRoute,
  ...testRoute,
  ...trainingRoute,
  ...settingRoute,
  ...certificationRoute,
  ...adminRoute,
  {
    key: 'dashboard',
    path: '/dashboard',
    component: React.lazy(() => import('views/dashboard')),
    authority: ['dashboard'],
  },
  {
    key: 'dashboard',
    path: LogConfig.url,
    component: React.lazy(() => import('views/log_aktifitas')),
    authority: ['activity_log'],
  },
  {
    key: 'accessDenied',
    path: '/access-denied',
    component: React.lazy(() => import('views/accessDenied')),
    authority: [],
  },
];
