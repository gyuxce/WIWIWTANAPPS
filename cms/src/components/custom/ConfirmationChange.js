import { Button, Dialog } from 'components/ui';
import React from 'react';
import EditConfirmationSvg from './svg/EditConfirmationSvg';

function ConfirmationChange({
  isOpen,
  onClose,
  onOk,
  title = 'You Sure Want to do this?',
  message = 'you will rewrite 1 row of data',
}) {
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
        <div className="w-12 h-12 p-3 bg-indigo-100 rounded-[28px] border-4 border-blue-50 justify-center items-center flex">
          <div className="w-6 h-6 relative flex-col justify-start items-start flex">
            <EditConfirmationSvg />
          </div>
        </div>
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
          <div className="self-stretch text-gray-900 text-xl font-bold">{title}</div>
          <div className="self-stretch text-gray-700 text-sm font-medium leading-[21px]">{message}</div>
        </div>
      </div>
      <div className="pt-8">
        <div className="flex justify-between w-full">
          <Button className="block w-[48%]" onClick={onClose}>
            Cancel
          </Button>
          <Button className="block w-[48%]" variant="solid" onClick={onOk}>
            Yes, Do it
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmationChange;
