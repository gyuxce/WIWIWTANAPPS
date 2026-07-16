import { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import { apiIndex } from './api';
import { PageConfig } from './config';
import { PageTable } from './table';
import { Notification, toast } from 'components/ui';
import { apiGetConstants } from 'services/AppService';
import dayjs from 'dayjs';
import { Tools } from './tools';
import { useParams } from 'react-router-dom';

const Page = () => {
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const { id } = useParams();
  const [ids, setIds] = useState([]);
  const [type, setType] = useState([]);
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
      options: [`filter,user.uuid,equal,${id}`],
      relations: ['file', 'user'].join(),
    },
  });

  const getType = async () => {
    try {
      const ress = await apiGetConstants({ data: 'user_files_constant' });
      setType(ress.data || []);
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

  useEffect(() => {
    if (firstLoad.current) {
      getType();
      getData(localState.params);
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
    <div>
      <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
        <div className="text-black text-xl font-normal font-opificio mb-4">{PageConfig.pageTitle}</div>

        <div className="mb-[1.25rem]">
          <Tools
            id={id}
            localState={localState}
            setLocalState={setLocalState}
            getData={getData}
            deleteIds={ids}
            setIds={setIds}
            checkboxList={checkboxList}
            type={type}
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
