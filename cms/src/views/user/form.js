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
import { apiGetRole } from 'services/AppService';
import { OPTION_STATUS_MASTER_DATA } from 'components/ui/utils/constant';
import { DEFAULT_PASSWORD } from 'constants/api.constant';
import Breadcrumbs from 'components/ui/Breadcrumbs';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Wajib diisi'),
  email: Yup.string().required('Wajib diisi'),
  role_id: Yup.string().required('Wajib diisi'),
});

const FormData = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [role, setRole] = useState([]);
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: PageConfig.url },
    { label: id ? PageConfig.editTitle : PageConfig.createTitle, path: '' },
  ];

  const getRole = async () => {
    try {
      const ress = await apiGetRole({ type: 'collection', options: ['filter,status,equal,1'] });
      setRole(ress.data?.data || []);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch data role'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const getData = async () => {
    try {
      const params = { relations: ['role'].join() };
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
        await apiStore({ ...body, password: DEFAULT_PASSWORD, password_confirmation: DEFAULT_PASSWORD });
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
    getRole();
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
            {id ? PageConfig.editTitle : PageConfig.createTitle}
          </div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl">
        <Formik
          initialValues={{
            name: detail?.name || '',
            email: detail?.email || '',
            role_id: detail?.role?.id || '',
            is_active: !id ? 1 : detail?.is_active,
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
                  <div className="grid grid-cols-2 gap-5">
                    <FormItem invalid={errors.name && touched.name} errorMessage={errors.name}>
                      <Field name="name">
                        {({ field }) => (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Nama Lengkap <span className="text-red-600">*</span>
                            </p>
                            <Input
                              value={values?.name}
                              size="md"
                              placeholder="Masukan nama lengkap"
                              onChange={(e) => setFieldValue(field.name, e.target.value)}
                            />
                          </div>
                        )}
                      </Field>
                    </FormItem>
                    <FormItem invalid={errors.email && touched.email} errorMessage={errors.email}>
                      <Field name="email">
                        {({ field }) => (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Email <span className="text-red-600">*</span>
                            </p>
                            <Input
                              value={values?.email}
                              size="md"
                              placeholder="Masukan email"
                              onChange={(e) => setFieldValue(field.name, e.target.value)}
                            />
                          </div>
                        )}
                      </Field>
                    </FormItem>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <FormItem invalid={errors.role_id && touched.role_id} errorMessage={errors.role_id}>
                      <Field name="role_id">
                        {({ field, form }) => {
                          const optionData = role?.map((option) => ({
                            value: option?.id,
                            label: option?.name,
                          }));

                          return (
                            <div>
                              <p className="text-black leading-[21px] mb-2">
                                Role <span className="text-red-600">*</span>
                              </p>

                              <Select
                                size="md"
                                options={optionData}
                                onChange={(option) => {
                                  form.setFieldValue(field.name, option.value);
                                }}
                                value={optionData.find((v) => v.value === values.role_id)}
                                placeholder="Pilih Role"
                              />
                            </div>
                          );
                        }}
                      </Field>
                    </FormItem>
                    <FormItem invalid={errors.is_active && touched.is_active} errorMessage={errors.is_active}>
                      <Field name="is_active">
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
                                value={OPTION_STATUS_MASTER_DATA.find((v) => v.value === values.is_active)}
                                isDisabled={!id}
                                placeholder="Select Status"
                              />
                            </div>
                          );
                        }}
                      </Field>
                    </FormItem>
                  </div>
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
