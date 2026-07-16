import React from 'react';

const testRoute = [
  {
    key: 'test.language',
    path: '/test/language',
    component: React.lazy(() => import('views/test/language')),
    authority: ['konfigurasi_pra_tes'],
  },
  {
    key: 'test.language',
    path: '/test/language/:id',
    component: React.lazy(() => import('views/test/language/studentes/detail')),
    authority: ['konfigurasi_pra_tes'],
  },
  {
    key: 'test.language',
    path: '/test/language/question/:id',
    component: React.lazy(() => import('views/test/language/ContentTest/question')),
    authority: ['konfigurasi_pra_tes'],
  },
  {
    key: 'test.character',
    path: '/test/character',
    component: React.lazy(() => import('views/test/character')),
    authority: ['konfigurasi_pra_tes'],
  },
  {
    key: 'test.character',
    path: '/test/character/:id',
    component: React.lazy(() => import('views/test/character/studentes/detail')),
    authority: ['konfigurasi_pra_tes'],
  },
  {
    key: 'test.qna',
    path: '/test/qna',
    component: React.lazy(() => import('views/test/qna')),
    authority: ['konfigurasi_pra_tes'],
  },
  {
    key: 'test.qna',
    path: '/test/qna/:id',
    component: React.lazy(() => import('views/test/qna/detail')),
    authority: ['konfigurasi_pra_tes'],
  },
];

export default testRoute;
