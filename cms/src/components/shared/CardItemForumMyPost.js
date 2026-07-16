import React, { useState, useEffect, useRef } from 'react';
import AdaptableCard from './AdaptableCard';
import { ChatBubbleSvg, ThumbSvg } from 'assets/svg';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Button, Dialog, Input, Notification, toast, Avatar } from 'components/ui';
import useForum from 'utils/hooks/useForum';
import CloseSvg from 'assets/svg/CloseSvg';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);

const CardItemForumMyPost = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data, onLoad } = props;
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (createdAt) => {
    dayjs.locale('id');
    const date = dayjs(createdAt).tz('Asia/Jakarta');

    if (date.isSame(dayjs().subtract(1, 'day'), 'day')) {
      return `kemarin di ${date.format('HH:mm')} WIB`;
    } else {
      return date.format('D MMMM YYYY [di] HH:mm WIB');
    }
  };

  const navigate = useNavigate();

  const editPost = (id) => {
    navigate('/forum/post/edit/' + id);
  };

  const deletePost = () => {
    openDialog();
  };

  const [deletedReason, setDeletedReason] = useState('');
  const [dialogIsOpen, setIsOpen] = useState(false);
  const { deleteForumPost } = useForum();

  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = () => {
    setIsOpen(false);
  };

  const onDialogOk = async (id, value) => {
    if (value) {
      var bodyData = {
        deleted_reason: value,
      };
      try {
        await deleteForumPost(id, bodyData);
        setIsOpen(false);
        openNotification('Berhasil', 'success', 'Berhasil Hapus data');
        setDeletedReason('');
        onLoad();
      } catch (error) {
        openNotification('Error', 'danger', error?.message);
      }
    } else {
      openNotification('Pemberitahuan', 'warning', 'Isi terlebih dahulu');
    }
  };

  const openNotification = (title, type, value) => {
    toast.push(
      <Notification title={title} type={type}>
        {value}
      </Notification>,
    );
  };

  return (
    <div>
      <AdaptableCard bodyClass="py-3 px-4 text-black relative" className="rounded-xl border-grey-300 mb-4">
        <div onClick={props.onClick} className="flex items-center mb-3">
          <Avatar src={data?.user?.profilePicture?.url} shape="circle" size={34} />
          <p className="text-sub-b ml-2">
            {data?.user.name} [{data?.user.role.name}]
          </p>
        </div>
        <p className="text-mobile-h3 font-bold">{data?.title}</p>
        <div className="flex mt-3 items-center">
          <div className="flex items-center">
            <ChatBubbleSvg />
            <p className="text-mobile-sub-b ml-1">{data?.count_comment || 0}</p>
          </div>
          <p className="text-mobile-sub text-grey-500 mx-3">{formatDate(data?.created_at)}</p>
          <div className="bg-grey-100 px-2 py-1 rounded">
            <p className="text-mobile-sub-b">{data?.topic?.name}</p>
          </div>
        </div>
        <div className="absolute top-3 right-4 flex">
          <div className="text-center mr-3">
            <div>
              <ThumbSvg />
            </div>
            <p className="text-mobile-sub-b mt-1">{data?.count_like || 0}</p>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="h-7 w-7 focus:outline-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M18 14a2 2 0 100-4 2 2 0 000 4zM12 14a2 2 0 100-4 2 2 0 000 4zM6 14a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => editPost(data?.id)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={deletePost}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </AdaptableCard>
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
        width={600}
        height={578}
        closable={false}
        className={'relative'}
      >
        <div className="absolute top-4 right-4">
          <Button
            onClick={onDialogClose}
            variant="plain"
            size="xs"
            icon={
              <>
                <CloseSvg />
              </>
            }
          />
        </div>
        <div className="flex flex-col p-4">
          <div className="flex justify-center">
            <img src="/img/icon/trash.png" alt="trash" className="h-[64px] w-[64px]" />
          </div>
          <div className="flex flex-col">
            <p className="text-h3 font-opificio text-black text-center mt-10">Anda akan menghapus data ini</p>
            <div className="flex justify-center mt-4">
              <p className="text-caption-b-goth text-second-500 text-center">
                Data yang sudah dihapus tidak dapat dipulihkan. Klik "Kembali” untuk memastikan kembali.
              </p>{' '}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-caption-b-goth text-black mt-10">Alasan menghapus</p>
            <div className="flex justify-center mt-2 mb-2">
              <Input
                placeholder="Ketik isi notifikasi"
                value={deletedReason}
                onChange={(e) => setDeletedReason(e.target.value)}
                maxLength={200}
                textArea
              />
            </div>
            <p className="text-caption-b-goth text-black">*maksimal 200 karakter</p>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex justify-center">
              <Button
                variant="default"
                className="!py-0 mr-2"
                style={{ height: '40px', width: '200px' }}
                onClick={onDialogClose}
              >
                <div className="text-black font-normal">Kembali</div>
              </Button>

              <Button
                variant="default"
                className="!py-0"
                style={{ height: '40px', width: '200px' }}
                onClick={() => onDialogOk(data.id, deletedReason)}
              >
                <div className="text-black font-normal">Hapus</div>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CardItemForumMyPost;
