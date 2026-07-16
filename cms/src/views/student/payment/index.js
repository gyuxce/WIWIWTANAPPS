import { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import { apiExport, apiIndex } from './api';
import { PageConfig } from './config';
import { Tools } from './tools';
import { PageTable } from './table';
import { Notification, toast } from 'components/ui';
import { apiGetRole } from 'services/AppService';
import dayjs from 'dayjs';

const Page = () => {
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [ids, setIds] = useState([]);
  const [role, setRole] = useState([]);
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
      relations: ['role'].join(),
    },
  });

  const getData = useCallback(
    async (params) => {
      try {
        setLocalState({
          ...localState,
          loading: true,
        });

        const ress = await apiIndex(params);

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

  const getRole = async () => {
    try {
      const ress = await apiGetRole({ type: 'collection' });
      setRole(ress.data?.data || []);
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
      getRole();
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
      <h1 className="mb-6 text-3xl text-main-400">{PageConfig.moduleTitle}</h1>
      <AdaptableCard className="rounded-2xl border-none">
        <h1 className="mb-1 text-xl text-main-100 font-bold">{PageConfig.pageTitle}</h1>
        <div className="mb-4 text-xs text-grey-100">
          Last Updated {localState.updated ? dayjs(localState?.updated).format('DD MMM YYYY') : ''}
        </div>
        <div className="mb-[1.25rem]">
          <Tools
            localState={localState}
            setLocalState={setLocalState}
            getData={getData}
            deleteIds={ids}
            setIds={setIds}
            role={role}
            exportData={exportData}
            checkboxList={checkboxList}
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
