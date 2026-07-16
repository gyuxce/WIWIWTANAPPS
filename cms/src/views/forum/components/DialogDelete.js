import { Button, Dialog } from 'components/ui';
import { TrashIcon } from '@radix-ui/react-icons';
import React from 'react';

function DialogDeleteComment({ dialogIsOpen, loading, onDialogClose, onDialogOk }) {
  return (
    <Dialog
      isOpen={dialogIsOpen}
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      width={600}
      className={'relative'}
    >
      <div className="flex flex-col p-4">
        <div className="flex justify-center">
          <TrashIcon height={64} width={64} color="#C63838" />
        </div>
        <div className="flex flex-col">
          <p className="text-h3 font-opificio text-black text-center mt-10">Anda akan menghapus komentar ini</p>
          <div className="flex justify-center mt-4">
            <p className="font-goth text-[#78716C] text-center">
              Anda akan menghapus komentar, yakin ingin melanjutkan?
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="flex justify-center gap-2">
            <Button variant="default" className="!py-0 h-10 w-[200px]" onClick={onDialogClose}>
              <div className="font-goth text-black font-normal">Kembali</div>
            </Button>

            <Button loading={loading} variant="default" className="!py-0 h-10 w-[200px]" onClick={onDialogOk}>
              <div className="font-goth text-black font-normal">Hapus</div>
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default DialogDeleteComment;
