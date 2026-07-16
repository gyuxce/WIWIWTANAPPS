import { Notification, Skeleton, toast } from 'components/ui';
import Card from 'components/ui/Card';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PageTable } from './table';
import { apiShow } from './api';
import { PageConfig } from './config';
import { useParams } from 'react-router-dom';
import { numberToRupiah } from 'components/ui/utils/formatter';
dayjs.extend(utc);

// AccordionItemDetail component definition
const AccordionItemDetail = ({ title, children, isActive, onItemClick }) => {
  return (
    <div className="mx-4 my-2 mt-4">
      <div
        className="flex items-center justify-between bg-white cursor-pointer border-b-[1px] border-b-second-600"
        onClick={onItemClick}
      >
        <span className="text-gray-800 text-xl font-normal font-['Opificio Neue'] mb-2">{title}</span>
        <svg
          className={`w-6 h-6 transition-transform transform ${isActive ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isActive && <div className="bg-white">{children}</div>}
    </div>
  );
};

// AccordionDetail component definition
const AccordionDetail = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  useEffect(() => {
    if (React.Children.count(children) > 0) {
      setActiveIndex(0);
    }
  }, [children]);

  return (
    <div className="w-full h-auto p-2 border border-gray-300 rounded-lg space-y-3">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isActive: index === activeIndex,
            onItemClick: () => handleItemClick(index),
          });
        }
        return null;
      })}
    </div>
  );
};

const TrainingDetail = () => {
  const { id } = useParams();
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [ids, setIds] = useState([]);
  const [checkboxList, setCheckboxList] = useState([]);
  const [localState, setLocalState] = useState({
    loading: false,
    data: [],
    meta: null,
    updated: null,
    params: {
      relations: [
        'transactionTraining.payments.paymentProof.file',
        'transactionTraining.payments.paymentDetail',
      ].join(),
    },
  });

  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          relations: 'user, transactionTraining.payments.paymentProof, transactionTraining.payments.paymentDetail',
        };
        const ress = await apiShow(id, params);
        setData(ress.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Panggil fungsi fetchData
  }, [id]);

  const getData = useCallback(
    async (params) => {
      try {
        setLocalState({
          ...localState,
          loading: true,
        });

        const ress = await apiShow(id, params);

        if (firstReq.current) {
          await new Promise((resolve) => setTimeout(resolve, 0));
          firstReq.current = false;
        }

        setLocalState({
          ...localState,
          loading: false,
          data: ress.data?.data?.transactionTraining?.payments || [],
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
    [localState, id],
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
    <div className="">
      <div className="rounded-2xl border-none bg-white">
        <Card className="border-none rounded-xl">
          <div className=" text-black text-xl font-normal font-opificio mb-6">Pelatihan</div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Status Pembayaran</span>
            <div className="">
              {data.transactionTraining != null
                ? (() => {
                    const color =
                      data.transaction2_status == 1
                        ? 'green'
                        : data.transaction2_status == 2
                        ? 'blue'
                        : data.transaction2_status == 3
                        ? 'red'
                        : 'orange';
                    return (
                      <span
                        className={`px-3 py-1 bg-${color}-50 rounded-full border border-${color}-500 text-${color}-500 text-xs font-normal font-goth`}
                      >
                        {data.transaction_status_training}
                      </span>
                    );
                  })()
                : '-'}
            </div>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Tanggal Pembayaran Pertama</span>
            <span>
              {data.transactionTraining?.payments.length > 1
                ? data?.transactionTraining?.payments[0]?.paymentProof?.created_at
                  ? dayjs.utc(data?.transactionTraining?.payments[0]?.paymentProof?.created_at).format('D MMM YYYY')
                  : '-'
                : data?.transactionTraining?.payments[0]?.paymentDetail?.paid_at
                ? dayjs(data?.transactionTraining?.payments[0]?.paymentDetail?.paid_at).format('D MMM YYYY')
                : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Program Pelatihan</span>
            <span>{data?.user?.training_program_label}</span>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Preferensi Latihan</span>
            <span>{data?.user?.training_preference_label}</span>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Metode Pembayaran</span>
            {data.transactionTraining != null
              ? (() => {
                  return (
                    <span>
                      {data.transactionTraining?.payments.length == 6 ? 'Cicilan Pribadi' : 'Pembayaran Lunas'}
                    </span>
                  );
                })()
              : '-'}
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Biaya Pelatihan</span>
            {data.transactionTraining != null
              ? (() => {
                  return <span>{numberToRupiah(data.transactionTraining?.total)}</span>;
                })()
              : '-'}
          </div>

          {data.transactionTraining?.payments.length == 1 ? (
            <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
              <span>Nomor Pembayaran</span>
              <span>{data.transactionTraining?.payments[0]?.paymentDetail?.number}</span>
            </div>
          ) : null}

          {data.transactionTraining?.payments.length > 1 ? (
            <div className="flex justify-between">
              <AccordionDetail>
                <AccordionItemDetail title="Cicilan">
                  <div className="mt-3">
                    <div className="mt-4">
                      {localState.loading && <Skeleton />}
                      {localState.data.length > 0 && (
                        <PageTable
                          localState={localState}
                          setLocalState={setLocalState}
                          getData={getData}
                          setIds={setIds}
                          bulk_ids={ids}
                          checkboxList={checkboxList}
                          onLoad={() => getData(localState.params)}
                        />
                      )}
                    </div>
                  </div>
                </AccordionItemDetail>
              </AccordionDetail>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
};

export default TrainingDetail;
