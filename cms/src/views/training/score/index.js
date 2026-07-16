import { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import { apiIndex } from './api';
import { apiIndex as apiGetCategoryModules } from '../category/api';
import { apiIndex as apiGetTrainingModules } from '../module/api';
import { apiGetConstants } from 'services/AppService';
import { PageConfig } from './config';
import { PageTable } from './table';
import { Notification, toast } from 'components/ui';
import dayjs from 'dayjs';
import { Tools } from './tools';
import { apiGetExamTemplates } from 'views/test/character/api/api';

const Page = () => {
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [ids, setIds] = useState([]);
  const [program, setProgram] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [asessmentTypes, setAsesmentTypes] = useState([]);
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
      relations: ['userExam', 'item', 'course'].join(),
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

  const getCategoryModules = async () => {
    try {
      const ress = await apiGetCategoryModules({ type: 'collection' });
      setCategories(
        ress?.data?.data?.map((item) => ({
          label: item?.title,
          value: item?.id,
        })) || [],
      );
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

  const getTrainingModules = async () => {
    try {
      const ress = await apiGetTrainingModules({ type: 'collection', options: ['filter,is_header,is_not_null'] });
      setTrainings(
        ress?.data?.data?.map((item) => ({
          label: item?.title,
          value: item?.id,
        })) || [],
      );
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

  const getAsessementTypes = async () => {
    try {
      const ress = await apiGetExamTemplates({ type: 'collection', options: ['filter,type,equal,2'] });
      setAsesmentTypes(
        ress?.data?.data?.map((item) => ({
          label: item?.title,
          value: item?.id,
        })) || [],
      );
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

  const prepareDataFilters = async () => {
    await getProgram();
    await getCategoryModules();
    await getTrainingModules();
    await getAsessementTypes();
  };

  useEffect(() => {
    if (firstLoad.current) {
      prepareDataFilters().finally(() => {
        getData(localState.params);
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
        <p className="text-h3 text-second-200 font-opificio">{PageConfig.moduleTitle}</p>
        {/* <p className="text-h3 text-second-200 mb-1 font-opificio">{PageConfig.moduleTitle}</p>
        <div className="text-stone-700 text-xs font-normal font-goth">Pembaruan Terakhir : {lastUpdateDate}</div> */}
      </div>
      <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
        <div className="text-black text-xl font-normal font-opificio mb-4">{PageConfig.pageTitle}</div>

        <div className="mb-[1.25rem]">
          {!firstLoad?.current && (
            <Tools
              localState={localState}
              setLocalState={setLocalState}
              getData={getData}
              deleteIds={ids}
              setIds={setIds}
              program={program}
              categories={categories}
              trainings={trainings}
              asessmentTypes={asessmentTypes}
              checkboxList={checkboxList}
            />
          )}
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
