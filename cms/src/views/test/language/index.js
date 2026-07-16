import React, { useState } from 'react';
import { Tabs } from 'components/ui';
import Studentes from './studentes';
import PraTestPage from './PraTest';
import ContentTestPage from './ContentTest';
import { useLocation } from 'react-router-dom';
const { TabNav, TabList, TabContent } = Tabs;

const Forum = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageParam = queryParams.get('page');
  const getPageToTabMapping = (page) => {
    switch (page) {
      case 'content':
        return 'tab3';
      default:
        return 'tab1';
    }
  };
  const [currentTab, setCurrentTab] = useState(getPageToTabMapping(pageParam));
  return (
    <div className="px-7">
      <p className="text-h3 text-second-200 mb-5 font-opificio">Tes Bakat Bahasa</p>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList className="bg-white border-b-0 py-0 pt-1 rounded-lg px-1 h-10">
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab1">
            Hasil Test Siswa
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab2">
            Persiapan Tes
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab3">
            Konten Tes Bakat bahasa
          </TabNav>
        </TabList>
        <div className="pt-5">
          <TabContent value="tab1">
            <Studentes />
          </TabContent>
          <TabContent value="tab2">
            <PraTestPage />
          </TabContent>
          <TabContent value="tab3">
            <ContentTestPage />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Forum;
