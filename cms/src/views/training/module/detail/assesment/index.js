import { AdaptableCard } from 'components/shared';
import { Button, Dialog, Notification, toast } from 'components/ui';
import React, { useState, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { openNotification } from 'components/custom/NotificationComponent';
import { useNavigate } from 'react-router-dom';
import { apiIndex, apiUpdateStatus, apiUploadFile } from './api';
import { PageConfig } from './config';
import { PageConfig as ModuleConfig } from '../../config';
import { apiFile } from 'services/ApiBase';
import { TrashIcon } from '@radix-ui/react-icons';
import { handleDownloadClick } from 'components/ui/utils/downloadFile';

const Assesment = (props) => {
  const { id } = props;
  const [dialogIsOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataTemplate, setDataTemplate] = useState({});
  const navigate = useNavigate();
  const [initialValue, setInitialValue] = useState('');

  const onDialogClose = () => {
    setInitialValue('');
    setIsOpen(!dialogIsOpen);
  };

  const getData = async () => {
    try {
      const response = await apiIndex({
        type: 'collection',
        order_by: 'id',
        sort_by: 'asc',
        options: ['filter,exam_template_id,in,1|5', `filter,module.uuid,equal,${id}`],
        relations: ['file', 'exam_template'].join(),
      });
      setData(response?.data?.data);
    } catch (error) {
      openNotification('Error fetching data:', 'danger', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiUpdateStatus({ id: id, is_active: !status });
      openNotification('Sukses', 'success', 'Berhasil memperbarui data');
      getData();
    } catch (error) {
      openNotification('Error', 'danger', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
      <div className="text-black text-xl font-normal font-opificio mb-5 flex justify-between items-center">
        <span>{PageConfig.pageTitle}</span>
      </div>

      <div>
        {data.map((val, index) => (
          <div key={index} className="p-6 rounded-xl border border-stone-300 mb-5">
            <div className="relative mb-5">
              <div className="text-blue-950 text-xl font-normal font-opificio">{val?.typeAssesment?.title}</div>
              <div className="w-[930px] text-slate-600 text-sm font-normal font-goth leading-[21px]">
                {val?.typeAssesment?.description}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => updateStatus(val?.id, val?.is_active)}
                  type="button"
                  size="custome"
                  className="p-0"
                >
                  <div className="text-center space-x-2 text-black flex items-center text-sm font-normal font-goth leading-[21px]">
                    <img src={val?.is_active ? '/img/icon/icon-minus.svg' : '/img/icon/checklist-icon.svg'} alt="" />
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px] mt-1">
                      {val?.is_active ? 'Non Aktifkan' : 'Aktifkan'}
                    </span>
                  </div>
                </Button>
                <Button
                  onClick={() => {
                    if (val?.typeAssesment?.exam_template_type == 1) {
                      navigate(`${ModuleConfig.detailModulelUrl + id}/assesment/${val?.id}/question`);
                    } else if (val?.typeAssesment?.exam_template_type == 5) {
                      navigate(`${ModuleConfig.detailModulelUrl + id}/assesment/verbal`);
                    } else {
                      navigate(`/`);
                    }
                  }}
                  type="button"
                  variant="plain"
                  size="custome"
                  className="rounded-lg border border-black "
                >
                  <div className="text-center space-x-2 text-black flex items-center text-sm font-normal font-goth leading-[21px]">
                    <img src="/img/icon/Icons-plus.svg" alt="" />
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px] mt-1">
                      {val?.typeAssesment?.exam_template_type == 5 ? 'Tambah Jadwal' : 'Buat Paket Soal'}
                    </span>
                  </div>
                </Button>
              </div>
              <Button
                // onClick={(() => setIsOpen(!dialogIsOpen), setDataTemplate(val))}
                onClick={() => {
                  setIsOpen(!dialogIsOpen);
                  setDataTemplate(val);
                }}
                type="button"
                variant="plain"
                size="custome"
              >
                <div className="h-10 p-3 rounded-lg justify-center items-center gap-2 inline-flex">
                  <img src="/img/icon/icon-upload.svg" alt="" />
                  <div className="text-center text-black text-sm font-normal font-goth leading-[21px] mt-1">
                    Unggah Video Pembahasan
                  </div>
                </div>
              </Button>
            </div>
          </div>
        ))}

        <DialogNotification
          isOpen={dialogIsOpen}
          onClose={onDialogClose}
          dataTemplate={dataTemplate}
          initialValue={initialValue}
          onRefresh={getData}
        />
      </div>
    </AdaptableCard>
  );
};

const DialogNotification = ({ isOpen, onClose, dataTemplate, onRefresh }) => {
  const [videoAssementId, setVideoAssesmentId] = useState('');
  const [videoAssesmentName, setVideoAssesmentName] = useState('');
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

  const getVideoAssesment = () => {
    document.getElementById('videoAssesmentInput').click();
  };

  const handleVideoAssesmentChange = async (event) => {
    const selectedVideoAssesment = event.target.files[0];
    if (selectedVideoAssesment) {
      uploadVideoAssesment(selectedVideoAssesment);
    }
  };

  const uploadVideoAssesment = async (selectedVideoAssesment) => {
    setIsLoadingUpload(true);
    const formData = new FormData();
    formData.append('file', selectedVideoAssesment);
    const ress = await apiFile(formData);
    if (ress) {
      setVideoAssesmentId(ress.data?.uuid);
      setVideoAssesmentName(selectedVideoAssesment.name);
    } else {
      removeVideoAssesment();
    }
    setIsLoadingUpload(false);
  };

  const removeVideoAssesment = () => {
    setVideoAssesmentId('');
    setVideoAssesmentName('');
  };

  const downloadVideoAssesment = async () => {
    try {
      handleDownloadClick(dataTemplate?.file?.url, dataTemplate?.file?.filename);
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

  const onSubmit = async (body) => {
    try {
      apiUploadFile({ id: dataTemplate.id, file_id: body.file });
      openNotification('Success', 'success', 'Berhasil simpan data');
      onRefresh();
      removeVideoAssesment();
      onClose();
    } catch (error) {
      openNotification('Error', 'danger', 'Error saving data: ' + error);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} closable={false}>
      <div className="mb-1 flex items-center justify-between">
        <div className=" text-blue-950 text-xl font-normal font-opificio">Video Pembahasan</div>
        <img src="/img/icon/icon-radix.svg" alt="" onClick={onClose} />
      </div>
      <div className="text-blue-950 text-sm font-normal font-goth leading-[21px] mb-8">
        Silahkan unggah pembahasan assesmen
      </div>

      {dataTemplate !== '' ? (
        <Formik
          initialValues={dataTemplate}
          enableReinitialize={true}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await onSubmit(videoAssementId ? { file: videoAssementId } : { file: dataTemplate?.file?.id });
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, handleSubmit, setSubmitting }) => (
            <div>
              <Form>
                <div className="text-black text-sm font-normal font-goth leading-[21px] pb-3 mb-3">
                  <div className="pb-2">
                    <p className="text-black leading-[21px]">
                      Unggah Video <span className="text-red-600">*</span>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="videoAssesmentInput"
                      type="file"
                      accept="video/*"
                      style={{ display: 'none' }}
                      onChange={handleVideoAssesmentChange}
                    />
                    <Button
                      type="button"
                      variant="plain"
                      loading={isLoadingUpload}
                      disabled={isLoadingUpload}
                      onClick={() => {
                        getVideoAssesment();
                      }}
                      style={{ padding: '0px' }}
                    >
                      <span className="text-center cursor-pointer text-black text-sm font-normal font-goth leading-[21px] p-3 border border-stone-300 rounded-lg">
                        Unggah File
                      </span>
                    </Button>
                    {videoAssesmentName ? (
                      <div className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center ml-3">
                        <TrashIcon
                          color="#EF4444"
                          width={20}
                          height={21}
                          onClick={() => removeVideoAssesment()}
                          className="cursor-pointer"
                        />
                        <span className="ml-1 text-sm mt-1">{videoAssesmentName}</span>
                      </div>
                    ) : dataTemplate?.file ? (
                      <div
                        className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center cursor-pointer ml-3"
                        onClick={() => downloadVideoAssesment()}
                      >
                        <img src="/img/icon/icon-document.svg" className="mr-1" alt="" />{' '}
                        <div className="mt-1">Download</div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </Form>
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  onClick={onClose}
                  style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
                  className="w-full h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex"
                >
                  <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">Batalkan</div>
                </Button>

                <Button
                  loading={isSubmitting}
                  type="submit"
                  onClick={() => {
                    setSubmitting(true);
                    handleSubmit();
                  }}
                  style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
                  className="w-full h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex"
                >
                  <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">Konfirmasi</div>
                </Button>
              </div>
            </div>
          )}
        </Formik>
      ) : (
        ''
      )}
    </Dialog>
  );
};

export default Assesment;
