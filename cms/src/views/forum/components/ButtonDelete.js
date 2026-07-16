import CloseSvg from 'assets/svg/CloseSvg';
import { Button, Dialog, Input, Notification, toast } from 'components/ui';
import { useState } from 'react';
import useForum from 'utils/hooks/useForum';

const ButtonDelete = (props) => {
  const { data, onLoad } = props;
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
      <Button
        variant="plain"
        onClick={() => openDialog()}
        size="xs"
        icon={<img src="/img/icon/trash.png" alt="trash" className="h-7 w-7" />}
      />

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
                onClick={() => onDialogOk(data, deletedReason)}
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

export default ButtonDelete;
