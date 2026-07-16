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
import { OPTION_STATUS_MASTER_DATA } from 'components/ui/utils/constant';
import Breadcrumbs from 'components/ui/Breadcrumbs';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Wajib diisi'),
  detail: Yup.string().required('Wajib diisi'),
  description: Yup.string().required('Wajib diisi'),
  link: Yup.string().url('Invalid URL').required('Wajib diisi'),
});

const FormData = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.pageTitle, path: PageConfig.url },
    { label: 'Form Sertifikasi Bahasa Jepang', path: '' },
  ];

  const getData = async () => {
    try {
      const ress = await apiShow(id);
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
          <div className="text-blue-950 text-xl font-normal font-opificio">Detail Sertifikasi</div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl">
        <div className=" text-black text-xl font-normal font-opificio mb-5">Form Sertifikasi</div>
        <Formik
          initialValues={{
            name: detail?.name || '',
            detail: detail?.detail || '',
            description: detail?.description || '',
            link: detail?.link || '',
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
                  <FormItem invalid={errors.name && touched.name} errorMessage={errors.name}>
                    <Field name="name">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Nama Sertifikasi <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.name}
                            size="md"
                            placeholder="Cth: JLPT"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.detail && touched.detail} errorMessage={errors.detail}>
                    <Field name="detail">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Detail Sertifikasi <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.detail}
                            size="md"
                            placeholder="Cth: Japanese Language Proficiency Test"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.description && touched.description} errorMessage={errors.description}>
                    <Field name="description">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Deskripsi Sertifikasi <span className="text-red-600">*</span>
                          </p>
                          <Input
                            textArea
                            value={values?.description}
                            size="md"
                            placeholder="Masukan deskripsi sertifikasi"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                    <div className="text-black">*maksimal 200 karakter</div>
                  </FormItem>
                  <FormItem invalid={errors.link && touched.link} errorMessage={errors.link}>
                    <Field name="link">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tautan Halaman Sertifikasi <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.link}
                            size="md"
                            placeholder="Masukan tautan pendaftaran sertifikasi"
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
                              value={OPTION_STATUS_MASTER_DATA.find((v) => v.value === values.status)}
                              placeholder="Select Status"
                            />
                          </div>
                        );
                      }}
                    </Field>
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
