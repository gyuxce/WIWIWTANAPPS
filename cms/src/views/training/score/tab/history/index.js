import { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import { apiIndex } from './api';
import { PageConfig } from './config';
import { PageTable } from './table';
import { Notification, toast } from 'components/ui';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

const History = () => {
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const { id } = useParams();
  const [ids, setIds] = useState([]);
  const [checkboxList, setCheckboxList] = useState([]);
  const [user, setUser] = useState({
    name: '',
    urlProfile: '',
    module: '',
    category: '',
  });
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
      relations: ['user.profilePicture', 'item.module', 'course'].join(),
    },
  });

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

        if (ress?.data) {
          setUser({
            name: ress.data?.data[0]?.user?.name,
            urlProfile: ress.data?.data[0]?.user?.profilePic?.url,
            module: ress.data?.data[0]?.item?.module?.title,
            category: ress.data?.data[0]?.course?.title,
            item: ress.data?.data[0]?.item?.title,
          });
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
        <div className="mb-4 flex items-center content-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full bg-black">
            <img src="https://picsum.photos/200/300" className="w-[60px] h-[60px] object-cover rounded-full" alt="" />
          </div>
          <div>
            <p className="text-blue-950 text-xl font-normal font-opificio">{user?.name}</p>
            <div className="mt-2">
              {/* <span>Materi : {user?.module}</span> <br /> */}
              <span>Module : {user?.item}</span> <br />
              <span>Kategori Modul : {user?.category}</span>
            </div>
          </div>
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

export default History;
