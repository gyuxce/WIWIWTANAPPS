import { Button, Dialog } from 'components/ui';
import React from 'react';

function DialogCustom({ dialogIsOpen, onDialogClose, onDialogOk }) {
  return (
    <Dialog
      isOpen={dialogIsOpen}
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <h5 className="mb-4">Delete</h5>
      <p>Are you sure you want to delete the data?</p>
      <div className="text-right mt-6">
        <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
          Cancel
        </Button>
        <Button variant="solid" onClick={onDialogOk}>
          Delete
        </Button>
      </div>
    </Dialog>
  );
}

export default DialogCustom;
