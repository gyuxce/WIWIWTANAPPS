/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import { apiIndex } from './api';
import { apiIndex as apiIndexCert } from 'views/certification/api';

import { PageConfig } from './config';
import { PageTable } from './table_detail';
import { Button, Notification, toast } from 'components/ui';
import dayjs from 'dayjs';
import { Tools } from './tools_detail';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

const Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [ids, setIds] = useState([]);
  const [typeCertification, setTypeCertification] = useState([]);
  const [checkboxList, setCheckboxList] = useState([]);
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Sertifikasi Siswa', path: '/certification/result' },
    { label: `Hasil Sertifikasi`, path: '' },
    // Add more breadcrumb items as needed
  ];

  const [localState, setLocalState] = useState({
    loading: false,
    data: [],
    meta: null,
    updated: null,
    params: {
      q: '',
      type: 'pagination',
      page: 1,
      limit: 10,
      order_by: 'updated_at',
      sort_by: 'desc',
      options: [`filter,user.uuid,in,${id}`],
      relations: ['certification', 'user', 'file'].join(),
    },
  });

  const getData = useCallback(
    async (params) => {
      try {
        setLocalState({
          ...localState,
          loading: true,
          options: [`filter,user.uuid,in,${id}`],
        });

        const ress = await apiIndex(params);
        const ressTypeCert = await apiIndexCert({
          type: 'collection',
        });
        if (firstReq.current) {
          await new Promise((resolve) => setTimeout(resolve, 0));
          firstReq.current = false;
        }

        if (ress.data?.meta?.current_page !== localState.meta?.current_page) {
          setIds([]);
        }

        const resultTypeCert = ressTypeCert?.data?.data
          .filter((v) => v.status === 1)
          .map((v) => {
            return {
              value: v.name,
              label: v.name,
            };
          });

        setTypeCertification(resultTypeCert);
        setLocalState({
          ...localState,
          loading: false,
          data: ress.data?.data || [],
          meta: ress.data?.meta || null,
          updated: ress.data?.last_updated ? dayjs(ress.data?.last_updated).toDate() : null,
          params: params,
        });
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
    },
    [localState],
  );

  useEffect(() => {
    if (firstLoad.current) {
      getData(localState.params);
      firstLoad.current = false;
    }
  }, [getData, localState, typeCertification]);

  useEffect(() => {
    let x = [];

    for (let index = 0; index < PageConfig.listFieldsDetail.length; index++) {
      const el = PageConfig.listFieldsDetail[index];
      if (el.is_show) {
        x.push(el.key);
      }
    }
    setCheckboxList(x);
  }, []);
  return (
    <div className="px-7">
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
        <p className="text-h3 text-second-200 font-opificio">{localState.data[0]?.user?.name}</p>
      </div>

      <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
        <div className="text-black text-xl font-normal font-opificio mb-4">{PageConfig.pageTitle}</div>
        {typeCertification.length > 0 && (
          <div className="mb-[1.25rem]">
            <Tools
              localState={localState}
              setLocalState={setLocalState}
              getData={getData}
              deleteIds={ids}
              setIds={setIds}
              checkboxList={checkboxList}
              typeCertification={typeCertification}
            />
          </div>
        )}

        <PageTable
          localState={localState}
          setLocalState={setLocalState}
          getData={getData}
          setIds={setIds}
          bulk_ids={ids}
          checkboxList={checkboxList}
        />
      </AdaptableCard>
    </div>
  );
};

export default Detail;
