import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiShow, apiStore, apiUpdate } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input, Select } from 'components/ui';
import { PageConfig } from './config';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TYPE_CATEGORY_MODUL } from 'components/ui/utils/constant';
import { components } from 'react-select';
import { uploadFile } from 'utils/helper/uploadfile';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { UPLOAD_SIZE } from 'constants/api.constant';

const { Control } = components;

dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Wajib diisi'),
  title_japan: Yup.string().required('Wajib diisi'),
  type: Yup.string().required('Wajib diisi'),
});

const Create = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const [fileId, setFileId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.pageTitle, path: PageConfig.url },
    { label: `${detail?.title ? 'Edit' : 'Tambah'} Kategori Modul`, path: '' },
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
        if (aspectRatio !== 1) {
          toast.push(
            <Notification title={'Error'} type="danger">
              {'Ratio harus 1:1'}
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
      let param = { ...body };
      param.cover_id = fileId ?? null;

      if (id) {
        title = 'memperbarui';
        await apiUpdate(id, param);
      } else {
        await apiStore(param);
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

  const CustomSelectOption = ({ innerProps, label, data, isSelected }) => {
    return (
      <div
        className={`flex items-center justify-between p-2 ${
          isSelected ? 'bg-gray-100 dark:bg-gray-500' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
        {...innerProps}
      >
        <div className="flex items-center">
          <div className={`w-5 h-5 ${data.color} rounded-sm mr-2`}></div>
          <span className="-mb-1">{label}</span>
        </div>
      </div>
    );
  };

  const CustomControl = ({ children, ...props }) => {
    const selected = props.getValue()[0];
    const modifiedChildren = React.Children.map(children, (child, index) => {
      // Tambahkan class -mb-1 pada elemen pertama dalam children
      if (index === 0) {
        return React.cloneElement(child, {
          className: `${child.props.className || ''} -mb-1`,
        });
      }
      return child;
    });
    return (
      <Control {...props}>
        {selected && (
          <div className="flex items-center">
            <div className={`ltr:ml-4 w-5 h-5 ${selected.color} rounded-sm`}></div>
          </div>
        )}
        {modifiedChildren}
      </Control>
    );
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
            {detail?.title ? detail?.title : 'Tambah Kategori Modul'}
          </div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl">
        <Formik
          initialValues={{
            title: detail?.title || '',
            title_japan: detail?.title_japan || '',
            type: detail?.type || '',
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
                  <FormItem invalid={errors.title && touched.title} errorMessage={errors.title}>
                    <Field name="title">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Nama Kategori Modul (Indonesia) <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.title}
                            size="md"
                            placeholder="Masukan nama kategori modul"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.title_japan && touched.title_japan} errorMessage={errors.title_japan}>
                    <Field name="title_japan">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Nama Kategori Modul (Jepang) <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.title_japan}
                            size="md"
                            placeholder="Masukan nama kategori modul"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>

                  <FormItem invalid={errors.type && touched.type} errorMessage={errors.type}>
                    <Field name="type">
                      {({ field, form }) => {
                        return (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Tipe Pembelajaran <span className="text-red-600">*</span>
                            </p>

                            <Select
                              options={TYPE_CATEGORY_MODUL}
                              components={{
                                Option: CustomSelectOption,

                                Control: CustomControl,
                              }}
                              placeholder="Pilih Tipe Pembelajaran"
                              onChange={(option) => {
                                form.setFieldValue(field.name, option.value);
                              }}
                              value={TYPE_CATEGORY_MODUL.find((v) => v.value === values.type)}
                              size="md"
                            />
                          </div>
                        );
                      }}
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
                    Unggah Cover (Rasio 1:1, Max {UPLOAD_SIZE}mb)
                  </div>

                  <div
                    onClick={imgUrl ? null : () => getFile()}
                    className="cursor-pointer w-[200px] h-[200px] bg-white rounded-[20px] shadow flex-col justify-center items-center inline-flex"
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
                </FormContainer>
                <div className="flex justify-end mt-5">
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

export default Create;
