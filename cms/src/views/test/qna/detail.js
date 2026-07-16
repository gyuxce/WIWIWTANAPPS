import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams } from 'react-router-dom';
import { apiShow, apiUpdate } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input, Select, Dialog } from 'components/ui';
import StatusBadge from 'components/ui/StatusBadge';
import { PageConfig } from './config';
import { Field, FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, TrashIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import DateTimepicker from 'components/ui/DatePicker/DateTimepicker';
import classNames from 'classnames';
import { STATUS_USER_EXAM, STATUS_USER_EXAM_OPTION } from 'components/ui/utils/constant';
import Breadcrumbs from 'components/ui/Breadcrumbs';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  link: Yup.string().url('Invalid URL').required('Wajib diisi'),
  exam_schedules: Yup.array().of(
    Yup.object().shape({
      id: Yup.string(),
      start_date: Yup.string().required('Wajib diisi').nullable(),
    }),
  ),
});

const Detail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [statusSert, setStatusSer] = useState(7);
  const [isLoadingStatus, setIsLoadinStatus] = useState(false);
  const [dialogIsOpen, setIsOpenDialog] = useState(false);
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: PageConfig.url },
    { label: 'Detail Sesi QnA', path: '' },
  ];

  const getData = async () => {
    try {
      const params = {
        relations: 'user,exam_schedules,exam_schedule_active',
        type_pratest: 'qna',
      };
      const ress = await apiShow(id, params);
      setDetail(ress?.data?.data);
      setStatusSer(ress?.data?.data?.status);
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

  const onSubmitStatus = async () => {
    setIsLoadinStatus(true);
    let body = {
      status: statusSert,
    };
    if ([STATUS_USER_EXAM.LULUS, STATUS_USER_EXAM.TIDAK_LULUS].includes(statusSert)) {
      body = { ...body, finished_at: dayjs().format('YYYY-MM-DD, HH:mm:ss') };
    }
    await onSubmit(body);
    onDialogClose();
    setIsLoadinStatus(false);
  };

  const onSubmitSchedule = async (values) => {
    const schedules = values?.exam_schedules?.map((exam) => ({
      id: exam?.id,
      start_date: exam?.start_date ? dayjs(exam?.start_date).format('YYYY-MM-DD, HH:mm:ss') : null,
    }));
    const body = {
      ...values,
      exam_schedules: schedules,
    };
    await onSubmit(body);
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
      getData();
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

  const onDialogClose = () => {
    setIsOpenDialog(false);
  };

  useEffect(() => {
    getData();
  }, [id]);
  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">Tambah Jadwal</div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl mb-7">
        <div className=" text-black text-xl font-normal font-opificio mb-5">Status Sertifikasi</div>
        <div className="mb-5">
          <p className="text-gray-800 font-bold leading-[21px] mb-2">
            Status <span className="text-red-600">*</span>
          </p>
          <Select
            size="md"
            isDisabled={[STATUS_USER_EXAM.LULUS, STATUS_USER_EXAM.TIDAK_LULUS].includes(detail?.status)}
            options={STATUS_USER_EXAM_OPTION?.filter((item) => item?.value > STATUS_USER_EXAM.MENUNGGU)}
            onChange={(option) => {
              setStatusSer(option?.value || '');
            }}
            value={STATUS_USER_EXAM_OPTION?.filter((item) => item?.value > STATUS_USER_EXAM.MENUNGGU).find(
              (v) => v.value === statusSert,
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={[STATUS_USER_EXAM.LULUS, STATUS_USER_EXAM.TIDAK_LULUS].includes(detail?.status)}
            loading={isLoadingStatus}
            onClick={() => (statusSert === 7 ? onSubmitStatus() : setIsOpenDialog(true))}
            className="w-[200px] h-12 p-3 mb-2"
          >
            <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
          </Button>
        </div>
      </Card>
      <Card bodyClass="!p-6" className="border-none rounded-xl">
        <div className=" text-black text-xl font-normal font-opificio mb-5">Form Sesi QnA</div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Nama Siswa</span>
          <span>{detail?.user?.name}</span>
        </div>
        <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
          <span>Status Pra Tes</span>
          <StatusBadge
            text={`${detail?.status_pratest || 0}/2 Selesai`}
            color={detail?.status_pratest === 2 ? 'green' : detail?.status_pratest === 1 ? 'blue' : 'red'}
          />
        </div>
        <Formik
          initialValues={{
            link: detail?.link || '',
            exam_schedules:
              detail?.exam_schedules?.length > 0
                ? detail?.exam_schedules?.map((item) => ({
                    id: item?.id,
                    start_date: item?.start_date ? new Date(item?.start_date) : null,
                  }))
                : [
                    {
                      id: '',
                      start_date: '',
                    },
                  ],
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await onSubmitSchedule(values);
            setSubmitting(false);
          }}
        >
          {({ values, touched, errors, setFieldValue, isSubmitting }) => {
            return (
              <Form>
                <FormContainer className="text-sm">
                  <FormItem invalid={errors.link && touched.link} errorMessage={errors.link}>
                    <Field name="link">
                      {({ field }) => (
                        <div>
                          <p className="text-black leading-[21px] mb-2">
                            Input Tautan Sesi QnA <span className="text-red-600">*</span>
                          </p>
                          <Input
                            disabled={detail?.status_pratest !== 2}
                            value={values?.link}
                            size="md"
                            placeholder="Enter name here"
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <div className="p-4 border border-stone-300 rounded-xl mb-5">
                    <FieldArray
                      name="exam_schedules"
                      render={(arrayHelpers) => (
                        <>
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-black font-semibold text-sm font-century-gothic">
                              Pilih Tanggal dan Waktu Sesi
                            </div>
                            <Button
                              icon={<PlusIcon />}
                              disabled={detail?.status_pratest !== 2 || detail?.exam_schedule_active?.id}
                              type="button"
                              onClick={() => arrayHelpers.push({ id: '', start_date: '' })}
                              className="bg-white flex items-center !shadow-none"
                            >
                              <div className="mt-1 ml-1 !font-goth !font-normal">Tambah Sesi</div>
                            </Button>
                          </div>
                          <div>
                            {values?.exam_schedules?.map((exam, index) => (
                              <div key={index}>
                                <FormItem
                                  invalid={
                                    errors.exam_schedules?.[index]?.start_date &&
                                    touched.exam_schedules?.[index]?.start_date
                                  }
                                  errorMessage={errors.exam_schedules?.[index]?.start_date}
                                >
                                  <Field name={`exam_schedules.${index}.start_date`}>
                                    {({ field, form }) => (
                                      <div>
                                        <p className="text-black leading-[21px] mb-2">
                                          Tanggal dan Waktu (WIB)<span className="text-red-600">*</span>
                                        </p>
                                        <div className="flex items-center gap-1">
                                          <div className="flex-1">
                                            <DateTimepicker
                                              disabled={
                                                detail?.status_pratest !== 2 ||
                                                (detail?.exam_schedule_active?.id &&
                                                  exam?.id !== detail?.exam_schedule_active?.id)
                                              }
                                              amPm={false}
                                              field={field}
                                              form={form}
                                              inputFormat="DD MMMM YYYY, HH:mm"
                                              placeholder="Pilih Tanggal dan Waktu (WIB)"
                                              value={values?.exam_schedules[index]?.start_date || ''}
                                              inputSuffix={
                                                <img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />
                                              }
                                              onChange={(date) => {
                                                form.setFieldValue(field.name, date);
                                              }}
                                            />
                                          </div>
                                          <Button
                                            disabled={
                                              (!detail?.exam_schedule_active?.id && index === 0) ||
                                              detail?.status_pratest !== 2 ||
                                              exam?.id === detail?.exam_schedule_active?.id
                                            }
                                            type="button"
                                            onClick={() => arrayHelpers.remove(index)}
                                            className={classNames(
                                              '!border !shadow-none !border-slate-300 rounded-md',
                                              ((!detail?.exam_schedule_active?.id && index === 0) ||
                                                detail?.status_pratest !== 2 ||
                                                exam?.id === detail?.exam_schedule_active?.id) &&
                                                'bg-stone-300',
                                            )}
                                            icon={
                                              <TrashIcon
                                                height={28}
                                                width={28}
                                                color={
                                                  (!detail?.exam_schedule_active?.id && index === 0) ||
                                                  detail?.status_pratest !== 2 ||
                                                  exam?.id === detail?.exam_schedule_active?.id
                                                    ? '#A8A29E'
                                                    : '#C63838'
                                                }
                                              />
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </Field>
                                </FormItem>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </FormContainer>
                <div className="flex justify-end">
                  <Button
                    loading={isSubmitting}
                    disabled={detail?.status_pratest !== 2}
                    type="submit"
                    className="w-[200px] h-12 p-3 mb-2"
                  >
                    <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Card>
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
        width={600}
        closable={false}
        className={'relative'}
      >
        <div className="flex flex-col p-4">
          <div className="flex justify-center">
            <ExclamationTriangleIcon height={64} width={64} color="#C63838" />
          </div>
          <div className="flex flex-col">
            <p className="text-h3 font-opificio text-black text-center mt-10">
              {statusSert === 5
                ? 'Lanjutkan progres siswa ke tahap pembayaran?'
                : 'Progres siswa akan terhenti sampai disini.'}
            </p>
            <div className="flex justify-center mt-4">
              <p className="font-goth text-second-500 text-center">
                {statusSert === 5
                  ? 'Status yang sudah di konfirmasi, tidak dapat dipulihkan. Pastikan siswa sudah mencapai target kelulusan minimum..'
                  : 'Status yang sudah di konfirmasi, tidak dapat dipulihkan. Siswa akan diarahkan untuk menghapus akunnya.'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex justify-center gap-2">
              <Button variant="default" className="!py-0 h-10 w-[200px]" onClick={onDialogClose}>
                <div className="text-black font-normal">Tidak, Kembali</div>
              </Button>

              <Button
                loading={isLoadingStatus}
                variant="default"
                className="!py-0 h-10 w-[200px]"
                onClick={onSubmitStatus}
              >
                <div className="text-black font-normal">Ya, Konfirmasi</div>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Detail;
