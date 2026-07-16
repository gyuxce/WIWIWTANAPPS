import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { apiUpdate, apiShow } from '../../api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input, Select } from 'components/ui';
import { PageConfig } from '../../config';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { apiIndex as apiCourse } from 'views/training/category/api';
import { apiIndex as apiCourseItem } from 'views/training/module/api';
import { apiGetConstants } from 'services/AppService';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Wajib diisi'),
  course_id: Yup.string().required('Wajib diisi'),
  program_type: Yup.string().required('Wajib diisi'),
  parent_id: Yup.string().required('Wajib diisi'),
});

const FormData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detail, setDetail] = useState({});

  const [course, setCourse] = useState([]);
  const [program, setProgram] = useState([]);
  const [courseItem, setCourseItem] = useState([]);

  const getData = async () => {
    try {
      const params = {
        options: ['filter,is_header,is_not_null'],
        relations: ['course', 'module'].join(),
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

  const getCourseItem = async () => {
    try {
      const ress = await apiCourseItem({
        type: 'collection',
        options: ['filter,is_header,is_not_null'],
        order_by: 'updated_at',
        sort_by: 'desc',
      });
      setCourseItem(ress.data?.data || []);
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

  const onSubmit = async (body) => {
    try {
      await apiUpdate(id, body);
      toast.push(
        <Notification title="Sukses" type="success">
          Berhasil membuat data
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
    getCourseItem();
  }, []);

  return (
    <Card bodyClass="!p-6" className="border-none rounded-xl">
      <Formik
        initialValues={{
          title: detail?.title || '',
          course_id: detail?.course?.id || '',
          program_type: detail?.program_type || '',
          parent_id: detail?.module?.id || '',
          group: 1,
          is_header: null,
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
                <FormItem className="mb-3" invalid={errors.title && touched.title} errorMessage={errors.title}>
                  <Field name="title">
                    {({ field }) => (
                      <div>
                        <p className="text-black leading-[21px] mb-2">
                          Nama Modul <span className="text-red-600">*</span>
                        </p>
                        <Input
                          value={values?.title}
                          size="md"
                          placeholder="Masukan nama Materi"
                          onChange={(e) => setFieldValue(field.name, e.target.value)}
                        />
                      </div>
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  className="mb-3"
                  invalid={errors.program_type && touched.program_type}
                  errorMessage={errors.program_type}
                >
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
                <FormItem
                  className="mb-3"
                  invalid={errors.course_id && touched.course_id}
                  errorMessage={errors.course_id}
                >
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

                <FormItem
                  className="mb-5"
                  invalid={errors.parent_id && touched.parent_id}
                  errorMessage={errors.parent_id}
                >
                  <Field name="parent_id">
                    {({ field, form }) => {
                      const optionData = courseItem?.map((option) => ({
                        value: option?.id,
                        label: option?.title,
                      }));

                      return (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Modul Pelatihan <span className="text-red-600">*</span>
                          </p>

                          <Select
                            size="md"
                            options={optionData}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option.value);
                            }}
                            value={optionData.find((v) => v.value === values.parent_id)}
                            placeholder="Pilih Modul Pelatihan"
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
