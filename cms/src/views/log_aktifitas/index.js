import React, { useCallback, useEffect, useRef, useState } from 'react';
import Card from 'components/ui/Card';
import DatePicker from 'components/ui/DatePicker';
import Pagination from 'components/ui/Pagination';
import { Notification, toast } from 'components/ui';
import { apiIndex } from './api';
import { PageConfig } from './config';
import LogComponent from 'views/dashboard/component/logComponent';
import dayjs from 'dayjs';
import Breadcrumbs from 'components/ui/Breadcrumbs';

const LogAktifitas = () => {
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [endDate, setEndDate] = useState('');
  const [localState, setLocalState] = useState({
    loading: false,
    data: [],
    meta: null,
    updated: null,
    params: {
      q: '',
      type: 'pagination',
      page: 1,
      limit: 5,
      order_by: 'group_date',
      sort_by: 'desc',
      options: [],
      detail: true,
    },
  });
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: '/dashboard' },
    { label: PageConfig.pageTitle, path: '' },
  ];

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

        setLocalState({
          ...localState,
          loading: false,
          data: ress.data?.data || [],
          meta: ress.data?.meta || null,
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

  const onPaginationChange = (page) => {
    getData({ ...localState.params, page: page });
  };

  const handleStartDate = (date) => {
    setStartDate(date);
    let params = { ...localState.params };
    if (date == null || date == '') {
      params.options = [];
      if (filterEndDate) {
        params.options.push(filterEndDate);
      }
      setFilterStartDate(null);
    } else {
      const filter = 'filter,created_at,greater_than,' + dayjs(date).format('YYYY-MM-DD');
      params.options = [];
      if (filterEndDate) {
        params.options.push(filterEndDate);
      }
      params.options.push(filter);
      setFilterStartDate(filter);
    }
    getData(params);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
    let params = { ...localState.params };
    if (date == null || date == '') {
      params.options = [];
      if (filterStartDate) {
        params.options.push(filterStartDate);
      }
      setFilterEndDate(null);
    } else {
      const filter = 'filter,created_at,less_then,' + dayjs(date).add(1, 'day').format('YYYY-MM-DD');
      params.options = [];
      if (filterStartDate) {
        params.options.push(filterStartDate);
      }
      params.options.push(filter);
      setFilterEndDate(filter);
    }
    getData(params);
  };

  useEffect(() => {
    if (firstLoad.current) {
      getData(localState.params);
      firstLoad.current = false;
    }
  }, [getData, localState]);

  return (
    <div className="px-7">
      <Card className="border-none rounded-xl">
        <div className="router mb-3">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex justify-start items-center">
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6 mb-1" />
            <div className="text-blue-950 text-xl font-normal font-opificio">{PageConfig.pageTitle}</div>
          </div>
        </div>

        <div className="form-filter grid grid-cols-12 mt-3 gap-3">
          <div className="col-span-6">
            <p className="text-black text-sm font-normal font-goth leading-[21px] mb-2">Tanggal Awal</p>
            <DatePicker
              placeholder="Pilih Tanggal"
              inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
              onChange={(value) => handleStartDate(value || '')}
              maxDate={endDate !== '' ? dayjs(endDate).startOf('day').toDate() : null}
            />
          </div>
          <div className="col-span-6">
            <p className="text-black text-sm font-normal font-goth leading-[21px] mb-2">Tanggal Akhir</p>
            <DatePicker
              inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
              placeholder="Pilih Tanggal"
              onChange={(value) => handleEndDate(value || '')}
              minDate={startDate !== '' ? dayjs(startDate).startOf('day').toDate() : null}
            />
          </div>
        </div>

        <div className="mt-3">
          <LogComponent data={localState?.data} />
        </div>
        <div className="mb-5 w-full flex items-center justify-center">
          <Pagination
            className="text-blue-950 text-xs font-normal"
            pageSize={localState?.meta?.per_page}
            currentPage={localState?.meta?.current_page}
            total={localState?.meta?.total}
            onChange={onPaginationChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default LogAktifitas;
