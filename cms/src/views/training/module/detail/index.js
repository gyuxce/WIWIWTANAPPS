import React, { useState } from 'react';
import { Tabs } from 'components/ui';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PageConfig } from 'views/training/module/config';
import FormData from './information';
import Page from './virtual';
import Assesment from './assesment';
import Breadcrumbs from 'components/ui/Breadcrumbs';

const { TabNav, TabList, TabContent } = Tabs;

const ModulPelatihan = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageParam = queryParams.get('page');
  const getPageToTabMapping = (page) => {
    switch (page) {
      case 'assessment':
        return 'assessment';
      case 'virtual':
        return 'virtual_class';
      default:
        return 'information';
    }
  };
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: PageConfig.url },
    { label: 'Detail', path: '' },
  ];

  const [currentTab, setCurrentTab] = useState(getPageToTabMapping(pageParam));
  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{PageConfig.moduleTitle}</div>
        </div>
      </div>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList className="bg-white border-b-0 py-0 pt-1 rounded-lg px-1 h-10">
          <TabNav className="my-0 py-[6px] text-stone-400" value="information">
            Informasi Modul
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="virtual_class">
            Kelas Virtual
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="assessment">
            Asesmen
          </TabNav>
        </TabList>
        <div className="pt-4">
          <TabContent value="information">
            <FormData />
          </TabContent>
          <TabContent value="virtual_class">
            <Page />
          </TabContent>
          <TabContent value="assessment">
            <Assesment id={id} />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ModulPelatihan;
