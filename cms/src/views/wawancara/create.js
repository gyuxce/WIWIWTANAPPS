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
import { apiIndex } from 'views/student/list/api';
import { TUJUAN_WAWANCARA } from 'components/ui/utils/constant';
import DateTimepicker from 'components/ui/DatePicker/DateTimepicker';
import Breadcrumbs from 'components/ui/Breadcrumbs';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  user_id: Yup.string().required('Wajib diisi'),
  type: Yup.string().required('Wajib diisi'),
  interview_date: Yup.string().required('Wajib diisi'),
  name: Yup.string().required('Wajib diisi'),
  position: Yup.string().required('Wajib diisi'),
  agency: Yup.string().required('Wajib diisi'),
  link: Yup.string().url('Invalid URL').required('Wajib diisi'),
});

const Create = () => {
  const { user_id, id } = useParams();
  const [detail, setDetail] = useState({});
  const [listSiswa, setListSiswa] = useState([]);
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Wawancara Final', path: PageConfig.url },
    { label: 'Form Wawancara', path: '' },
  ];

  const getData = async () => {
    try {
      const ress = await apiShow(id, {
        relations: ['user'].join(),
      });
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

  const getDataSiswa = async () => {
    try {
      const ressUser = await apiIndex({
        options: ['filter,role.id,null'],
      });
      const result = ressUser?.data?.data.map((v) => {
        return {
          label: v.name,
          value: v.id,
        };
      });
      setListSiswa(result);
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
    getDataSiswa();
    if (id) {
      getData();
    }
  }, [id]);

  return (
    <div className="px-5">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">Form Wawancara</div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl">
        <div className=" text-black text-xl font-normal font-opificio mb-5">Form Wawancara</div>
        <Formik
          initialValues={{
            user_id: detail?.user?.id || user_id,
            type: detail?.type || '',
            interview_date: detail?.interview_date ? new Date(detail?.interview_date) : '',
            name: detail?.name || '',
            position: detail?.position || '',
            agency: detail?.agency || '',
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
                  <FormItem invalid={errors.user_id && touched.user_id} errorMessage={errors.user_id}>
                    <Field name="user_id">
                      {({ field, form }) => {
                        return (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Siswa <span className="text-red-600">*</span>
                            </p>
                            <Select
                              size="md"
                              options={listSiswa}
                              onChange={(option) => {
                                form.setFieldValue(field.name, option.value);
                              }}
                              value={listSiswa.find((v) => v.value === values.user_id)}
                              placeholder="Pilih Siswa"
                              isDisabled
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.type && touched.type} errorMessage={errors.type}>
                    <Field name="type">
                      {({ field, form }) => {
                        return (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Tujuan Wawancara <span className="text-red-600">*</span>
                            </p>
                            <Select
                              size="md"
                              options={TUJUAN_WAWANCARA}
                              onChange={(option) => {
                                form.setFieldValue(field.name, option.value);
                              }}
                              value={TUJUAN_WAWANCARA.find((v) => v.value === values.type)}
                              placeholder="Pilih Modul Pelatihan"
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.link && touched.link} errorMessage={errors.link}>
                    <Field name="link">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tautan Wawancara <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.link}
                            size="md"
                            placeholder="Masukan deskripsi sertifikasi"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    invalid={errors.interview_date && touched.interview_date}
                    errorMessage={errors.interview_date}
                  >
                    <Field name="interview_date">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tanggal dan Waktu Wawancara (WIB) <span className="text-red-600">*</span>
                          </p>
                          <DateTimepicker
                            inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                            amPm={false}
                            placeholder="Pilih Tanggal (WIB)"
                            value={values?.interview_date}
                            onChange={(e) => {
                              setFieldValue(field.name, e);
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.name && touched.name} errorMessage={errors.name}>
                    <Field name="name">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Nama Pewawancara <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.name}
                            size="md"
                            placeholder="Masukan nama pewawancara"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.position && touched.position} errorMessage={errors.position}>
                    <Field name="position">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Jabatan Pewawancara <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.position}
                            size="md"
                            placeholder="Masukan jabatan pewawancara"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.agency && touched.agency} errorMessage={errors.agency}>
                    <Field name="agency">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Nama Instansi <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.agency}
                            size="md"
                            placeholder="Masukan nama instansi"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
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

export default Create;
