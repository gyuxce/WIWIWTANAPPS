import { Button, Dialog, Input, Notification, toast } from 'components/ui';
import { useEffect, useState } from 'react';
import { apiGetComment, apiUpdateComment } from 'views/forum/CommentList/api';

const EditCommentDialog = ({ isOpen, onClose, parentId = null, commentId = null, data = null, onCommentAdded }) => {
  const [editData, setEditData] = useState();
  const [comment, setComment] = useState('');

  EditCommentDialog.defaultProps = {
    onCommentAdded: () => {},
  };

  const fetchData = async () => {
    try {
      const ress = await apiGetComment(commentId, { relations: ['post', 'parent'].join() });
      setEditData(ress.data?.data);
      setComment(ress.data?.data?.comment);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      setComment('');
      onClose();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDialogOk = async (value) => {
    if (value) {
      var bodyData = {
        comment: value,
        post_id: editData?.post?.id,
        parent_id: parentId ? editData?.parent?.id : null,
      };
      try {
        await apiUpdateComment(commentId, bodyData);
        onClose();
        openNotification('Berhasil', 'success', 'Berhasil tambah komentar');
        setComment('');
        onCommentAdded();
      } catch (error) {
        openNotification('Error', 'danger', error?.response?.data?.message);
      }
    } else {
      openNotification('Pemberitahuan', 'warning', 'Isi komentar terlebih dahulu');
    }
  };

  useEffect(() => {
    const username = data?.user?.name;
    if (username) {
      setComment(`[@${username}] `);
    } else {
      setComment('');
    }
  }, [data?.user?.name]);

  const openNotification = (title, type, value) => {
    toast.push(
      <Notification title={title} type={type}>
        {value}
      </Notification>,
    );
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} onRequestClose={onClose} closable={false} className={'relative'}>
      <div className="flex flex-col p-1">
        <div className="mb-1 flex items-center justify-between">
          <div className=" text-blue-950 text-xl font-normal font-opificio">Edit Komentar</div>
          <img src="/img/icon/icon-radix.svg" alt="" onClick={onClose} />
        </div>
        <div className="flex flex-col">
          <p className="text-caption-b-goth font-goth text-black mt-4">Input Komentar</p>

          <div className="flex justify-center mt-2 mb-2">
            <Input
              placeholder="Ketik isi komentar"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={200}
              textArea
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="flex justify-center">
            <Button
              variant="default"
              className="!py-0 mr-2"
              style={{ height: '40px', width: '200px' }}
              onClick={onClose}
            >
              <div className="text-black font-normal">Kembali</div>
            </Button>

            <Button
              variant="default"
              className="!py-0"
              style={{ height: '40px', width: '200px' }}
              onClick={() => onDialogOk(comment)}
            >
              <div className="text-black font-normal">Edit</div>
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditCommentDialog;
