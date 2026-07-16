import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiShow, apiStore, apiUpdate } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input, Checkbox, Select, Spinner } from 'components/ui';
import { PageConfig } from './config';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import { uploadFile } from 'utils/helper/uploadfile';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { OPTION_STATUS_MASTER_DATA } from 'components/ui/utils/constant';
import DateTimepicker from 'components/ui/DatePicker/DateTimepicker';
import { UPLOAD_SIZE } from 'constants/api.constant';

dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Wajib diisi'),
  status: Yup.string().required('Wajib diisi'),
  started_at: Yup.string().required('Wajib diisi'),
  finished_at: Yup.string().required('Wajib diisi'),
  description: Yup.string().max(1000, 'Deskripsi acara tidak boleh lebih dari 1000 karakter').required('Wajib diisi'),
  link: Yup.string().url('Invalid URL').required('Wajib diisi'),
});

const FormData = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const modules = {
    toolbar: [
      [
        'bold',
        'italic',
        'underline',
        { align: null },
        { align: 'center' },
        { align: 'right' },
        { align: 'justify' },
        { list: 'ordered' },
        { list: 'bullet' },
      ],
    ],
  };
  const formats = ['bold', 'italic', 'align', 'list', 'bullet', 'indent', 'underline'];
  const [fileId, setFileId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.pageTitle, path: PageConfig.url },
    { label: id ? detail?.name : PageConfig.createTitle, path: '' },
  ];

  const getData = async () => {
    try {
      const ress = await apiShow(id, {
        relations: ['cover'].join(),
      });
      setDetail(ress?.data?.data);
      if (ress?.data?.data?.cover) {
        setFileId(ress?.data?.data?.cover?.id);
        setImgUrl(ress?.data?.data?.cover?.url);
      }
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

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeInMB > UPLOAD_SIZE) {
        toast.push(
          <Notification title={'Error'} type="danger">
            {'Maximum size ' + UPLOAD_SIZE + ' MB'}
          </Notification>,
          {
            placement: 'top-center',
          },
        );
        setIsUploading(false);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);

      img.onload = async () => {
        const aspectRatio = img.width / img.height;
        if (aspectRatio !== 1) {
          toast.push(
            <Notification title={'Error'} type="danger">
              {'Ratio harus 1:1'}
            </Notification>,
            {
              placement: 'top-center',
            },
          );
          return;
        }
        setIsUploading(true);
        const ress = await uploadFile(selectedFile);

        if (ress) {
          setFileId(ress?.data?.uuid);

          setImgUrl(ress?.data?.url);
        }
        setIsUploading(false);
      };
    }
  };

  const getFile = () => {
    document.getElementById('fileInput').click();
  };

  const onSubmit = async (body) => {
    try {
      let title = 'membuat';
      body.cover_id = fileId ?? null;
      if (id) {
        title = 'memperbarui';
        await apiUpdate(id, body);
      } else {
        await apiStore(body);
      }
      toast.push(
        <Notification title="Sukses" type="success">
          Berhasil {title} data
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      navigate(PageConfig.url);
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
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">
            {id ? detail?.name : PageConfig.createTitle}
          </div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl">
        <Formik
          initialValues={{
            name: detail?.name || '',
            status: detail?.status || 0,
            started_at: detail?.started_at ? new Date(detail?.started_at) : null,
            finished_at: detail?.finished_at ? new Date(detail?.finished_at) : null,
            description: detail?.description || '',
            link: detail?.link || '',
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ values, touched, errors, setFieldValue, isSubmitting }) => {
            return (
              <Form>
                <FormContainer className="text-sm">
                  <FormItem invalid={errors.name && touched.name} errorMessage={errors.name}>
                    <Field name="name">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Nama Acara <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.name}
                            size="md"
                            placeholder="Masukan nama acara"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.status && touched.status} errorMessage={errors.status}>
                    <Field name="status">
                      {({ field, form }) => {
                        return (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Status <span className="text-red-600">*</span>
                            </p>

                            <Select
                              size="md"
                              options={OPTION_STATUS_MASTER_DATA}
                              onChange={(option) => {
                                form.setFieldValue(field.name, option.value);
                              }}
                              value={OPTION_STATUS_MASTER_DATA.find((v) => v.value == Number(values.status))}
                              placeholder="Select Status"
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.started_at && touched.started_at} errorMessage={errors.started_at}>
                    <Field name="started_at">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tanggal Mulai (WIB) <span className="text-red-600">*</span>
                          </p>
                          <DateTimepicker
                            inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                            inputFormat="DD MMMM YYYY, HH:mm"
                            placeholder="Pilih Tanggal (WIB)"
                            value={values?.started_at}
                            onChange={(e) => {
                              setFieldValue(field.name, e);
                            }}
                            amPm={false}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    className="mb-3"
                    invalid={errors.finished_at && touched.finished_at}
                    errorMessage={errors.finished_at}
                  >
                    <Field name="finished_at">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tanggal Selesai (WIB) <span className="text-red-600">*</span>
                          </p>
                          <DateTimepicker
                            inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                            inputFormat="DD MMMM YYYY, HH:mm"
                            placeholder="Pilih Tanggal (WIB)"
                            value={values?.finished_at}
                            disabled={values?.same_day}
                            onChange={(e) => {
                              setFieldValue(field.name, e);
                            }}
                            amPm={false}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <Checkbox
                    value={values?.same_day}
                    className="mb-5 text-center text-black text-sm font-normal font-goth leading-[21px]"
                    onChange={(e) => {
                      setFieldValue('same_day', e);
                      if (e) {
                        setFieldValue('finished_at', values?.started_at);
                      }
                    }}
                    checked={values.same_day}
                  >
                    <div className="mt-1 text-center text-black text-sm font-normal font-goth leading-[21px]">
                      Selesai di hari yang sama
                    </div>
                  </Checkbox>
                  <FormItem invalid={errors.link && touched.link} errorMessage={errors.link}>
                    <Field name="link">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tautan Acara <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.link}
                            size="md"
                            placeholder="Masukan tautan acara"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/png, image/jpeg,image/jpg"
                    style={{ display: 'none' }}
                    onChange={(event) => {
                      handleFileChange(event);
                    }}
                  />
                  <div className="text-black text-sm font-normal font-goth leading-[21px]">
                    Unggah Cover (Rasio 1:1, Maks {UPLOAD_SIZE}Mb)
                  </div>
                  {isUploading ? (
                    <div className="cursor-pointer w-full h-[200px] bg-white rounded-[20px] shadow flex-col justify-center items-center inline-flex mb-5">
                      <Spinner />
                    </div>
                  ) : (
                    <div
                      onClick={imgUrl ? null : () => getFile()}
                      className="cursor-pointer w-full h-[200px] bg-white rounded-[20px] shadow flex-col justify-center items-center inline-flex mb-5"
                    >
                      {imgUrl ? (
                        <div className="relative">
                          <img
                            src={imgUrl}
                            onClick={() => {
                              window.open(imgUrl, '_blank');
                            }}
                            alt=""
                            className="w-full h-[200px] object-cover rounded-[20px]"
                          />
                          <div className="absolute bottom-0 right-0 p-3">
                            <div className="flex space-x-2">
                              <div
                                className="px-3 py-2 bg-white rounded"
                                onClick={() => {
                                  setImgUrl('');
                                  setFileId('');
                                }}
                              >
                                <img className="h-5 w-5" src="/img/icon/icon-trash.svg" alt="" />
                              </div>
                              <div className="px-3 py-2 bg-white rounded" onClick={() => getFile()}>
                                <img className="h-5 w-5" src="/img/icon/photo.svg" alt="" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="items-center text-center">
                          <div className="w-8 h-8 px-3 py-2 bg-white rounded justify-center items-center gap-1 inline-flex">
                            <div className="w-5 h-5 relative">
                              <div className="w-5 h-5 left-0 top-0">
                                <img src="/img/icon/photo.svg" alt="" />
                              </div>
                            </div>
                          </div>
                          <div className="text-black text-sm font-normal font-goth leading-[21px]">Add Photo</div>
                        </div>
                      )}
                    </div>
                  )}

                  <FormItem invalid={errors.description && touched.description} errorMessage={errors.description}>
                    <Field name="description">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Deskripsi Acara <span className="text-red-600">*</span>
                          </p>
                          <ReactQuill
                            style={{ marginBottom: '8px' }}
                            theme="snow"
                            // className="rounded-md border h-[109px]"
                            initialValue=""
                            placeholder="Masukan deskripsi acara"
                            value={values?.description}
                            onChange={(val) => {
                              setFieldValue(field.name, val);
                            }}
                            modules={modules}
                            formats={formats}
                          />
                        </div>
                      )}
                    </Field>
                    <div className="text-black">*Maksimal 1000 karakter</div>
                  </FormItem>
                </FormContainer>
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

export default FormData;
