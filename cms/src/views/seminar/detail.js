import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiDestroy, apiShow } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { toast, Notification, Button } from 'components/ui';
import { PageConfig } from './config';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import DialogDelete from 'components/custom/DialogDelete';
dayjs.extend(utc);

const Detail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: PageConfig.url },
    { label: 'Detail Seminar', path: '' },
  ];

  const getData = async () => {
    try {
      const ress = await apiShow(id, {
        relations: ['cover'].join(),
      });
      setDetail(ress?.data?.data);
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await apiDestroy(detail?.id);
      setIsDeleting(false);
      setDialogDeleteOpen(false);
      toast.push(
        <Notification title={'Sukses'} type="success" duration={2500}>
          Data berhasil dihapus
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      navigate(PageConfig.url);
    } catch (error) {
      setIsDeleting(false);
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
    if (id) {
      getData();
    } else {
      navigate('/');
    }
  }, [id]);

  return (
    <div className="px-7">
      <div className="router mb-5">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">Detail Seminar</div>
        </div>
      </div>
      <div className="flex flex-1 gap-5">
        <div className="flex-1">
          <Card bodyClass="!p-8" className="border-none rounded-xl">
            <div className="flex-col justify-start items-start gap-2 flex">
              <div className="text-blue-950 text-[28px]">{detail?.name}</div>
              <div className="justify-start items-center mb-5 flex">
                <div className="w-4 h-4 mr-1 relative">
                  <img src="/img/icon/calendar.svg" alt="" />
                </div>
                <div className="text-gray-600 text-sm font-normal font-goth leading-[21px] mt-1">
                  Tanggal & Waktu :&nbsp;
                  {detail?.started_at ? dayjs(detail?.started_at).format('DD MMMM YYYY - HH:mm') : ''}
                  &nbsp;WIB
                </div>
              </div>
            </div>
            <div className="self-stretch text-black" dangerouslySetInnerHTML={{ __html: detail?.description }} />
          </Card>
        </div>
        <div className="w-[340px]">
          <Card bodyClass="!p-6 flex-col justify-start items-start inline-flex" className="border-none rounded-xl">
            <div>
              <img
                className="w-full max-w-fit rounded-xl border border-black aspect-w-1 object-contain mb-6"
                src={detail?.cover?.url}
                alt=""
              />
            </div>
            <Button
              isAction
              type="button"
              onClick={(e) => {
                e.preventDefault();
                window.open(detail?.link, '_blank');
              }}
              className="w-full text-center text-black text-sm font-normal font-goth leading-[21px] mb-4"
            >
              Menuju Tautan
            </Button>
            <div className="w-full flex items-center justify-center gap-4 font-goth">
              <Button
                icon={<Pencil2Icon height={24} width={24} color="#262564" />}
                variant="plain"
                className="text-center text-black text-sm font-normal leading-[21px]"
                type="button"
                onClick={() => navigate(`${PageConfig.url}/edit/${detail?.id}`)}
              >
                Ubah
              </Button>
              <Button
                icon={<TrashIcon height={24} width={24} color="#C63838" />}
                variant="plain"
                className="text-center text-black text-sm font-normal leading-[21px]"
                type="button"
                onClick={() => setDialogDeleteOpen(true)}
              >
                Hapus
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <DialogDelete
        dialogIsOpen={dialogDeleteOpen}
        loading={isDeleting}
        onDialogClose={() => setDialogDeleteOpen(false)}
        onDialogOk={() => handleDelete()}
      />
    </div>
  );
};

export default Detail;
