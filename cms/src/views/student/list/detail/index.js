import React, { useState } from 'react';
import { Tabs } from 'components/ui';
import { Link } from 'react-router-dom';
import { PageConfig } from '../config';
import FormData from './information';
import AccountInformation from './account';
import Page from './document';
import Breadcrumbs from 'components/ui/Breadcrumbs';

const { TabNav, TabList, TabContent } = Tabs;

const StudentDetail = () => {
  const [currentTab, setCurrentTab] = useState('information');
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: PageConfig.url },
    { label: 'Detail Siswa', path: '' },
  ];

  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">Detail Siswa</div>
        </div>
      </div>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList className="bg-white border-b-0 py-0 pt-1 rounded-lg px-1 h-10">
          <TabNav className="my-0 py-[6px] text-stone-400" value="information">
            Informasi Pribadi
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="account">
            Informasi Akun
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="document">
            Dokumen Siswa
          </TabNav>
        </TabList>
        <div className="pt-4">
          <TabContent value="information">
            <FormData />
          </TabContent>
          <TabContent value="account">
            <AccountInformation />
          </TabContent>
          <TabContent value="document">
            <Page />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
