import React from 'react';
import { PageConfig as TrainingModuleConfig } from 'views/training/module/config';
import { PageConfig as TrainingListConfig } from 'views/training/list/config';

const trainingRoute = [
  {
    key: 'training.category',
    path: '/training/category',
    component: React.lazy(() => import('views/training/category')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.category',
    path: '/training/category/create',
    component: React.lazy(() => import('views/training/category/create')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.category',
    path: '/training/category/edit/:id',
    component: React.lazy(() => import('views/training/category/create')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.module',
    path: TrainingModuleConfig.url,
    component: React.lazy(() => import('views/training/module')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.module',
    path: TrainingModuleConfig.createUrl,
    component: React.lazy(() => import('views/training/module/form')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.module',
    path: TrainingModuleConfig.detailUrl,
    component: React.lazy(() => import('views/training/module/detail')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.list',
    path: '/training/list',
    component: React.lazy(() => import('views/training/list')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.list',
    path: TrainingListConfig.createUrl,
    component: React.lazy(() => import('views/training/list/form')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.list',
    path: TrainingListConfig.detailUrl,
    component: React.lazy(() => import('views/training/list/detail')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.score',
    path: '/training/score',
    component: React.lazy(() => import('views/training/score')),
    authority: ['materi_pelatihan'],
  },
  {
    key: 'training.score',
    path: '/training/score/detail/:id',
    component: React.lazy(() => import('views/training/score/detail')),
    authority: [],
  },
  {
    key: 'training.module',
    path: '/training/module/:parentId/virtual/create',
    component: React.lazy(() => import('views/training/module/detail/virtual/create')),
    authority: [],
  },
  {
    key: 'training.module',
    path: '/training/module/:parentId/virtual/edit/:id',
    component: React.lazy(() => import('views/training/module/detail/virtual/create')),
    authority: [],
  },
  {
    key: 'training.module',
    path: '/training/module/detail/:parentId/assesment/:id/question',
    component: React.lazy(() => import('views/training/module/detail/assesment/question')),
    authority: [],
  },
  {
    key: 'training.module',
    path: '/training/module/detail/:parentId/assesment/:id/question/:id_package',
    component: React.lazy(() => import('views/training/module/detail/assesment/question/form')),
    authority: [],
  },
  {
    key: 'training.module',
    path: '/training/module/detail/:id/assesment/verbal',
    component: React.lazy(() => import('views/training/module/detail/assesment/verbal')),
    authority: [],
  },
];

export default trainingRoute;
