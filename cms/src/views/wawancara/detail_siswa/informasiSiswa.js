import { useState } from 'react';
import { AdaptableCard } from 'components/shared';
import { apiUpdateStatus } from '../api';
import { Button, Card, Dialog, Notification, Select, toast } from 'components/ui';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import StatusBadge from 'components/ui/StatusBadge';
import { STATUS_CERTIFICATION, STATUS_CERTIFICATION_TITLE } from 'components/ui/utils/constant';

const InformasiSiswa = (props) => {
  const data = props.data;
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [statusSert, setStatusSer] = useState();
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const onDialogClose = () => {
    setIsOpenDialog(false);
  };

  const onSubmit = async () => {
    const dataBody = { name: data.name, interview_status: statusSert };
    try {
      await apiUpdateStatus(props.data.id, dataBody);
      toast.push(
        <Notification title="Sukses" type="success">
          Berhasil memperbarui data
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    } catch (error) {
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

  const onSubmitStatus = async () => {
    setIsLoadingStatus(true);
    let body = {
      status: statusSert,
    };
    await onSubmit(body);
    onDialogClose();
    setIsLoadingStatus(false);
  };

  return (
    <div>
      <Card bodyClass="!p-6" className="border-none rounded-xl mb-7">
        <div className=" text-black text-xl font-normal font-opificio mb-5">Status Wawancara</div>
        <div className="mb-5">
          <p className="text-gray-800 font-bold leading-[21px] mb-2">
            Status <span className="text-red-600">*</span>
          </p>
          <Select
            size="md"
            defaultValue={STATUS_CERTIFICATION[1]}
            options={STATUS_CERTIFICATION}
            isDisabled={[STATUS_CERTIFICATION_TITLE.TIDAK_LULUS, STATUS_CERTIFICATION_TITLE.LULUS].includes(
              data?.interview_status,
            )}
            onChange={(option) => {
              setStatusSer(option?.value || '');
            }}
            value={STATUS_CERTIFICATION?.find((v) => v.value === data?.interview_status)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={[STATUS_CERTIFICATION_TITLE.TIDAK_LULUS, STATUS_CERTIFICATION_TITLE.LULUS].includes(
              data?.interview_status,
            )}
            // loading={isLoadingStatus}
            onClick={() => (statusSert === 7 ? onSubmitStatus() : setIsOpenDialog(true))}
            className="w-[200px] h-12 p-3 mb-2"
          >
            <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
          </Button>
        </div>
      </Card>
      <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
        <div className=" text-black text-xl font-normal font-opificio mb-6">Detail Siswa</div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Nama Siswa</span>
          <span>{data?.name}</span>
        </div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Program Pelatihan</span>
          <span>{data?.training_program_label}</span>
        </div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Total Wawancara</span>
          <span>{data?.interview_count || 0}</span>
        </div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Status</span>
          <span>
            {data?.interview_status ? (
              <StatusBadge
                text={data.interview_status_label}
                color={data.interview_status === 1 ? 'green' : data.interview_status === 2 ? 'orange' : 'red'}
              />
            ) : (
              <>-</>
            )}
          </span>
        </div>
      </AdaptableCard>
      <Dialog
        isOpen={isOpenDialog}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
        width={600}
        closable={false}
        className={'relative'}
      >
        <div className="flex flex-col p-4">
          <div className="flex justify-center">
            <ExclamationTriangleIcon height={64} width={64} color="#C63838" />
          </div>
          <div className="flex flex-col">
            <p className="text-h3 font-opificio text-black text-center mt-10">
              Lanjutkan progres siswa ke tahap wawancara?
            </p>
            <div className="flex justify-center mt-4">
              <p className="font-goth text-second-500 text-center">
                Status yang sudah di konfirmasi, tidak dapat dipulihkan,{' '}
                <span className="font-bold text-black">kecuali status Menunggu</span>. Pastikan siswa sudah mencapai
                target kelulusan minimum.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex justify-center gap-2">
              <Button variant="default" className="!py-0 h-10 w-[200px]" onClick={onDialogClose}>
                <div className="text-black font-normal">Tidak, Kembali</div>
              </Button>

              <Button
                loading={isLoadingStatus}
                variant="default"
                className="!py-0 h-10 w-[200px]"
                onClick={onSubmitStatus}
              >
                <div className="text-black font-normal">Ya, Konfirmasi</div>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default InformasiSiswa;
