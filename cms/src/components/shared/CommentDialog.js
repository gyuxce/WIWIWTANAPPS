import { Button, Dialog, Input, Notification, toast } from 'components/ui';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiStoreComment } from 'views/forum/CommentList/api';

const CommentDialog = ({ isOpen, onClose, parentId = null, postId = null, data = null, onCommentAdded }) => {
  const { id } = useParams();

  CommentDialog.defaultProps = {
    onCommentAdded: () => {},
  };

  const [comment, setComment] = useState('');
  const onDialogOk = async (value) => {
    if (value) {
      var bodyData = {
        comment: value,
        parent_id: parentId,
        post_id: postId ?? id,
      };
      try {
        await apiStoreComment(bodyData);
        onClose();
        openNotification('Berhasil', 'success', 'Berhasil tambah komentar');
        setComment('');
        onCommentAdded();
      } catch (error) {
        openNotification('Error', 'danger', error?.message);
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
          <div className=" text-blue-950 text-xl font-normal font-opificio">Tambah Komentar</div>
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
              <div className="text-black font-normal">Tambah</div>
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CommentDialog;
