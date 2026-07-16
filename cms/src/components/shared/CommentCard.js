import React, { useState } from 'react';
import { ThumbSvg } from 'assets/svg';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Avatar, Button, Dropdown, Notification, toast } from 'components/ui';
import CommentDialog from './CommentDialog';
import EditCommentDialog from 'views/forum/components/EditCommentDialog';
import { apiDeleteComment } from 'views/forum/CommentList/api';
import DialogDeleteComment from 'views/forum/components/DialogDelete';

dayjs.extend(utc);
dayjs.extend(timezone);

const CommentCard = (props) => {
  const { data, parentData, onCommentAdded } = props;
  const [dialogIsOpen, setIsOpen] = useState(false);
  const [dialogCommentIsOpen, setIsOpenEditComment] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDialogEditComment = () => {
    setIsOpenEditComment(true);
  };

  const onDialogCloseEditComment = () => {
    setIsOpenEditComment(false);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = () => {
    setIsOpen(false);
  };

  const openDialogDeleteComment = () => {
    setDialogDeleteOpen(true);
  };

  const Toggle = (
    <Button variant="plain" className="flex justify-end w-full">
      ...
    </Button>
  );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await apiDeleteComment(data?.id);
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
      onCommentAdded();
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

  return (
    <div className="flex">
      <div className="flex">
        <div className="rounded-lg p-1 mt-5">
          <div className="mb-3">
            <Avatar src="/img/avatars/thumb-1.jpg" shape="circle" size={34} />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full rounded-lg p-1 mt-5">
          <div className=" w-full flex justify-between items-center">
            <p className="text-sm text-black mb-1 !font-bold">{data?.user?.name}</p>
            <div className="relative">
              {data?.is_own_by_user == true && (
                <Dropdown renderTitle={Toggle}>
                  <Dropdown.Item onClick={() => openDialogEditComment()} eventKey="a">
                    Edit Komentar
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => openDialogDeleteComment()} eventKey="b">
                    Hapus Komentar
                  </Dropdown.Item>
                </Dropdown>
              )}
              <EditCommentDialog
                isOpen={dialogCommentIsOpen}
                onClose={onDialogCloseEditComment}
                commentId={data?.id}
                parentId={data?.parent_id}
                onCommentAdded={onCommentAdded}
              />
              <DialogDeleteComment
                dialogIsOpen={dialogDeleteOpen}
                loading={isDeleting}
                onDialogClose={() => setDialogDeleteOpen(false)}
                onDialogOk={() => handleDelete()}
              />
            </div>
          </div>
          <p className="text-sm text-black">{data?.comment}</p>
          <div className="flex items-center mt-3">
            <div className="flex items-centers text-center mr-3">
              <div>
                <ThumbSvg />
              </div>
              <div className="text-black text-xs font-bold font-goth p-1">{data?.count_like}</div>
            </div>
            <button onClick={() => openDialog()} className="text-xs text-black font-bold mr-3">
              Balas
            </button>
            <CommentDialog
              isOpen={dialogIsOpen}
              onClose={onDialogClose}
              parentId={parentData?.id ? parentData.id : data?.id}
              data={data}
              onCommentAdded={onCommentAdded}
            />
            <span className="text-xs text-black">{dayjs(data?.updated_at).format('DD MMMM YYYY, HH:mm')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
