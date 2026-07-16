import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiShow, apiStore, apiUpdate } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input, DatePicker, Select } from 'components/ui';
import { PageConfig } from './config';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { apiGetConstants } from 'services/AppService';
import { apiFilterUser } from 'views/wawancara/api';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Wajib diisi'),
  send_at: Yup.string().required('Wajib diisi'),
  description: Yup.string().max(200, 'Isi notifikasi tidak boleh lebih dari 200 karakter').required('Wajib diisi'),
  link: Yup.string().url('Invalid URL').nullable(),
  repeat_each: Yup.string().required('Wajib diisi'),
  target: Yup.array().min(1, 'Wajib diisi'),
});

const FormData = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [repeats, setRepeats] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { DateTimepicker } = DatePicker;
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.pageTitle, path: PageConfig.url },
    { label: id ? detail?.name : PageConfig.createTitle, path: '' },
  ];

  const getRepeats = async () => {
    try {
      const ress = await apiGetConstants({ data: 'content_notif_repeat' });
      setRepeats(ress.data || []);
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

  const getUsers = async () => {
    try {
      const ress = await apiFilterUser({ type: 'collection', options: ['filter,role_id,is_null'] });
      setUsers(ress.data?.data || []);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch data user'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const getData = async () => {
    try {
      const ress = await apiShow(id, {
        relations: ['targets.user'].join(),
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

  const onSubmit = async (body) => {
    try {
      let title = 'membuat';
      body.is_active = 1;
      body.status = 0;
      body.send_at = dayjs.utc(body.send_at).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm');

      if (body.target.length == 1 && body.target[0].user_id == 'all') {
        body.target_status = 1;
        delete body.target;
      } else {
        body.target_status = 0;
      }

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
    getRepeats();
    getUsers();
    if (id) {
      getData();
    }
  }, [id]);

  const [isAllUsersSelected, setIsAllUsersSelected] = useState(false);

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
            send_at: detail?.send_at ? new Date(detail?.send_at) : '',
            description: detail?.description || '',
            link: detail?.link || '',
            repeat_each: detail?.repeat_each || '',
            target: detail?.targets?.map((target) => ({ user_id: target.user.id })) || [],
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
                              Judul Notifikasi <span className="text-red-600">*</span>
                            </p>
                            <Input
                              value={values?.name}
                              size="md"
                              placeholder="Masukan judul notifikasi"
                              onChange={(e) => setFieldValue(field.name, e.target.value)}
                            />
                          </div>
                        )}
                      </Field>
                    </FormItem>
                    <FormItem invalid={errors.send_at && touched.send_at} errorMessage={errors.send_at}>
                      <Field name="send_at">
                        {({ field }) => (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Tanggal dan Waktu Dikirim (WIB) <span className="text-red-600">*</span>
                            </p>
                            <DateTimepicker
                              amPm={false}
                              inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                              inputFormat={'DD MMMM YYYY, HH:mm'}
                              placeholder="Pilih Tanggal Dan Jam (WIB)"
                              value={values?.send_at}
                              onChange={(e) => {
                                setFieldValue(field.name, e || '');
                              }}
                            />
                          </div>
                        )}
                      </Field>
                    </FormItem>
                  </div>
                  <FormItem invalid={errors.description && touched.description} errorMessage={errors.description}>
                    <Field name="description">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Isi Notifikasi <span className="text-red-600">*</span>
                          </p>
                          <Input
                            textArea
                            value={values?.description}
                            size="md"
                            placeholder="Masukan isi notifikasi"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                    <div className="text-black">*maksimal 200 karakter</div>
                  </FormItem>
                  <div className="grid grid-cols-2 gap-5">
                    <FormItem invalid={errors.link && touched.link} errorMessage={errors.link}>
                      <Field name="link">
                        {({ field }) => (
                          <div>
                            <p className="text-black leading-[21px] mb-2">Tautan (Opsional)</p>
                            <Input
                              value={values?.link}
                              size="md"
                              placeholder="Masukan tautan"
                              onChange={(e) => setFieldValue(field.name, e.target.value)}
                            />
                          </div>
                        )}
                      </Field>
                    </FormItem>
                    <FormItem invalid={errors.repeat_each && touched.repeat_each} errorMessage={errors.repeat_each}>
                      <Field name="repeat_each">
                        {({ field, form }) => {
                          const optionData = repeats?.map((option) => ({
                            value: option?.value,
                            label: option?.name,
                          }));

                          return (
                            <div>
                              <p className="text-black leading-[21px] mb-2">
                                Ulangi Setiap <span className="text-red-600">*</span>
                              </p>

                              <Select
                                size="md"
                                options={optionData}
                                onChange={(option) => {
                                  form.setFieldValue(field.name, option.value);
                                }}
                                value={optionData.find((v) => v.value === values.repeat_each)}
                                placeholder="Pilih Waktu"
                              />
                            </div>
                          );
                        }}
                      </Field>
                    </FormItem>
                  </div>
                  <FormItem invalid={errors.target && touched.target} errorMessage={errors.target}>
                    <Field name="target">
                      {({ field, form }) => {
                        const handleSelectChange = (selectedOptions) => {
                          const selectingAllUsers = selectedOptions.some((option) => option.value === 'all');

                          setIsAllUsersSelected(selectingAllUsers);

                          if (selectingAllUsers) {
                            form.setFieldValue(field.name, [{ user_id: 'all' }]);
                          } else {
                            const selectedValues = selectedOptions.map((option) => ({ user_id: option.value }));
                            form.setFieldValue(field.name, selectedValues);
                          }
                        };

                        const allUsersOption = { value: 'all', label: 'Pilih Semua Siswa', isDisabled: false };
                        const optionData = users.map((option) => ({
                          value: option.id,
                          label: option.name,
                          isDisabled: isAllUsersSelected && option.value !== 'all',
                        }));

                        return (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Target <span className="text-red-600">*</span>
                            </p>

                            <Select
                              isMulti
                              size="md"
                              options={[allUsersOption, ...optionData]}
                              onChange={handleSelectChange}
                              value={[allUsersOption, ...optionData].filter(
                                (option) =>
                                  Array.isArray(field.value) &&
                                  field.value.some((targetUser) => targetUser.user_id === option.value),
                              )}
                              placeholder="Pilih Target"
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
