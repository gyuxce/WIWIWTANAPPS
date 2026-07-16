import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiShow, apiUpdate } from './api';
import { apiFile } from 'services/ApiBase';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input } from 'components/ui';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TrashIcon } from '@radix-ui/react-icons';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { handleDownloadClick } from 'components/ui/utils/downloadFile';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  amount: Yup.string().required('Wajib diisi'),
});

const Edit = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [fileTrainingId, setFileTrainingId] = useState('');
  const [fileTrainingName, setFileTrainingName] = useState('');
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [fileInstallmentId, setFileInstallmentId] = useState('');
  const [fileInstallmentName, setFileInstallmentName] = useState('');
  const [isLoadingUploadInstallment, setIsLoadingUploadInstallment] = useState(false);
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Data Pembayaran', path: '/student/payment?tab=tab2' },
    { label: detail?.type_label, path: '' },
  ];

  const getFileTraining = () => {
    document.getElementById('fileTrainingInput').click();
  };

  const getFileInstallment = () => {
    document.getElementById('fileInstallmentInput').click();
  };

  const handleFileTrainingChange = async (event) => {
    const selectedFileTraining = event.target.files[0];
    if (selectedFileTraining) {
      uploadFileTraining(selectedFileTraining);
    }
  };

  const handleFileInstallmentChange = async (event) => {
    const selectedFileInstallment = event.target.files[0];
    if (selectedFileInstallment) {
      uploadFileInstallment(selectedFileInstallment);
    }
  };

  const uploadFileTraining = async (selectedFileTraining) => {
    setIsLoadingUpload(true);
    const formData = new FormData();
    formData.append('file', selectedFileTraining);
    const ress = await apiFile(formData);
    if (ress) {
      setFileTrainingId(ress.data?.uuid);
      setFileTrainingName(selectedFileTraining.name);
    } else {
      setFileTrainingId('');
    }
    setIsLoadingUpload(false);
  };

  const uploadFileInstallment = async (selectedFileInstallment) => {
    setIsLoadingUploadInstallment(true);
    const formData = new FormData();
    formData.append('file', selectedFileInstallment);
    const ress = await apiFile(formData);
    if (ress) {
      setFileInstallmentId(ress.data?.uuid);
      setFileInstallmentName(selectedFileInstallment.name);
    } else {
      setFileInstallmentId('');
    }
    setIsLoadingUploadInstallment(false);
  };

  const removeFileTraining = () => {
    setFileTrainingId('');
    setFileTrainingName('');
  };

  const removeFileInstallment = () => {
    setFileInstallmentId('');
    setFileInstallmentName('');
  };

  const downloadFileTraining = async () => {
    try {
      handleDownloadClick(detail?.trainingLetter?.url, detail?.trainingLetter?.filename);
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

  const downloadFileInstallment = async () => {
    try {
      handleDownloadClick(detail?.installmentLetter?.url, detail?.installmentLetter?.filename);
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

  const getData = async () => {
    try {
      const params = { relations: 'program,trainingLetter,installmentLetter' };
      const ress = await apiShow(id, params);
      setDetail(ress?.data?.data);
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
      let title = 'membuat';
      if (id) {
        title = 'memperbarui';
        await apiUpdate(id, body);
      } else {
        // await apiStore(body);
      }
      toast.push(
        <Notification title="Sukses" type="success">
          Berhasil {title} data
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      navigate('/student/payment?tab=tab2');
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

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to="/student/payment?tab=tab2">
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{detail?.type_label}</div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl">
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Tipe Pembayaran</span>
          <span>{detail?.type_label}</span>
        </div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Program Pelatihan</span>
          <span>{detail?.program?.title}</span>
        </div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Preferensi</span>
          <span>{detail?.subtype_label}</span>
        </div>
        <Formik
          initialValues={{
            amount: detail?.amount || '',
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const submissionBody = {
              ...values,
              ...(fileTrainingId && { training_letter_file_id: fileTrainingId }),
              ...(fileInstallmentId && { installment_letter_file_id: fileInstallmentId }),
            };

            await onSubmit(submissionBody);
            setSubmitting(false);
          }}
        >
          {({ values, touched, errors, setFieldValue, isSubmitting }) => {
            return (
              <Form>
                <FormContainer className="text-sm">
                  <FormItem invalid={errors.amount && touched.amount} errorMessage={errors.amount}>
                    <Field name="amount">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Harga Paket (Rp) <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.amount}
                            size="md"
                            placeholder="Contoh: 4200000"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                </FormContainer>
                {detail?.type == 2 && (
                  <>
                    <div className="text-black text-sm font-normal font-goth leading-[21px] pb-3 mb-3">
                      <div className="pb-2">
                        <p className="text-black leading-[21px]">
                          Surat Pernyataan Pelatihan <span className="text-red-600">*</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="fileTrainingInput"
                          type="file"
                          accept="application/pdf"
                          style={{ display: 'none' }}
                          onChange={handleFileTrainingChange}
                        />
                        <Button
                          type="button"
                          variant="plain"
                          loading={isLoadingUpload}
                          disabled={isLoadingUpload}
                          onClick={() => {
                            getFileTraining();
                          }}
                          style={{ padding: '0px' }}
                        >
                          <span className="text-center cursor-pointer text-black text-sm font-normal font-goth leading-[21px] p-3 border border-stone-300 rounded-lg">
                            Unggah File
                          </span>
                        </Button>
                        {fileTrainingName ? (
                          <div className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center ml-3">
                            <TrashIcon
                              color="#EF4444"
                              width={20}
                              height={21}
                              onClick={() => removeFileTraining()}
                              className="cursor-pointer"
                            />
                            <span className="ml-1 text-sm mt-1">{fileTrainingName}</span>
                          </div>
                        ) : detail?.trainingLetter ? (
                          <div
                            className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center cursor-pointer ml-3"
                            onClick={() => downloadFileTraining()}
                          >
                            <img src="/img/icon/icon-document.svg" className="mr-1" alt="" />{' '}
                            <div className="mt-1">Download</div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="text-black text-sm font-normal font-goth leading-[21px] pb-3 mb-3">
                      <div className="pb-2">
                        <p className="text-black leading-[21px]">
                          Surat Pernyataan Cicilan Pribadi <span className="text-red-600">*</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="fileInstallmentInput"
                          type="file"
                          accept="application/pdf"
                          style={{ display: 'none' }}
                          onChange={handleFileInstallmentChange}
                        />
                        <Button
                          type="button"
                          variant="plain"
                          loading={isLoadingUploadInstallment}
                          disabled={isLoadingUploadInstallment}
                          onClick={() => {
                            getFileInstallment();
                          }}
                          style={{ padding: '0px' }}
                        >
                          <span className="text-center cursor-pointer text-black text-sm font-normal font-goth leading-[21px] p-3 border border-stone-300 rounded-lg">
                            Unggah File
                          </span>
                        </Button>
                        {fileInstallmentName ? (
                          <div className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center ml-3">
                            <TrashIcon
                              color="#EF4444"
                              width={20}
                              height={21}
                              onClick={() => removeFileInstallment()}
                              className="cursor-pointer"
                            />
                            <span className="ml-1 text-sm mt-1">{fileInstallmentName}</span>
                          </div>
                        ) : detail?.installmentLetter ? (
                          <div
                            className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center cursor-pointer ml-3"
                            onClick={() => downloadFileInstallment()}
                          >
                            <img src="/img/icon/icon-document.svg" className="mr-1" alt="" />
                            <div className="mt-1">Download</div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-end">
                  <Button loading={isSubmitting} type="submit" className="w-[200px] h-12 p-3 mb-2">
                    <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
};

export default Edit;
