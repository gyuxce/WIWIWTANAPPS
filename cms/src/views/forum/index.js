import React, { useCallback, useEffect, useState } from 'react';
import { Tabs } from 'components/ui';
import PostList from './PostList';
import MyPostList from './MyPostList';
import DirtyWordList from './DirtyWordList';
import ReportList from './ReportList';
import dayjs from 'dayjs';
import { apiForumMyPost, apiForumPost, apiGetHashWords } from 'services/ForumService';
import { apiIndex } from './ReportList/api';
import { useLocation } from 'react-router-dom';

const { TabNav, TabList, TabContent } = Tabs;

const Forum = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageParam = queryParams.get('page');
  const getPageToTabMapping = (page) => {
    switch (page) {
      case 'mypostlist':
        return 'tab2';
      case 'dirtyword':
        return 'tab3';
      case 'reportlist':
        return 'tab4';
      default:
        return 'tab1';
    }
  };
  const [currentTab, setCurrentTab] = useState(getPageToTabMapping(pageParam));
  const [localState, setLocalState] = useState({
    updated: null,
    params: {
      q: '',
      type: 'pagination',
      page: 1,
      limit: 10,
      order_by: 'updated_at',
      sort_by: 'desc',
      options: [],
    },
  });

  const fetchApiForTab1 = useCallback(async (params) => {
    try {
      const ress = await apiForumPost(params);
      const responseData = ress.data;
      return responseData;
    } catch (error) {
      return error?.response?.data?.message;
    }
  }, []);

  const fetchApiForTab2 = useCallback(async (params) => {
    try {
      const ress = await apiForumMyPost(params);
      const responseData = ress.data;
      return responseData;
    } catch (error) {
      return error?.response?.data?.message;
    }
  }, []);

  const fetchApiForTab3 = useCallback(async (params) => {
    try {
      const ress = await apiGetHashWords(params);
      const responseData = ress.data;
      return responseData;
    } catch (error) {
      return error?.response?.data?.message;
    }
  }, []);

  const fetchApiForTab4 = useCallback(async (params) => {
    try {
      const ress = await apiIndex(params);
      const responseData = ress.data;
      return responseData;
    } catch (error) {
      return error?.response?.data?.message;
    }
  }, []);

  const fetchDataBasedOnActiveTab = useCallback(async () => {
    setLocalState((prevState) => ({ ...prevState, loading: true }));

    let apiResponse;
    switch (currentTab) {
      case 'tab1':
        apiResponse = await fetchApiForTab1();
        break;
      case 'tab2':
        apiResponse = await fetchApiForTab2();
        break;
      case 'tab3':
        apiResponse = await fetchApiForTab3();
        break;
      case 'tab4':
        apiResponse = await fetchApiForTab4();
        break;
      default:
        console.error('Unknown tab');
        setLocalState((prevState) => ({ ...prevState, loading: false }));
        return;
    }
    setLocalState({
      updated: apiResponse.last_updated ? dayjs(apiResponse.last_updated).format('DD MMMM YYYY, HH:mm') : '-',
    });
  }, [currentTab]);

  useEffect(() => {
    fetchDataBasedOnActiveTab();
  }, [currentTab, fetchDataBasedOnActiveTab]);

  return (
    <div className="px-7">
      <div className="mb-7">
        <div className="text-h3 text-second-200 mb-1 font-opificio">Forum Diskusi</div>
        <div className="text-stone-700 text-xs font-normal font-goth">Pembaruan Terakhir : {localState.updated}</div>
      </div>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList className="bg-white border-b-0 py-0 pt-1 rounded-lg px-1 h-10">
          <TabNav
            className={`my-0 py-[6px] text-[#A8A29E] ${currentTab === 'tab1' ? '!text-[#262564]' : ''}`}
            value="tab1"
          >
            Daftar Postingan
          </TabNav>
          <TabNav
            className={`my-0 py-[6px] text-[#A8A29E] ${currentTab === 'tab2' ? '!text-[#262564]' : ''}`}
            value="tab2"
          >
            Postingan Saya
          </TabNav>
          <TabNav
            className={`my-0 py-[6px] text-[#A8A29E] ${currentTab === 'tab3' ? '!text-[#262564]' : ''}`}
            value="tab3"
          >
            Daftar Kata Terlarang
          </TabNav>
          <TabNav
            className={`my-0 py-[6px] text-[#A8A29E] ${currentTab === 'tab4' ? '!text-[#262564]' : ''}`}
            value="tab4"
          >
            Daftar Laporan
          </TabNav>
        </TabList>
        <div className="pt-5">
          <TabContent value="tab1">
            <PostList />
          </TabContent>
          <TabContent value="tab2">
            <MyPostList />
          </TabContent>
          <TabContent value="tab3">
            <DirtyWordList />
          </TabContent>
          <TabContent value="tab4">
            <ReportList />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Forum;
