import { useCallback, useEffect, useRef, useState } from 'react';
import { apiExport, apiIndex } from './api';
import { PageConfig } from './config';
import { PageConfig as ModuleConfig } from '../../../config';
import { Tools } from './tools';
import { PageTable } from './table';
import { Notification, toast } from 'components/ui';
import { apiGetConstants } from 'services/AppService';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';
import { AdaptableCard } from 'components/shared';
import Breadcrumbs from 'components/ui/Breadcrumbs';

const Page = () => {
  const { id } = useParams();
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [ids, setIds] = useState([]);
  const [statusScheduleAssesmentVerbalConstant, setStatusScheduledAssesmentVerbalConstant] = useState([]);
  const [checkboxList, setCheckboxList] = useState([]);
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
      options: [],
      relations: ['user', 'item'].join(),
    },
  });
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: ModuleConfig.url },
    { label: 'Detail', path: ModuleConfig.detailModulelUrl + id },
    { label: 'Asesmen Lisan', path: '' },
  ];

  const getData = useCallback(
    async (params) => {
      try {
        setLocalState({
          ...localState,
          loading: true,
        });

        const ress = await apiIndex(params, id);
        if (firstReq.current) {
          await new Promise((resolve) => setTimeout(resolve, 0));
          firstReq.current = false;
        }

        if (ress.data?.meta?.current_page !== localState.meta?.current_page) {
          setIds([]);
        }

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

  const getStatusScheduledAssesmentVerbalConstant = async () => {
    try {
      const ress = await apiGetConstants({ data: 'status_scheduled_assesment_verbal' });
      setStatusScheduledAssesmentVerbalConstant(ress.data || []);
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

  const exportData = async (params) => {
    try {
      const ress = await apiExport(params);
      const blob = new Blob([ress.data], { type: 'application/vnd.ms-excel' });
      const blobUrl = window.URL.createObjectURL(blob);

      const formattedString = PageConfig?.pageTitle?.replace(/ /g, '_').toLowerCase();
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${formattedString}_${formattedDate}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
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
    if (firstLoad.current) {
      getData(localState.params);
      getStatusScheduledAssesmentVerbalConstant();
      firstLoad.current = false;
    }
  }, [getData, localState]);

  useEffect(() => {
    let x = [];

    for (let index = 0; index < PageConfig.listFields.length; index++) {
      const el = PageConfig.listFields[index];
      if (el.is_show) {
        x.push(el.key);
      }
    }
    setCheckboxList(x);
  }, []);

  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={'/training/module/detail/' + id}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">Tambah Jadwal</div>
        </div>
      </div>
      <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
        <div className="text-black text-xl font-normal font-opificio mb-4">{PageConfig.pageTitle}</div>

        <div className="mb-[1.25rem]">
          <Tools
            localState={localState}
            setLocalState={setLocalState}
            getData={getData}
            deleteIds={ids}
            setIds={setIds}
            statusScheduleAssesmentVerbalConstant={statusScheduleAssesmentVerbalConstant}
            exportData={exportData}
            checkboxList={checkboxList}
            id={id}
          />
        </div>

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

export default Page;
