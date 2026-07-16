/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import { apiShow, apiUpdate } from './api';
import { Button, Card, Dialog, Notification, Select, toast } from 'components/ui';
import dayjs from 'dayjs';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon, ExclamationTriangleIcon, FileIcon } from '@radix-ui/react-icons';
import StatusBadge from 'components/ui/StatusBadge';
import { STATUS_CERTIFICATION, STATUS_CERTIFICATION_TITLE, STATUS_USER_EXAM } from 'components/ui/utils/constant';

const Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [statusSert, setStatusSer] = useState();
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Hasil Sertifikasi', path: '/certification/result' },
    { label: `Detail Sertifikasi`, path: '' },
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

        const ress = await apiShow(id, params);
        if (firstReq.current) {
          await new Promise((resolve) => setTimeout(resolve, 0));
          firstReq.current = false;
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

  const onDialogClose = () => {
    setIsOpenDialog(false);
  };

  const onSubmit = async (body) => {
    try {
      await apiUpdate(id, body);
      toast.push(
        <Notification title="Sukses" type="success">
          Berhasil memperbarui data
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      getData();
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

  const onSubmitStatus = async () => {
    setIsLoadingStatus(true);
    let body = {
      status: statusSert,
    };
    await onSubmit(body);
    onDialogClose();
    setIsLoadingStatus(false);
  };

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
        <p className="text-h3 text-second-200 font-opificio">Detail Sertifikasi</p>
      </div>
      {location?.pathname?.includes('change-status') ? (
        <Card bodyClass="!p-6" className="border-none rounded-xl mb-7">
          <div className=" text-black text-xl font-normal font-opificio mb-5">Status Sertifikasi</div>
          <div className="mb-5">
            <p className="text-gray-800 font-bold leading-[21px] mb-2">
              Status <span className="text-red-600">*</span>
            </p>
            <Select
              defaultValue={STATUS_CERTIFICATION[1]}
              size="md"
              options={STATUS_CERTIFICATION}
              onChange={(option) => {
                setStatusSer(option?.value || '');
              }}
              value={STATUS_CERTIFICATION?.find((v) => v.value === statusSert)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={
                ![
                  STATUS_CERTIFICATION_TITLE.MENUNGGU,
                  STATUS_CERTIFICATION_TITLE.TIDAK_LULUS,
                  STATUS_CERTIFICATION_TITLE.LULUS,
                ].includes(statusSert)
              }
              // loading={isLoadingStatus}
              onClick={() => (statusSert === 7 ? onSubmitStatus() : setIsOpenDialog(true))}
              className="w-[200px] h-12 p-3 mb-2"
            >
              <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
            </Button>
          </div>
        </Card>
      ) : (
        <></>
      )}
      <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
        <Card className="border-none rounded-xl">
          <div className=" text-black text-xl font-normal font-opificio mb-6">Informasi Sertifikasi</div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Status Sertifikasi</span>
            <span>
              <StatusBadge
                text={localState.data?.status_label}
                color={localState.data?.status === 1 ? 'green' : localState.data?.status === 0 ? 'orange' : 'red'}
              />
            </span>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Tanggal dan Waktu Sertifikasi</span>
            <span>{localState.data?.cert_date ? dayjs(localState?.cert_date).format('D MMM YYYY') : '-'}</span>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Tipe Sertifikasi</span>
            <span>{localState.data?.certification?.name ?? '-'}</span>
          </div>

          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Alamat Lokasi Sertifikasi</span>
            <span>{localState.data?.location ?? '-'}</span>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Hasil Sertifikasi</span>
            <span>
              <a
                href={`${localState.data?.file?.url}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-row gap-2"
              >
                <FileIcon width={20} height={20} />
                Download
              </a>
            </span>
          </div>
        </Card>
      </AdaptableCard>
      <Dialog
        isOpen={isOpenDialog}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
        width={600}
        closable={false}
        className={'relative'}
      >
        <div className="flex flex-col p-4">
          <div className="flex justify-center">
            <ExclamationTriangleIcon height={64} width={64} color="#C63838" />
          </div>
          <div className="flex flex-col">
            <p className="text-h3 font-opificio text-black text-center mt-10">
              Lanjutkan progres siswa ke tahap wawancara?
            </p>
            <div className="flex justify-center mt-4">
              <p className="font-goth text-second-500 text-center">
                Status yang sudah di konfirmasi, tidak dapat dipulihkan. Pastikan siswa sudah mencapai target kelulusan
                minimum.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex justify-center gap-2">
              <Button variant="default" className="!py-0 h-10 w-[200px]" onClick={onDialogClose}>
                <div className="text-black font-normal">Tidak, Kembali</div>
              </Button>

              <Button
                loading={isLoadingStatus}
                variant="default"
                className="!py-0 h-10 w-[200px]"
                onClick={onSubmitStatus}
              >
                <div className="text-black font-normal">Ya, Konfirmasi</div>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Detail;
