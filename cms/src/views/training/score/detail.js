import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PageConfig } from './config';
import { Tabs } from 'components/ui';
import History from './tab/history';
import Score from './tab/score';
import Breadcrumbs from 'components/ui/Breadcrumbs';
const { TabNav, TabList, TabContent } = Tabs;
dayjs.extend(utc);

const Detail = () => {
  const [currentTab, setCurrentTab] = useState('tab1');
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Buku Nilai Siswa', path: PageConfig.url },
    { label: 'Detail', path: '' },
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
        <TabList className="bg-white border-b-0 px-3 pt-3 rounded-lg">
          <TabNav className="my-0 py-2 text-stone-400" value="tab1">
            Detail Nilai
          </TabNav>
          <TabNav className="my-0 py-2 text-stone-400" value="tab2">
            History Penilaian
          </TabNav>
        </TabList>
        <div className="pt-5">
          <TabContent value="tab1">
            <Score />
          </TabContent>
          <TabContent value="tab2">
            <History />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Detail;
