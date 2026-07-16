import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiShow, apiStore, apiUpdate } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input } from 'components/ui';
import { PageConfig } from './config';
import { PageConfig as ModulePageConfig } from '../../config';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import DateTimepicker from 'components/ui/DatePicker/DateTimepicker';
import { uploadFile } from 'utils/helper/uploadfile';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { UPLOAD_SIZE } from 'constants/api.constant';

dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Wajib diisi'),
  external_url: Yup.string().required('Wajib diisi'),
  started_at: Yup.string().required('Wajib diisi'),
});

const Create = () => {
  const { id, parentId } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const [fileId, setFileId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Modul Pelatihan', path: ModulePageConfig.url },
    { label: 'Detail', path: `${ModulePageConfig.detailModulelUrl + parentId}` },
    { label: 'Buat Kelas Virtual', path: '' },
  ];

  const getData = async () => {
    try {
      const ress = await apiShow(id);
      setDetail(ress?.data?.data);
      if (ress?.data?.data?.cover) {
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
      // Validasi ukuran file
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
        return; // Menghentikan eksekusi jika ukuran melebihi batas
      }

      // Validasi rasio aspek gambar (1:1)
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);

      img.onload = async () => {
        const aspectRatio = img.width / img.height;
        if (Math.abs(aspectRatio - 16 / 9) > 0.01) {
          // Allowing a small margin
          toast.push(
            <Notification title={'Error'} type="danger">
              {'Ratio harus 16:9'}
            </Notification>,
            {
              placement: 'top-center',
            },
          );
          return; // Menghentikan eksekusi jika rasio tidak sesuai
        }

        const ress = await uploadFile(selectedFile);

        if (ress) {
          setFileId(ress?.data?.uuid);

          setImgUrl(ress?.data?.url);
        }
      };
    }
  };

  const getFile = () => {
    document.getElementById('fileInput').click();
  };

  const onSubmit = async (body) => {
    try {
      let title = 'membuat';
      const params = { ...body, cover_file_id: fileId ?? null, parent_id: parentId };

      if (id) {
        title = 'memperbarui';
        await apiUpdate(id, params);
      } else {
        await apiStore(params);
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
      <div className="router mb-5">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={ModulePageConfig.detailModulelUrl + parentId + '?page=virtual'}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">Kelas Virtual</div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl">
        <Formik
          initialValues={{
            title: detail?.title || '',
            external_url: detail?.external_url || '',
            started_at: detail?.started_at ? new Date(detail?.started_at) : '',
            status: detail?.status === 0 ? 0 : 1,
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
                  <FormItem className="!mb-5" invalid={errors.title && touched.title} errorMessage={errors.title}>
                    <Field name="title">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Nama Kelas Virtual <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.title}
                            size="md"
                            placeholder="Masukkan Nama Kelas Virtual"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    className="!mb-5"
                    invalid={errors.external_url && touched.external_url}
                    errorMessage={errors.external_url}
                  >
                    <Field name="external_url">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tautan Kelas Virtual <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.external_url}
                            size="md"
                            placeholder="Masukan Tautan Kelas Virtual"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    className="!mb-5"
                    invalid={errors.started_at && touched.started_at}
                    errorMessage={errors.started_at}
                  >
                    <Field name="started_at">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tanggal dan Waktu (WIB)<span className="text-red-600">*</span>
                          </p>
                          <DateTimepicker
                            amPm={false}
                            inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                            placeholder="Pilih tanggal & waktu (WIB)"
                            value={values?.started_at}
                            onChange={(e) => {
                              setFieldValue(field.name, e);
                            }}
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
                    Unggah Cover (Rasio 16:9, Max {UPLOAD_SIZE}mb)
                  </div>

                  <div
                    onClick={imgUrl ? null : () => getFile()}
                    className="cursor-pointer w-full h-[200px] bg-white rounded-[20px] shadow flex-col justify-center items-center inline-flex"
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
                              <img className="h-10 w-10" src="/img/icon/icon-trash.svg" alt="" />
                            </div>
                            <div className="px-3 py-2 bg-white rounded" onClick={() => getFile()}>
                              <img className="h-10 w-10" src="/img/icon/photo.svg" alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="items-center text-center">
                        <div className="w-32 h-8 px-3 py-2 bg-white rounded justify-center items-center gap-1 inline-flex">
                          <img src="/img/icon/photo.svg" alt="" className="w-5 h-5" />
                        </div>
                        <div className="text-black text-sm font-normal font-goth leading-[21px]">Add Photo</div>
                      </div>
                    )}
                  </div>
                </FormContainer>
                <div className="flex justify-end">
                  <Button loading={isSubmitting} type="submit" className="w-[200px] h-12 p-3 mb-2 mt-5">
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

export default Create;
