import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiDestroy, apiShow, apiWarnReport } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { toast, Notification, Button, Avatar, Dialog, Input } from 'components/ui';
import { PageConfig } from './config';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { TrashIcon } from '@radix-ui/react-icons';
import DialogDelete from 'components/custom/DialogDelete';
import DetailOnPost from 'components/ui/DetailOnPost';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { ThumbSvg } from 'assets/svg';

require('dayjs/locale/id');
dayjs.extend(utc);
dayjs.locale('id');

const Detail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [content, setContent] = useState();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertModal, setAlertModal] = useState({ isShow: false, type: '' });
  const [notificationText, setNotificationText] = useState('');
  const [submitNotification, setSubmitNotification] = useState(false);

  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: '/forum' },
    { label: 'Detail', path: '' },
  ];

  const getData = async () => {
    try {
      const ress = await apiShow(id, {
        relations: [
          'user.profilePicture',
          'post.user.profilePicture',
          'post.topic',
          'comment.post.user.profilePicture',
          'comment.post.topic',
          'comment.user.profilePicture',
          'post.reports',
          'comment.reports',
        ].join(),
      });
      const text = JSON.parse(
        JSON.parse(ress?.data?.data?.post?.description || ress?.data?.data?.comment?.post?.description),
      );
      const converter = new QuillDeltaToHtmlConverter(text?.ops, {
        inlineStyles: true,
      });
      let convertedHtml = converter.convert();
      convertedHtml = convertedHtml
        .replace(/<ol>/g, '<ol class="list-decimal">')
        .replace(/<ul>/g, '<ul class="list-disc">');
      setContent(convertedHtml);
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

  const handleSubmit = async () => {
    try {
      await apiWarnReport({ id: id, notif_message: notificationText });
      setSubmitNotification(false);
      setAlertModal(false);
      toast.push(
        <Notification title={'Sukses'} type="success" duration={2500}>
          Notifikasi berhasil dikirim
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      navigate(PageConfig.url);
    } catch (error) {
      setSubmitNotification(false);
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
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to="/forum?page=reportlist">
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">Detail Laporan</div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8">
          {detail?.post && (
            <Card bodyClass="!p-8" className="border-none rounded-xl">
              <div className="flex-col justify-start items-start flex">
                <div className="text-blue-950 text-[28px]">{detail?.post?.title || detail?.comment?.post?.title}</div>
                <div className="flex items-center my-4">
                  <Avatar
                    src={detail?.comment?.post?.user?.profilePicture?.url || detail?.post?.user?.profilePicture?.url}
                    shape="circle"
                    size={34}
                  />
                  <p className="text-sub-b ml-2">{detail?.comment?.post?.user?.name || detail?.post?.user?.name}</p>
                </div>
                <div className="flex justify-start mb-5">
                  <DetailOnPost
                    countLike={detail?.post?.count_like || detail?.comment?.post?.count_like}
                    countComment={detail?.post?.count_comment || detail?.comment?.post?.count_comment}
                    date={detail?.post?.created_at || detail?.comment?.post?.created_at}
                    topics={detail?.post?.topic?.name || detail?.comment?.post?.topic?.name}
                  />
                </div>
              </div>
              <div className="self-stretch" dangerouslySetInnerHTML={{ __html: content }} />
            </Card>
          )}
          {detail?.comment && (
            <Card bodyClass="!p-8" className="border-none rounded-xl">
              <div className="flex-col justify-start items-start flex">
                <div className="text-blue-950 text-[28px]">Komentar</div>
                <div className="flex justify-start mt-3 w-full">
                  <Card bodyClass="!p-0" className="border-red-300 border-1 rounded-lg w-full">
                    <div className="flex p-2 w-full">
                      <div className="flex">
                        <div className="rounded-lg p-1 mt-1">
                          <div className="mb-3">
                            <Avatar src="/img/avatars/thumb-1.jpg" shape="circle" size={34} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="rounded-lg p-1 mt-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-black mb-1 !font-bold">
                              {detail?.comment?.user?.name}
                            </p>
                          </div>
                          <p className="text-sm text-black">{detail?.comment?.comment}</p>
                          <div className="flex items-center mt-2">
                            <div className="flex items-centers text-center mr-2">
                              <div>
                                <ThumbSvg />
                              </div>
                              <div className="text-black text-xs font-bold font-goth p-1">
                                {detail?.comment?.count_like}
                              </div>
                            </div>
                            <span className="text-xs text-black">
                              {dayjs(detail?.comment?.updated_at).format('DD MMMM YYYY, HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          )}
        </div>
        <div className="col-span-4">
          <Card bodyClass="!p-6 flex-col justify-start items-start flex" className="border-none rounded-xl">
            <div className="flex-col justify-start items-start flex mb-4">
              <div className="text-blue-950 text-[28px] mb-1">Perihal Laporan</div>
              {console?.log('data', detail?.post)}
              <div className="text-zinc-500 text-xs font-normal font-goth">
                Total Laporan: {detail?.post?.reports?.length || detail?.comment?.reports?.length || 0}
              </div>
            </div>
            <div className="overflow-x-auto max-h-[353px] w-full">
              {detail?.post?.reports?.length > 0 &&
                detail?.post?.reports?.map((item, index) => {
                  return (
                    <div key={index} className="border-b-[1px] border-gray-400 w-full pb-2 mb-5">
                      <div className="text-xs font-black">
                        Pada tanggal {dayjs(item?.created_at).format('DD MMMM YYYY')}, kami menerima laporan terkait{' '}
                        {item?.type_label} dengan catatan sebagai berikut "{item?.notes}". Laporan ini dibuat sebagai
                        respons terhadap pelanggaran terhadap kebijakan komunikasi.{' '}
                      </div>
                      <div className="text-gray-400">{dayjs(item?.created_at).format('DD[/]MM[/]YYYY HH:mm')}</div>
                    </div>
                  );
                })}
              {detail?.comment?.reports?.length > 0 &&
                detail?.comment?.reports?.map((item, index) => {
                  return (
                    <div key={index} className="border-b-[1px] border-gray-400 w-full pb-2 mb-5">
                      <div className="text-xs font-black">
                        Pada tanggal {dayjs(item?.created_at).format('DD MMMM YYYY')}, kami menerima laporan terkait{' '}
                        {item?.type_label} dengan catatan sebagai berikut "{item?.notes}". Laporan ini dibuat sebagai
                        respons terhadap pelanggaran terhadap kebijakan komunikasi.{' '}
                      </div>
                      <div className="text-gray-400">{dayjs(item?.created_at).format('DD[/]MM[/]YYYY HH:mm')}</div>
                    </div>
                  );
                })}
            </div>

            <div className="w-full flex items-center justify-center gap-2 font-goth mt-5">
              <Button
                icon={<img src="/img/icon/icon-speaker.svg" height={24} width={24} alt="" />}
                className="flex-1 text-center text-black text-sm font-normal leading-[21px]"
                type="button"
                onClick={() => {
                  setAlertModal({ isShow: !alertModal?.isShow, type: 'alert' });
                }}
              >
                Peringatkan
              </Button>
              <Button
                icon={<TrashIcon height={24} width={24} color="#C63838" />}
                className="flex-1 text-center text-black text-sm font-normal leading-[21px]"
                type="button"
                onClick={() => {
                  setAlertModal({ isShow: !alertModal?.isShow, type: 'delete' });
                }}
              >
                Hapus
              </Button>
            </div>
            {detail?.comment && (
              <div className="w-full flex items-center justify-center gap-2 font-goth mt-8">
                <Link
                  to={`/forum/detail/${detail?.comment?.post?.id}`}
                  className="font-semibold cursor-pointer p-2 px-3 text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-200 dark:hover:text-white"
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    lineHeight: '12px',
                    letterSpacing: '0em',
                    textAlign: 'center',
                  }}
                >
                  Lihat Artikel
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
      <DialogDelete
        dialogIsOpen={dialogDeleteOpen}
        loading={isDeleting}
        onDialogClose={() => setDialogDeleteOpen(false)}
        onDialogOk={() => handleDelete()}
      />
      <Dialog
        isOpen={alertModal?.isShow}
        onClose={() => {
          setAlertModal({ ...alertModal, isShow: !alertModal?.isShow });
        }}
        closable={false}
      >
        <div className="mb-1 flex items-center justify-between">
          <div className=" text-blue-950 text-xl font-normal font-opificio">Input Notifikasi</div>
          <img
            src="/img/icon/icon-radix.svg"
            alt=""
            onClick={() => {
              setAlertModal({ ...alertModal, isShow: !alertModal?.isShow });
            }}
          />
        </div>
        <div className=" text-blue-950 text-sm font-normal font-opificio mb-2">
          Silahkan isi pesan notifikasi yang akan Anda kirim kepada siswa
        </div>
        <div className="justify-start items-center gap-0.5 inline-flex mb-2">
          <div className="text-black text-sm font-normal font-goth leading-[21px]">
            {alertModal?.type === 'alert' ? 'Isi Notifikasi' : 'Alasan menghapus'}
          </div>
          <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
        </div>
        <Input
          value={notificationText}
          placeholder="Ketik isi notifikasi"
          textArea
          onChange={(text) => {
            setNotificationText(text?.target?.value);
          }}
        />
        <div className="text-black text-sm font-normal font-goth leading-[21px]">*maksimal 200 karakter</div>
        <Button
          type="button"
          loading={submitNotification}
          disabled={notificationText?.length < 1}
          onClick={() => {
            setSubmitNotification(true);
            handleSubmit();
          }}
          style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
          className="w-full h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex mt-5"
        >
          <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">Konfirmasi</div>
        </Button>
      </Dialog>
    </div>
  );
};

export default Detail;
