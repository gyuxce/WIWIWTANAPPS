import React, { useEffect, useRef, useState } from 'react';
import Card from 'components/ui/Card';
import InformationComponent from './component/InformationComponent';
import SeminarComponent from './component/seminarComponent';
import ProgressComponent from './component/progresComponent';
import LogComponent from './component/logComponent';
import { Link } from 'react-router-dom';
import { apiIndex as apiSeminar } from 'views/seminar/api';
import { apiIndex as apiLog } from 'views/log_aktifitas/api';
import { Notification, toast } from 'components/ui';
import { formatDateFullDMY } from 'components/ui/utils/formatter';
import { PageConfig as SeminarConfig } from 'views/seminar/config';
import { PageConfig as LogConfig } from 'views/log_aktifitas/config';
import { PageConfig as StudentProgressConfig } from 'views/student/progress/config';
import { apiDashboardProgress, apiDashboardStatistics } from 'services/AppService';
import useAuth from 'utils/hooks/useAuth';

const Home = () => {
  const firstLoad = useRef(true);
  const [seminar, setSeminar] = useState([]);
  const [log, setLog] = useState([]);
  const [cardData, setCardData] = useState([
    { title: 'Total Siswa', value: 0, imageUrl: '/img/others/dashboard-total-siswa.png' },
    { title: 'Rata-Rata Penyelesaian', value: '0%', imageUrl: '/img/others/dashboard-penyelesaian.png' },
    { title: 'Rata-Rata Penggunaan', value: '0m', imageUrl: '/img/others/dashboard-penggunaan.png' },
  ]);
  const [progresData, setProgresData] = useState([
    { title: 'Pra Tes', percent: 0 },
    { title: 'Pembayaran', percent: 0 },
    { title: 'Pelatihan', percent: 0 },
    { title: 'Sertifikasi Bahasa Jepang', percent: 0 },
    { title: 'Wawancara Final', percent: 0 },
  ]);
  const { authority } = useAuth();

  const getSeminar = async () => {
    if (authority.includes('seminar_wiwitan')) {
      try {
        const ress = await apiSeminar({
          type: 'collection',
          limit: 5,
          order_by: 'updated_at',
          sort_by: 'desc',
          relations: ['cover'].join(),
        });
        setSeminar(ress.data.data || []);
      } catch (error) {
        console.log('Error fetch data seminar:' + error?.response?.data?.message);
      }
    }
  };

  const getStatistic = async () => {
    try {
      const ress = await apiDashboardStatistics();
      const dt = ress?.data?.data;

      setCardData((prevData) => [
        { ...prevData[0], value: dt?.total_students || 0 },
        { ...prevData[1], value: dt?.average_settlement || 0 },
        { ...prevData[2], value: dt?.average_user_screentime },
      ]);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch statistic'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const getProgress = async () => {
    try {
      const ress = await apiDashboardProgress();
      const dt = ress?.data?.data;

      setProgresData((prevData) => [
        { ...prevData[0], percent: dt?.pratest || 0 },
        { ...prevData[1], percent: dt?.payment || 0 },
        { ...prevData[2], percent: dt?.training || 0 },
        { ...prevData[3], percent: dt?.certification || 0 },
        { ...prevData[4], percent: dt?.interview || 0 },
      ]);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch progress'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const getLog = async () => {
    if (authority.includes('activity_log')) {
      try {
        const ress = await apiLog({
          type: 'pagination',
          limit: 5,
          order_by: 'group_date',
          sort_by: 'desc',
          detail: false,
        });
        setLog(ress?.data?.data || []);
      } catch (error) {
        toast.push(
          <Notification title={'Error'} type="danger">
            {error?.response?.data?.message || error?.message || 'Something went wrong on fetch log'}
          </Notification>,
          {
            placement: 'top-center',
          },
        );
      }
    }
  };

  useEffect(() => {
    if (firstLoad.current) {
      getStatistic();
      getSeminar();
      getProgress();
      getLog();
      firstLoad.current = false;
    }
  }, []);

  return (
    <div className="px-7 pb-6">
      <div className="mb-6">
        <h1 className="text-blue-950 text-xl font-normal font-opificio">Dashboard</h1>
        {/* <span className="text-stone-700 text-xs font-normal font-goth">Perbaruan Terakhir : 19 Agustus 2023</span> */}
      </div>
      <div>
        <div className="grid grid-cols-12 gap-4">
          {cardData.map((card, index) => (
            <div className="col-span-12 md:col-span-4" key={index}>
              <InformationComponent title={card.title} value={card.value} imageUrl={card.imageUrl} />
            </div>
          ))}
          {authority.includes('seminar_wiwitan') && (
            <Card className="border-none col-span-12 md:col-span-4 rounded-xl flex flex-col justify-between">
              <div className="h-[23rem]">
                <p className="text-blue-950 text-xl font-normal font-opificio mb-5">Seminar</p>
                {seminar?.map((val, idx) => (
                  <div className="mb-5" key={`seminar-${idx}`}>
                    <Link to={`${SeminarConfig.url}/detail/${val?.id}`}>
                      <SeminarComponent
                        title={val?.name}
                        date={formatDateFullDMY(val?.started_at)}
                        imageUrl={val?.cover?.url}
                      />
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-end text-end">
                <Link
                  to={SeminarConfig.url}
                  className="text-center text-blue-950 text-sm font-bold font-goth leading-[21px]"
                >
                  Lihat Detail
                </Link>
              </div>
            </Card>
          )}

          <Card className="border-none col-span-12 md:col-span-8 rounded-xl flex flex-col justify-between">
            <div className="h-[23rem]">
              <p className="text-blue-950 text-xl font-normal font-opificio mb-5">Persentase Tes Selesai</p>
              {progresData.map((progress, index) => (
                <div className="mb-5" key={index}>
                  <ProgressComponent title={progress.title} percent={progress.percent} />
                </div>
              ))}
            </div>
            <div className="flex justify-end items-end text-end">
              <Link
                to={StudentProgressConfig.url}
                className="text-center text-blue-950 text-sm font-bold font-goth leading-[21px]"
              >
                Lihat Detail
              </Link>
            </div>
          </Card>
          {authority.includes('activity_log') && (
            <Card className="border-none col-span-12 rounded-xl">
              <p className="text-blue-950 text-xl font-normal font-opificio mb-4">Log Aktifitas</p>
              <LogComponent data={log} isDashboard={true} />
              {/* menuju ke url /log-aktifitas */}
              <div className="flex justify-end items-end mt-6">
                <Link
                  to={LogConfig.url}
                  className="text-center text-blue-950 text-sm font-bold font-goth leading-[21px]"
                >
                  Lihat Detail
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
