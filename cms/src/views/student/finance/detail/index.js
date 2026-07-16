import React, { useEffect, useState } from 'react';
import { Tabs } from 'components/ui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Link, useParams } from 'react-router-dom';
import AdministrationDetail from './AdministrationDetail';
import { apiShow } from '../StudentList/api';
import TrainingDetail from './TrainingDetail';
import Breadcrumbs from 'components/ui/Breadcrumbs';
const { TabNav, TabList, TabContent } = Tabs;
dayjs.extend(utc);

const DetailPayment = () => {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState('tab1');
  const [data, setData] = useState({});
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Data Pembayaran', path: '/student/payment' },
    { label: 'Detail', path: '' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          relations: 'user',
        };
        const ress = await apiShow(id, params);
        setData(ress.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="px-7">
      <div className="router mb-3">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={'/student/payment'}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6 mb-1" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{data?.user?.name}</div>
        </div>
      </div>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList className="bg-white border-b-0 py-0 pt-1 rounded-lg px-1 h-10">
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab1">
            Administrasi
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab2">
            Pelatihan
          </TabNav>
        </TabList>
        <div className="pt-5">
          <TabContent value="tab1">
            <AdministrationDetail />
          </TabContent>
          <TabContent value="tab2">
            <TrainingDetail />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DetailPayment;
