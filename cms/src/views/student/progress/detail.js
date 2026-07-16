import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiShow } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { toast, Notification } from 'components/ui';
import { PageConfig } from './config';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { countProgress } from 'components/ui/utils/formatter';
import Breadcrumbs from 'components/ui/Breadcrumbs';
dayjs.extend(utc);

const Detail = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: PageConfig.url },
    { label: 'Detail Siswa', path: '' },
  ];

  const getData = async () => {
    try {
      const ress = await apiShow(id);
      setData(ress?.data?.data);
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
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{data?.name}</div>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="bg-white rounded-lg border border-none justify-start items-start">
          <AccordionCustome>
            <AccordionItemCustome
              containerClass="p-0 m-0"
              headerClass="p-3 !text-14"
              title="Fase Pra Tes"
              progress={countProgress([
                data?.pratest?.test_language,
                data?.pratest?.test_character,
                data?.pratest?.test_qna,
              ])}
            >
              <div className="p-7 flex-col justify-start items-start gap-4 inline-flex text-black text-sm font-normal font-goth">
                <div className="leading-[21px]">Tes Bakat Bahasa - {data?.pratest?.test_language || 0}%</div>
                <div className="leading-[21px]">Tes Karakter - {data?.pratest?.test_character || 0}%</div>
                <div className="leading-[21px]">Sesi Tanya Jawab - {data?.pratest?.test_qna || 0}%</div>
              </div>
            </AccordionItemCustome>
          </AccordionCustome>
        </div>
        <div className="bg-white rounded-lg border border-none justify-start items-start">
          <AccordionCustome>
            <AccordionItemCustome
              containerClass="p-0 m-0"
              headerClass="p-3 !text-14"
              title="Fase Pembayaran"
              progress={countProgress([data?.transaction?.payment_admin, data?.transaction?.payment_training])}
            >
              <div className="p-7 flex-col justify-start items-start gap-4 inline-flex text-black text-sm font-normal font-goth">
                <div className="leading-[21px]">Pembayaran Administrasi - {data?.transaction?.payment_admin || 0}%</div>
                <div className="leading-[21px]">Pembayaran Pelatihan - {data?.transaction?.payment_training || 0}%</div>
              </div>
            </AccordionItemCustome>
          </AccordionCustome>
        </div>
        <div className="bg-white rounded-lg border border-none justify-start items-start">
          <AccordionCustome>
            <AccordionItemCustome
              containerClass="p-0 m-0"
              headerClass="p-3 !text-14"
              title="Fase Pelatihan"
              progress={countProgress([
                data?.courses?.[0]?.percent,
                data?.courses?.[1]?.percent,
                data?.courses?.[2]?.percent,
              ])}
            >
              <div className="p-7 flex-col justify-start items-start gap-4 inline-flex text-black text-sm font-normal font-goth">
                <div className="leading-[21px]">Teori Bahasa Jepang - {data?.courses?.[0]?.percent || 0}%</div>
                <div className="leading-[21px]">Praktikal Bahasa Jepang - {data?.courses?.[1]?.percent || 0}%</div>
                <div className="leading-[21px]">Soft Skill - {data?.courses?.[2]?.percent || 0}%</div>
              </div>
            </AccordionItemCustome>
          </AccordionCustome>
        </div>
        <div className="bg-white rounded-lg border border-none justify-start items-start">
          <AccordionCustome>
            <AccordionItemCustome
              containerClass="p-0 m-0"
              headerClass="p-3 !text-14"
              title="Fase Sertifikasi Bahasa Jepang"
              progress={countProgress([data?.certifications?.payment_admin, data?.certifications?.payment_training])}
            >
              <div className="p-7 flex-col justify-start items-start gap-4 inline-flex text-black text-sm font-normal font-goth">
                <div className="leading-[21px]">Tes Pertama - 0%</div>
                <div className="leading-[21px]">Tes Kedua - 0%</div>
              </div>
            </AccordionItemCustome>
          </AccordionCustome>
        </div>
        <div className="bg-white rounded-lg border border-none justify-start items-start">
          <AccordionCustome>
            <AccordionItemCustome
              containerClass="p-0 m-0"
              headerClass="p-3 !text-14"
              title="Fase Wawancara Final"
              progress={data?.interview_percent || '0'}
            >
              <div className="p-7 flex-col justify-start items-start gap-5 inline-flex text-black text-sm font-normal font-goth">
                <div className="leading-[21px]">Wawancara Final - {data?.interview_percent}%</div>
              </div>
            </AccordionItemCustome>
          </AccordionCustome>
        </div>
      </div>
    </div>
  );
};

export default Detail;
