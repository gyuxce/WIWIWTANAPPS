import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { apiShow, apiUpdate } from '../../api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input, Select, DatePicker } from 'components/ui';
import { PageConfig } from '../../config';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { apiGetCity, apiGetConstants } from 'services/AppService';
dayjs.extend(utc);
const numberRgx =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  name: Yup.string().matches('^[a-zA-Z0-9. -]*$', 'Nama tidak valid').required('Wajib diisi'),
  id_card: Yup.string()
    .required('Wajib diisi')
    .matches(numberRgx, 'NIK tidak valid')
    .min(16, 'NIK minimal 16 karakter')
    .max(16, 'NIK maksimal 16 karakter'),
  phone: Yup.string().required('Wajib diisi').matches(numberRgx, 'Nomor HP tidak valid'),
  blood_type: Yup.string().required('Wajib diisi'),
  city_id: Yup.string().required('Wajib diisi'),
  address: Yup.string().required('Wajib diisi'),
  birthplace: Yup.string().required('Wajib diisi'),
  dob: Yup.string().required('Wajib diisi'),
  last_education: Yup.string().required('Wajib diisi'),
  study_program: Yup.string().required('Wajib diisi'),
});

const FormData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [city, setCity] = useState([]);
  const [blood, setBlood] = useState([]);
  const [education, setEducation] = useState([]);

  const getCity = async () => {
    try {
      const ress = await apiGetCity({ type: 'collection' });
      setCity(ress.data?.data || []);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch city data'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const getBlood = async () => {
    try {
      const ress = await apiGetConstants({ data: 'blood_type' });
      setBlood(ress.data || []);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch blood type data'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const getEducation = async () => {
    try {
      const ress = await apiGetConstants({ data: 'last_education' });
      setEducation(ress.data || []);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch education data'}
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

  const onSubmit = async (body) => {
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
    getBlood();
    getCity();
    getEducation();
  }, [id]);

  return (
    <Card bodyClass="!p-6" className="border-none rounded-xl">
      <div className=" text-black text-xl font-normal font-opificio mb-5">Informasi Pribadi</div>
      <Formik
        initialValues={{
          name: detail?.name || '',
          id_card: detail?.id_card || '',
          phone: detail?.phone || '',
          blood_type: detail?.blood_type || '',
          city_id: detail?.city?.id || '',
          address: detail?.address || '',
          birthplace: detail?.birthplace || '',
          dob: detail?.dob ? dayjs(detail?.dob).toDate() : '',
          last_education: detail?.last_education || '',
          study_program: detail?.study_program || '',
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
                  <FormItem className="!mb-4" invalid={errors.name && touched.name} errorMessage={errors.name}>
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
                  <FormItem className="!mb-4" invalid={errors.id_card && touched.id_card} errorMessage={errors.id_card}>
                    <Field name="id_card">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            NIK <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.id_card}
                            size="md"
                            placeholder="Masukan NIK"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <FormItem className="!mb-4" invalid={errors.phone && touched.phone} errorMessage={errors.phone}>
                    <Field name="phone">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Nomor HP Aktif <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.phone}
                            size="md"
                            placeholder="Masukan nomor HP"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    className="!mb-4"
                    invalid={errors.blood_type && touched.blood_type}
                    errorMessage={errors.blood_type}
                  >
                    <Field name="blood_type">
                      {({ field, form }) => {
                        const optionData = blood?.map((option) => ({
                          value: option?.value,
                          label: option?.name,
                        }));

                        return (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Golongan Darah <span className="text-red-600">*</span>
                            </p>

                            <Select
                              size="md"
                              options={optionData}
                              onChange={(option) => {
                                form.setFieldValue(field.name, option.value);
                              }}
                              value={optionData.find((v) => v.value === values.blood_type)}
                              placeholder="Pilih Golongan Darah"
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </FormItem>
                </div>
                <FormItem className="!mb-4" invalid={errors.city_id && touched.city_id} errorMessage={errors.city_id}>
                  <Field name="city_id">
                    {({ field, form }) => {
                      const optionData = city?.map((option) => ({
                        value: option?.id,
                        label: option?.name,
                      }));

                      return (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Domisili <span className="text-red-600">*</span>
                          </p>

                          <Select
                            size="md"
                            options={optionData}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option.value);
                            }}
                            value={optionData.find((v) => v.value === values.city_id)}
                            placeholder="Pilih Domisili"
                          />
                        </div>
                      );
                    }}
                  </Field>
                </FormItem>
                <FormItem className="!mb-4" invalid={errors.address && touched.address} errorMessage={errors.address}>
                  <Field name="address">
                    {({ field }) => (
                      <div>
                        <p className="text-black leading-[21px] mb-2">
                          Alamat Lengkap <span className="text-red-600">*</span>
                        </p>
                        <Input
                          textArea
                          value={values?.address}
                          size="md"
                          placeholder="Masukan alamat lengkap"
                          onChange={(e) => setFieldValue(field.name, e.target.value)}
                        />
                      </div>
                    )}
                  </Field>
                </FormItem>
                <div className="grid grid-cols-2 gap-5">
                  <FormItem
                    className="!mb-4"
                    invalid={errors.birthplace && touched.birthplace}
                    errorMessage={errors.birthplace}
                  >
                    <Field name="birthplace">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tempat Lahir <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.birthplace}
                            size="md"
                            placeholder="Masukan tempat lahir"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem className="!mb-4" invalid={errors.dob && touched.dob} errorMessage={errors.dob}>
                    <Field name="dob">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Tanggal Lahir<span className="text-red-600">*</span>
                          </p>
                          <DatePicker
                            inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                            inputFormat={'DD MMMM YYYY'}
                            placeholder="Pilih Tanggal (WIB)"
                            value={values?.dob}
                            onChange={(e) => {
                              let neutralDate = dayjs(e).hour(12).minute(0).second(0);
                              setFieldValue(field.name, neutralDate.toISOString());
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <FormItem
                    className="!mb-4"
                    invalid={errors.last_education && touched.last_education}
                    errorMessage={errors.last_education}
                  >
                    <Field name="last_education">
                      {({ field, form }) => {
                        const optionData = education?.map((option) => ({
                          value: option?.value,
                          label: option?.name,
                        }));

                        return (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Pendidikan Terakhir <span className="text-red-600">*</span>
                            </p>

                            <Select
                              size="md"
                              options={optionData}
                              onChange={(option) => {
                                form.setFieldValue(field.name, option.value);
                              }}
                              value={optionData.find((v) => v.value === values.last_education)}
                              placeholder="Pilih Pendidikan"
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </FormItem>
                  <FormItem
                    className="!mb-5"
                    invalid={errors.study_program && touched.study_program}
                    errorMessage={errors.study_program}
                  >
                    <Field name="study_program">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Jurusan <span className="text-red-600">*</span>
                          </p>
                          <Input
                            value={values?.study_program}
                            size="md"
                            placeholder="Masukan jurusan"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
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
  );
};

export default FormData;
