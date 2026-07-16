import { Button, Dialog } from 'components/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleSvg from './svg/CheckCircleSvg';

function ConfirmationSave({
  isOpen,
  onClose,
  redirectTo,
  title = 'Data Saved',
  message = 'You have succesfully added 1 new row data'
}) {
  const navigate = useNavigate()

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      closable={false}
      contentClassName="w-[544px] p-6 bg-white"
    >
      <div className="justify-start items-start gap-4 inline-flex">
        <div className="w-12 h-12 p-3 bg-emerald-100 rounded-[28px] border-4 border-emerald-50 justify-center items-center flex">
          <div className="w-6 h-6 relative flex-col justify-start items-start flex"><CheckCircleSvg /></div>
        </div>
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
          <div className="self-stretch text-gray-900 text-xl font-bold">{title}</div>
          <div className="self-stretch text-gray-700 text-sm font-medium leading-[21px]">{message}</div>
        </div>
      </div>
      <div className="pt-8">
        <Button className="block w-full" variant="solid" onClick={() => { navigate(redirectTo) }}>
          Confirm
        </Button>
      </div>
    </Dialog>
  );
}

export default ConfirmationSave;
