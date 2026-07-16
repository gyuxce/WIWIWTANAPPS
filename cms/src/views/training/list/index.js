import { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import { apiGetCategory, apiGetModule, apiIndex } from './api';
import { apiGetConstants } from 'services/AppService';
import { PageConfig } from './config';
import { PageTable } from './table';
import { Notification, toast } from 'components/ui';
import dayjs from 'dayjs';
import { Tools } from './tools';
import { COURSE_GROUP } from 'components/ui/utils/constant';

const Page = () => {
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [ids, setIds] = useState([]);
  const [program, setProgram] = useState([]);
  const [category, setCategory] = useState([]);
  const [training, setTraining] = useState([]);
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
      options: ['filter,is_header,is_null', `filter,group,equal,${COURSE_GROUP.MATERIAL}`],
      relations: 'course,module',
    },
  });
  // const lastUpdateDate = dayjs('2023-08-19').format('D MMMM YYYY');

  const getProgram = async () => {
    try {
      const ress = await apiGetConstants({ data: 'training_program' });
      setProgram(ress.data || []);
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

  const getCategory = async () => {
    try {
      const ress = await apiGetCategory({ type: 'collection' });
      setCategory(ress.data?.data || []);
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

  const getModule = async () => {
    try {
      const ress = await apiGetModule({ type: 'collection', options: ['filter,is_header,is_not_null'] });
      setTraining(ress.data?.data || []);
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
          updated: ress.data?.last_updated ? dayjs(ress.data?.last_updated).format('DD MMMM YYYY, HH:mm') : '-',
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
      getCategory().then(() => {
        getData(localState.params);
        getProgram();
        getModule();
        firstLoad.current = false;
      });
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
      <div className="mb-7">
        <p className="text-h3 text-second-200 mb-1 font-opificio">{PageConfig.moduleTitle}</p>
        <div className="text-stone-700 text-xs font-normal font-goth">Pembaruan Terakhir : {localState.updated}</div>
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
            program={program}
            category={category}
            training={training}
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
