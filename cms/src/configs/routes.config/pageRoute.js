import React from 'react';
import { PageConfig as NotificationConfig } from 'views/notification/config';
import { PageConfig as SeminarConfig } from 'views/seminar/config';

const pageRoute = [
  {
    key: 'page.wawancara',
    path: '/wawancara',
    component: React.lazy(() => import('views/wawancara')),
    authority: ['wawancara_final'],
  },
  {
    key: 'page.wawancara',
    path: '/wawancara/:user_id/create/',
    component: React.lazy(() => import('views/wawancara/create')),
    authority: ['wawancara_final'],
  },
  {
    key: 'page.wawancara',
    path: '/wawancara/:user_id/edit/:id',
    component: React.lazy(() => import('views/wawancara/create')),
    authority: ['wawancara_final'],
  },
  {
    key: 'page.wawancara',
    path: '/wawancara/details/:id',
    component: React.lazy(() => import('views/wawancara/detail_siswa')),
    authority: ['wawancara_final'],
  },
  {
    key: 'page.notification',
    path: NotificationConfig.url,
    component: React.lazy(() => import('views/notification')),
    authority: ['konten_notifikasi'],
  },
  {
    key: 'page.notification',
    path: NotificationConfig.createUrl,
    component: React.lazy(() => import('views/notification/form')),
    authority: ['konten_notifikasi'],
  },
  {
    key: 'page.notification',
    path: NotificationConfig.editUrl,
    component: React.lazy(() => import('views/notification/form')),
    authority: ['konten_notifikasi'],
  },
  {
    key: 'page.seminar',
    path: SeminarConfig.url,
    component: React.lazy(() => import('views/seminar')),
    authority: ['seminar_wiwitan'],
  },
  {
    key: 'page.seminar',
    path: SeminarConfig.createUrl,
    component: React.lazy(() => import('views/seminar/form')),
    authority: ['seminar_wiwitan'],
  },
  {
    key: 'page.seminar',
    path: SeminarConfig.editUrl,
    component: React.lazy(() => import('views/seminar/form')),
    authority: ['seminar_wiwitan'],
  },
  {
    key: 'page.seminar',
    path: SeminarConfig.detailUrl,
    component: React.lazy(() => import('views/seminar/detail')),
    authority: ['seminar_wiwitan'],
  },
  {
    key: 'page.forum',
    path: '/forum',
    component: React.lazy(() => import('views/forum/index')),
    authority: ['forum_diskusi'],
  },
  {
    key: 'page.forum',
    path: '/forum/post',
    component: React.lazy(() => import('views/forum/formPost')),
    authority: ['forum_diskusi'],
  },
  {
    key: 'page.forum',
    path: '/forum/detail/:id',
    component: React.lazy(() => import('views/forum/detailPost')),
    authority: ['forum_diskusi'],
  },
  {
    key: 'page.forum',
    path: '/forum/post/edit/:id',
    component: React.lazy(() => import('views/forum/formPost')),
    authority: ['forum_diskusi'],
  },
  {
    key: 'page.forum',
    path: '/forum/report/:id',
    component: React.lazy(() => import('views/forum/ReportList/detail')),
    authority: ['forum_diskusi'],
  },
];

export default pageRoute;
