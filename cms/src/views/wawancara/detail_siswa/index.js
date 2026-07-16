import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Notification, Tabs, toast } from 'components/ui';
import InformasiSiswa from './informasiSiswa';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useNavigate, useParams } from 'react-router-dom';
import DaftarWawancara from './daftarWawancara';
import { apiDetailUser } from 'views/pengaturan/api';

const { TabNav, TabList, TabContent } = Tabs;

const Forum = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const firstLoad = useRef(true);
  const [data, setData] = useState();

  const [currentTab, setCurrentTab] = useState('tab1');
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Wawancara Final', path: '/wawancara' },
    { label: `Detail Siswa`, path: '' },
  ];

  const getData = useCallback(async () => {
    try {
      const ress = await apiDetailUser(id);
      setData(ress.data?.data);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  }, [data]);

  useEffect(() => {
    if (firstLoad.current && id) {
      getData(data);
      firstLoad.current = false;
    }
  }, [getData, data]);

  return (
    <div className="px-5">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex justify-start items-center mb-7 ">
        <Button
          icon={<ChevronLeftIcon width={24} height={24} />}
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          variant="plain"
        />
        <p className="text-h3 text-second-200 font-opificio">{data?.name}</p>
      </div>
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabList className="bg-white border-b-0 py-0 pt-1 rounded-lg px-1 h-10">
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab1">
            Informasi Siswa
          </TabNav>
          <TabNav className="my-0 py-[6px] text-stone-400" value="tab2">
            Daftar Wawancara
          </TabNav>
        </TabList>
        <div className="pt-5">
          <TabContent value="tab1">
            <InformasiSiswa data={data} />
          </TabContent>
          <TabContent value="tab2">
            <DaftarWawancara id={id} />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Forum;
