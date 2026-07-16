import { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import { apiIndex } from '../api';
import { PageConfig } from '../config';
import { PageTable } from './table';
import { Notification, toast } from 'components/ui';
import dayjs from 'dayjs';
import { Tools } from './tools';

const DaftarWawancara = (props) => {
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [ids, setIds] = useState([]);
  const [checkboxList, setCheckboxList] = useState([]);
  const [interviewers, setInterviewrs] = useState([]);
  const [agencies, setAgencies] = useState([]);
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
      options: ['filter,user.uuid,equal,' + props.id],
      relations: ['user'].join(),
    },
  });

  const uniquer = (data) => {
    const uniqueUserIds = {};
    const uniqueData = data.filter((entry) => {
      const userId = entry.label;
      if (!uniqueUserIds[userId]) {
        uniqueUserIds[userId] = true;
        return true;
      }
      return false;
    });
    return uniqueData;
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

        const interviewers = ress.data?.data.map((v) => {
          return {
            value: v.name,
            label: v.name,
          };
        });

        const agencies = ress.data?.data.map((v) => {
          return {
            value: v.agency,
            label: v.agency,
          };
        });
        setAgencies(uniquer(agencies));
        setInterviewrs(uniquer(interviewers));
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
    <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
      <div className="text-black text-xl font-normal font-opificio mb-4">Daftar Wawancara</div>

      <div className="mb-[1.25rem]">
        <Tools
          id={props.id}
          localState={localState}
          setLocalState={setLocalState}
          getData={getData}
          deleteIds={ids}
          setIds={setIds}
          checkboxList={checkboxList}
          interviewers={interviewers}
          agencies={agencies}
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
  );
};

export default DaftarWawancara;
