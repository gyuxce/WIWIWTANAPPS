import CloseSvg from 'assets/svg/CloseSvg';
import { Button, Dialog, Input, Notification, toast } from 'components/ui';
import { useState } from 'react';
import { apiUpdatePaymentProof } from '../AdministrationDetail/api';

const ApproveButton = (props) => {
  const { data, onLoad } = props;
  const [amountInstallment, setAmountInstallment] = useState('');
  const [dialogIsOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = () => {
    setIsOpen(false);
  };

  const onDialogOk = async (id, value) => {
    if (value) {
      var bodyData = {
        total_amount_approved: value,
        status: 2,
      };
      try {
        await apiUpdatePaymentProof(id, bodyData);
        setIsOpen(false);
        openNotification('Berhasil', 'success', 'Berhasil update data');
        setAmountInstallment('');
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
        className="block h-8 justify-center items-center gap-2 !text-blue-950 !border !border-blue-950 !rounded-md"
      >
        Setujui
      </Button>
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
        width={600}
        height={440}
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
            <img src="/img/icon/icon-radix.png" alt="trash" className="h-[64px] w-[64px]" />
          </div>
          <div className="flex flex-col">
            <p className="text-h3 font-opificio text-black text-center mt-10">Konfirmasi Pembayaran</p>
            <div className="flex justify-center mt-4">
              <p className="text-caption-b-goth text-second-500 text-center">Anda akan menyetujui pembayaran Cicilan</p>{' '}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-caption-b-goth text-black mt-10">Cicilan Terbayar</p>
            <div className="flex justify-center mt-2 mb-2">
              <Input
                placeholder="Ketik nominal cicilan terbayar "
                value={amountInstallment}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '');
                  const formattedValue = Number(numericValue).toLocaleString('id-ID');
                  setAmountInstallment(formattedValue);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex justify-center">
              <Button
                variant="default"
                className="!py-0 mr-2"
                style={{ height: '40px', width: '200px' }}
                onClick={onDialogClose}
              >
                <div className="text-black font-normal">Batalkan</div>
              </Button>

              <Button
                variant="default"
                className="!py-0"
                style={{ height: '40px', width: '200px' }}
                onClick={() => {
                  if (amountInstallment === '' || amountInstallment.replace(/\D/g, '') < 1) {
                    openNotification('Pemberitahuan', 'warning', 'Nominal tidak boleh kosong');
                  } else {
                    onDialogOk(data, amountInstallment.replace(/\D/g, ''));
                  }
                }}
              >
                <div className="text-black font-normal">Konfirmasi</div>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ApproveButton;
