import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams } from 'react-router-dom';
import { apiShow } from '../api/api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { PageConfig } from './config';
dayjs.extend(utc);
const DetailTestStudent = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Tes Bakat Bahasa', path: '/test/language' },
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

    fetchData(); // Panggil fungsi fetchData
  }, [id]);
  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6 mb-1" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{data?.user?.name}</div>
        </div>
      </div>
      <Card className="border-none rounded-xl">
        <div className=" text-black text-xl font-normal font-opificio mb-6">Detail Nilai</div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Nama Siswa</span>
          <span>{data?.user?.name}</span>
        </div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Tanggal Submit</span>
          <span>{data?.finished_at ? dayjs(data?.finished_at).format('D MMM YYYY') : '-'}</span>
        </div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Nilai</span>
          <span>{data?.weight_achieved ?? '-'}</span>
        </div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Status</span>
          {data?.status == 1 ? (
            <div className="">
              <span className="px-3 py-2 bg-green-50 rounded-full border border-green-500 text-green-500 text-xs font-normal font-goth">
                {data.status_label}
              </span>
            </div>
          ) : (
            <div className="">
              {data.status_label !== null ? (
                <div className="h-[31px] px-3 py-2 bg-orange-50 rounded-[100px] border border-orange-500 justify-center items-center gap-2.5 inline-flex">
                  <div className="text-orange-500 text-xs font-normal font-goth">{data.status_label}</div>
                </div>
              ) : (
                '-'
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DetailTestStudent;
