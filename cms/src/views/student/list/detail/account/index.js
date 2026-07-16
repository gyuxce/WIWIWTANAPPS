import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { apiShow, apiUpdate } from '../../api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input, Select } from 'components/ui';
import { PageConfig } from '../../config';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { apiGetConstants } from 'services/AppService';
import { OPTION_STATUS_MASTER_DATA } from 'components/ui/utils/constant';
import { apiForgotPassword } from 'services/AuthService';
import { formatDateFullDMY } from 'components/ui/utils/formatter';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  is_active: Yup.string().required('Wajib diisi'),
  // active_date: Yup.string().required('Wajib diisi'),
  email: Yup.string().required('Wajib diisi'),
  training_program: Yup.string().required('Wajib diisi'),
});

const AccountInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [program, setProgram] = useState([]);

  const getProgram = async () => {
    try {
      const ress = await apiGetConstants({ data: 'training_program' });
      setProgram(ress.data || []);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch training program data'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const getData = async () => {
    try {
      const params = {
        options: ['filter,is_header,is_not_null'],
        relations: ['city', 'course'].join(),
      };
      const ress = await apiShow(id, params);
      setDetail(ress?.data?.data);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch detail'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const forgotPassword = async () => {
    try {
      const resp = await apiForgotPassword({
        email: detail?.email,
        redirect_url: `${window.location.origin}/reset-password`,
        is_mobile: 1,
      });
      if (resp.data) {
        toast.push(
          <Notification title="Sukses" type="success">
            Perubahan sandi sudah dikirim ke email
          </Notification>,
          {
            placement: 'top-center',
          },
        );
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

  const onSubmit = async (body) => {
    body['name'] = detail.name;
    try {
      await apiUpdate(id, body);
      toast.push(
        <Notification title="Sukses" type="success">
          Berhasil memperbarui data
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
    getData();
    getProgram();
  }, [id]);

  return (
    <Card bodyclassName="!p-6" className="border-none rounded-xl">
      <div className=" text-black text-xl font-normal font-opificio mb-5">Informasi Akun</div>
      <Formik
        initialValues={{
          is_active: detail?.is_active || '',
          // active_date: detail?.active_date ? dayjs(detail?.active_date).toDate() : '',
          email: detail?.email || '',
          training_program: detail?.training_program || '',
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
                  <FormItem invalid={errors.is_active && touched.is_active} errorMessage={errors.is_active}>
                    <Field name="is_active">
                      {({ field, form }) => {
                        return (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Status Akun <span className="text-red-600">*</span>
                            </p>

                            <Select
                              size="md"
                              options={OPTION_STATUS_MASTER_DATA}
                              onChange={(option) => {
                                form.setFieldValue(field.name, option.value);
                              }}
                              value={OPTION_STATUS_MASTER_DATA.find((v) => v.value === values.is_active)}
                              placeholder="Pilih Status Akun"
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </FormItem>
                  {/* <FormItem invalid={errors.active_date && touched.active_date} errorMessage={errors.active_date}>
                    <Field name="active_date">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Masa Aktif Hingga <span className="text-red-600">*</span>
                          </p>
                          <DatePicker
                            inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                            inputFormat={'DD MMMM YYYY'}
                            placeholder="Pilih Tanggal"
                            value={values?.active_date}
                            onChange={(e) => {
                              setFieldValue(field.name, e);
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem> */}
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
                            placeholder="Masukan nomor HP"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <FormItem
                    invalid={errors.training_program && touched.training_program}
                    errorMessage={errors.training_program}
                  >
                    <Field name="training_program">
                      {({ field, form }) => {
                        const optionData = program?.map((option) => ({
                          value: option?.value,
                          label: option?.name,
                        }));

                        return (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Program Pelatihan <span className="text-red-600">*</span>
                            </p>

                            <Select
                              size="md"
                              options={optionData}
                              onChange={(option) => {
                                form.setFieldValue(field.name, option.value);
                              }}
                              value={optionData.find((v) => v.value === values.training_program)}
                              placeholder="Pilih Program Pelatihan"
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </FormItem>
                </div>
              </FormContainer>
              <img src="/img/others/Divider.svg" alt="" className="mb-5 h-2" />
              <div className="flex-col justify-start items-start gap-6 inline-flex mb-5">
                <div className="self-stretch flex-col justify-end items-start gap-2 flex">
                  <div className="text-center text-black text-sm leading-[21px]">Alasan Menjadi Perawat</div>
                  <div className="self-stretch text-blue-950 text-sm leading-[21px]">{detail?.join_reason}</div>
                </div>
                {/* <div className="self-stretch h-[50px] flex-col justify-end items-start gap-2 flex">
                  <div className="text-center text-black text-sm leading-[21px]">Lokasi Pelatihan</div>
                  <div className="text-center text-blue-950 text-sm leading-[21px]">-</div>
                </div> */}
                <div className="self-stretch h-[50px] flex-col justify-end items-start gap-2 flex">
                  <div className="text-center text-black text-sm leading-[21px]">Tanggal Pendaftaran Akun</div>
                  <div className="text-center text-blue-950 text-sm leading-[21px]">
                    {formatDateFullDMY(detail?.created_at, 'id')}
                  </div>
                </div>
                <div className="self-stretch h-[50px] flex-col justify-end items-start gap-2 flex">
                  <div className="text-center text-black text-sm leading-[21px]">Tanggal Bergabung Pelatihan</div>
                  <div className="text-center text-blue-950 text-sm leading-[21px]">
                    {' '}
                    {formatDateFullDMY(detail?.join_date, 'id')}
                  </div>
                </div>
                <div className="self-stretch h-[92px] flex-col justify-end items-start gap-2 flex">
                  <div className="text-center text-black text-sm leading-[21px]">Bantu reset kata sandi siswa</div>
                  <Button type="button" className="p-3" onClick={forgotPassword}>
                    <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                      Ubah Sandi
                    </div>
                  </Button>
                  <div className="self-stretch text-black text-xs font-normal font-goth">
                    *Tindakan ini akan mengirimkan email permintaan perubahan kata sandi kepada siswa.
                  </div>
                </div>
              </div>
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
  );
};

export default AccountInformation;
