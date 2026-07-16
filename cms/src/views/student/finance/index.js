import React, { useCallback, useEffect, useState } from 'react';
import { Tabs } from 'components/ui';
import StudentList from './StudentList';
import PackagePriceList from './PackagePriceList';
import PaymentContentList from './PaymentContentList';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useLocation } from 'react-router-dom';
import { apiIndex as studentApiIndex } from './StudentList/api';
import { apiIndex as packagePriceApiIndex } from './PackagePriceList/api';
import { apiIndex as paymentContentApiIndex } from './PaymentContentList/api';

const { TabNav, TabList, TabContent } = Tabs;
dayjs.extend(utc);
const Forum = () => {
  const [currentTab, setCurrentTab] = useState('tab1');
  const location = useLocation();
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
      const ress = await studentApiIndex(params);
      const responseData = ress.data;
      return responseData;
    } catch (error) {
      return error?.response?.data?.message;
    }
  }, []);

  const fetchApiForTab2 = useCallback(async (params) => {
    try {
      const ress = await packagePriceApiIndex(params);
      const responseData = ress.data;
      return responseData;
    } catch (error) {
      return error?.response?.data?.message;
    }
  }, []);

  const fetchApiForTab3 = useCallback(async (params) => {
    try {
      const ress = await paymentContentApiIndex(params);
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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');

    if (tab && ['tab1', 'tab2', 'tab3'].includes(tab)) {
      setCurrentTab(tab);
    }
  }, [location]);

  return (
    <div className="px-7">
      <div className="mb-7">
        <div className="text-h3 text-second-200 mb-1 font-opificio">Data Pembayaran</div>
        <div className="text-stone-700 text-xs font-normal font-goth">Pembaruan Terakhir : {localState.updated}</div>
      </div>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList className="bg-white border-b-0 py-0 pt-1 rounded-lg px-1 h-10">
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab1">
            Daftar Siswa
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab2">
            Harga Paket
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab3">
            Konten Pembayaran
          </TabNav>
        </TabList>
        <div className="pt-5">
          <TabContent value="tab1">
            <StudentList />
          </TabContent>
          <TabContent value="tab2">
            <PackagePriceList />
          </TabContent>
          <TabContent value="tab3">
            <PaymentContentList />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Forum;
