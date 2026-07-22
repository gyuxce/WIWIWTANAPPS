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
import { apiIndex as apiCourse } from 'views/training/category/api';
import { apiGetConstants } from 'services/AppService';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Wajib diisi'),
  course_id: Yup.string().required('Wajib diisi'),
  program_type: Yup.string().required('Wajib diisi'),
  level_module: Yup.string().required('Wajib diisi'),
});

const FormData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [course, setCourse] = useState([]);
  const [program, setProgram] = useState([]);
  const [level, setLevel] = useState([]);

  const getCourse = async () => {
    try {
      const ress = await apiCourse({ type: 'collection' });
      setCourse(ress.data?.data || []);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch course data'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

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

  const getLevel = async () => {
    try {
      const ress = await apiGetConstants({ data: 'training_level' });
      setLevel(ress.data || []);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch level data'}
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
        relations: 'course',
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
    getCourse();
    getProgram();
    getLevel();
  }, [id]);

  return (
    <Card bodyClass="!p-6" className="border-none rounded-xl">
      <Formik
        initialValues={{
          title: detail?.title || '',
          title_japan: detail?.title_japan || '',
          course_id: detail?.course?.id || '',
          program_type: detail?.program_type || '',
          level_module: detail?.level_module || '',
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
                          Nama Modul <span className="text-red-600">*</span>
                        </p>
                        <Input
                          value={values?.title}
                          size="md"
                          placeholder="Masukan nama Modul"
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
                        <p className="text-black leading-[21px] mb-2">Nama Modul (Jepang)</p>
                        <Input
                          value={values?.title_japan}
                          size="md"
                          placeholder="Masukan nama Modul dalam bahasa Jepang"
                          onChange={(e) => setFieldValue(field.name, e.target.value)}
                        />
                      </div>
                    )}
                  </Field>
                </FormItem>
                <FormItem invalid={errors.course_id && touched.course_id} errorMessage={errors.course_id}>
                  <Field name="course_id">
                    {({ field, form }) => {
                      const optionData = course?.map((option) => ({
                        value: option?.id,
                        label: option?.title,
                      }));

                      return (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Kategori Modul <span className="text-red-600">*</span>
                          </p>

                          <Select
                            size="md"
                            options={optionData}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option.value);
                            }}
                            value={optionData.find((v) => v.value === values.course_id)}
                            placeholder="Pilih Kategori Modul"
                          />
                        </div>
                      );
                    }}
                  </Field>
                </FormItem>
                <FormItem invalid={errors.program_type && touched.program_type} errorMessage={errors.program_type}>
                  <Field name="program_type">
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
                            value={optionData.find((v) => v.value === values.program_type)}
                            placeholder="Pilih Program Pelatihan Modul"
                          />
                        </div>
                      );
                    }}
                  </Field>
                </FormItem>
                <FormItem invalid={errors.level_module && touched.level_module} errorMessage={errors.level_module}>
                  <Field name="level_module">
                    {({ field, form }) => {
                      const optionData = level?.map((option) => ({
                        value: option?.value,
                        label: option?.name,
                      }));

                      return (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Level <span className="text-red-600">*</span>
                          </p>

                          <Select
                            size="md"
                            options={optionData}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option.value);
                            }}
                            value={optionData.find((v) => v.value === values.level_module)}
                            placeholder="Pilih Level Modul"
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
  );
};

export default FormData;
