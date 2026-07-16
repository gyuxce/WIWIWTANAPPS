import React from 'react';
import { PageConfig as ProgressConfig } from 'views/student/progress/config';
import { PageConfig as ListConfig } from 'views/student/list/config';
import { PageConfig as PaymentConfig } from 'views/student/payment/config';

const studentRoute = [
  {
    key: 'studentData.list',
    path: ListConfig.url,
    component: React.lazy(() => import('views/student/list')),
    authority: ['siswa_wiwitan'],
  },
  {
    key: 'studentData.list',
    path: ListConfig.detailUrl,
    component: React.lazy(() => import('views/student/list/detail')),
    authority: ['siswa_wiwitan'],
  },
  {
    key: 'studentData.progress',
    path: ProgressConfig.url,
    component: React.lazy(() => import('views/student/progress')),
    authority: ['siswa_wiwitan'],
  },
  {
    key: 'studentData.progress',
    path: ProgressConfig.detailUrl,
    component: React.lazy(() => import('views/student/progress/detail')),
    authority: ['siswa_wiwitan'],
  },
  {
    key: 'studentData.finance',
    path: PaymentConfig.url,
    component: React.lazy(() => import('views/student/finance')),
    authority: ['siswa_wiwitan'],
  },
  {
    key: 'studentData.finance',
    path: PaymentConfig.detailUrl,
    component: React.lazy(() => import('views/student/finance/detail')),
    authority: ['siswa_wiwitan'],
  },
  {
    key: 'studentData.finance',
    path: 'student/payment/price/edit/:id',
    component: React.lazy(() => import('views/student/finance/PackagePriceList/edit')),
    authority: ['siswa_wiwitan'],
  },
  {
    key: 'studentData.finance',
    path: 'student/payment/content/edit/:id',
    component: React.lazy(() => import('views/student/finance/PaymentContentList/edit')),
    authority: ['siswa_wiwitan'],
  },
];

export default studentRoute;
