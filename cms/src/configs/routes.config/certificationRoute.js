import React from 'react';

const certificationRoute = [
  {
    key: 'cert.list',
    path: '/certification/list',
    component: React.lazy(() => import('views/certification')),
    authority: ['hasil_sertifikasi_siswa'],
  },
  {
    key: 'cert.list',
    path: '/certification/list/create',
    component: React.lazy(() => import('views/certification/create')),
    authority: ['hasil_sertifikasi_siswa'],
  },
  {
    key: 'cert.list',
    path: '/certification/list/edit/:id',
    component: React.lazy(() => import('views/certification/create')),
    authority: ['hasil_sertifikasi_siswa'],
  },
  {
    key: 'cert.result',
    path: '/certification/result',
    component: React.lazy(() => import('views/certificationResult')),
    authority: ['hasil_sertifikasi_siswa'],
  },
  {
    key: 'cert.result',
    path: '/certification/result/detail-certification/:id',
    component: React.lazy(() => import('views/certificationResult/detail_cert')),
    authority: ['hasil_sertifikasi_siswa'],
  },
  {
    key: 'cert.result',
    path: '/certification/result/detail/:id',
    component: React.lazy(() => import('views/certificationResult/detail')),
    authority: ['hasil_sertifikasi_siswa'],
  },
  {
    key: 'cert.result',
    path: '/certification/result/change-status/:id',
    component: React.lazy(() => import('views/certificationResult/detail_cert')),
    authority: ['hasil_sertifikasi_siswa'],
  },
];

export default certificationRoute;
