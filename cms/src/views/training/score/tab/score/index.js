import { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import {
  apiExport,
  apiRepeatAssement,
  apiRepeatAssementVerbal,
  apiShow,
  apiUpdateNilai,
  apiUpdateNilaiAsesmenLisan,
} from './api';
import { PageConfig } from './config';
import { PageTable } from './table';
import { Notification, toast, Button, Dialog, Input } from 'components/ui';
import { ExclamationTriangleIcon, UploadIcon } from '@radix-ui/react-icons';
import { useParams } from 'react-router-dom';
import { countResult } from 'components/ui/utils/formatter';
import dayjs from 'dayjs';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import DateTimepicker from 'components/ui/DatePicker/DateTimepicker';
import { openNotification } from 'components/custom/NotificationComponent';
import * as Yup from 'yup';
import { exportData } from 'utils/helper/uploadfile';

const Score = () => {
  const firstLoad = useRef(true);
  const firstReq = useRef(true);
  const [ids, setIds] = useState([]);
  const { id } = useParams();
  const [checkboxList, setCheckboxList] = useState([]);
  const [dialogRepeatOpen, setDialogRepeatOpen] = useState(false);
  const [user, setUser] = useState();
  const [examTemplateItem, setExamTemplateItem] = useState();
  const [question, setQuestion] = useState([]);
  const [inputValueAssesmentVerbal, setInputValueAssesmentVerbal] = useState('');
  const [dialogAsesmenVerbalIsOpen, setIsOpenDialogAsesmentVerbal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const onDialogCloseAsesmentVerbal = () => {
    setIsOpenDialogAsesmentVerbal(!dialogAsesmenVerbalIsOpen);
  };

  const [localState, setLocalState] = useState({
    loading: false,
    data: [],
    meta: null,
    updated: null,
    params: {
      q: '',
      type: 'pagination',
      page: 1,
      limit: 10,
      order_by: 'updated_at',
      sort_by: 'desc',
      options: [],
      relations: [].join(),
    },
  });

  const getData = useCallback(async () => {
    try {
      setLocalState({
        ...localState,
        loading: true,
      });

      const resss = await apiShow(id, localState.params.relations);
      if (resss.data) {
        let detail = resss.data?.data?.data;
        let examTemplateItem = resss.data?.data?.data?.item;
        setUser(detail);
        setExamTemplateItem(examTemplateItem);
      }

      if (firstReq.current) {
        await new Promise((resolve) => setTimeout(resolve, 0));
        firstReq.current = false;
      }

      const answareUser = resss.data?.data?.answareUser || [];

      setLocalState({
        ...localState,
        loading: false,
        data: answareUser,
      });

      const transformedData = answareUser.map((el) => ({ id: el?.question?.id, a_weight: el.a_weight }));
      setQuestion(transformedData);
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
  }, [localState]);

  const onConfirm = async () => {
    try {
      if (examTemplateItem?.typeAssesment?.exam_template_type == 1) {
        await apiUpdateNilai({ id: user?.id, question: question });
      } else if (examTemplateItem?.typeAssesment?.exam_template_type == 5) {
        await apiUpdateNilaiAsesmenLisan({ id: user?.id, score_assesment: inputValueAssesmentVerbal });
      }

      toast.push(
        <Notification title="Sukses" type="success">
          Nilai siswa telah dikonfirmasi
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      getData(localState.params);
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

  const handleExport = async () => {
    setIsExporting(true);
    await exportData('xlsx', apiExport, `${user?.user?.name}_${user?.item?.title}_data`, id);
    setIsExporting(false);
  };

  const onRepeat = () => {
    setDialogRepeatOpen(true);
  };

  const onRepeatClose = () => {
    setDialogRepeatOpen(false);
  };

  const handleRepeat = async () => {
    try {
      await apiRepeatAssement({ id: user?.id });
      toast.push(
        <Notification title={'Sukses'} type="success" duration={2500}>
          Asesmen berhasil diulang
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      setDialogRepeatOpen(false);
      getData(localState.params);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      setDialogRepeatOpen(false);
    }
  };

  useEffect(() => {
    if (firstLoad.current) {
      getData(localState.params);
      firstLoad.current = false;
    }
  }, [getData, localState]);

  useEffect(() => {
    let x = [];

    for (let index = 0; index < PageConfig.listFields.length; index++) {
      const el = PageConfig.listFields[index];
      if (el.is_show) {
        x.push(el.key);
      }
    }
    setCheckboxList(x);
  }, []);

  useEffect(() => {
    if (user?.weight_total) {
      setInputValueAssesmentVerbal(user.weight_total);
    }
  }, [user?.weight_total]);

  const handleInputChange = (e) => {
    setInputValueAssesmentVerbal(e.target.value);
  };

  return (
    <>
      <div>
        <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
          <div className="mb-4 flex items-center content-center justify-between gap-4">
            <div className="flex items-center content-center gap-4">
              <div className="w-[60px] h-[60px] rounded-full bg-black">
                <img
                  src={user?.user?.profilePicture?.url}
                  className="w-[60px] h-[60px] object-cover rounded-full"
                  alt=""
                />
              </div>
              <div>
                <p className="text-blue-950 text-xl font-normal font-opificio">{user?.user?.name}</p>
                <div className="mt-2">
                  <span>Module : {user?.item?.title}</span> <br />
                  <span>Kategori Modul : {user?.course?.title}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                isAction
                icon={<UploadIcon />}
                type="button"
                loading={isExporting}
                onClick={handleExport}
                className="bg-white !px-3 !py-2 flex items-center !rounded"
              >
                <div className="mt-1 ml-1 !font-goth text-black !font-normal text-sm">Export Data</div>
              </Button>
              <Button
                isAction
                icon={<img src="/img/icon/checklist-icon.svg" alt="" style={{ height: '24px', width: '24px' }} />}
                type="button"
                onClick={onConfirm}
                className="bg-white !px-3 !py-2 flex items-center !rounded"
              >
                <div className="mt-1 ml-1 !font-goth text-black !font-normal text-sm">Konfirmasi</div>
              </Button>
            </div>
          </div>

          {examTemplateItem?.typeAssesment?.exam_template_type == 1 && (
            <>
              <div className="mb-[1.25rem]">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <span className="px-4 py-3 bg-gray-100 rounded-lg">
                      Total Poin {user?.userExam?.weight_total || '-'}
                    </span>
                    <span className="px-4 py-3 bg-gray-100 rounded-lg">
                      Poin diraih {user?.userExam?.weight_achieved || '-'}
                    </span>
                    <span className="px-4 py-3 bg-gray-100 rounded-lg">
                      Nilai Kelulusan Minimum {user?.weight_minimum || '-'}
                    </span>
                    <span className="px-4 py-3 bg-gray-100 rounded-lg">
                      Nilai Akhir {countResult(user?.userExam?.weight_achieved, user?.userExam?.weight_total)}
                    </span>
                  </div>
                  <div>
                    <Button
                      isAction
                      icon={<UploadIcon />}
                      type="button"
                      onClick={onRepeat}
                      className="bg-white !px-3 !py-4 flex items-center !rounded"
                    >
                      <div className="mt-1 ml-1 !font-goth text-black !font-normal text-sm">Asesmen Ulang</div>
                    </Button>
                  </div>
                </div>
              </div>

              <PageTable
                localState={localState}
                question={question}
                setQuestion={setQuestion}
                setLocalState={setLocalState}
                getData={getData}
                setIds={setIds}
                bulk_ids={ids}
                checkboxList={checkboxList}
              />
            </>
          )}

          {examTemplateItem?.typeAssesment?.exam_template_type == 5 && (
            <>
              <div className="mb-[1.25rem]">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <span className="px-4 py-3 bg-gray-100 rounded-lg">
                      Nilai Kelulusan Minimum {examTemplateItem?.weight_minimum || '-'}
                    </span>
                    <span className="px-4 py-3 bg-gray-100 rounded-lg">Nilai Akhir {user?.weight_total || '-'}</span>
                  </div>
                  <div>
                    <Button
                      isAction
                      icon={<UploadIcon />}
                      type="button"
                      onClick={() => {
                        setIsOpenDialogAsesmentVerbal(!dialogAsesmenVerbalIsOpen);
                      }}
                      className="bg-white !px-3 !py-4 flex items-center !rounded"
                    >
                      <div className="mt-1 ml-1 !font-goth text-black !font-normal text-sm">Asesmen Ulang</div>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-[24px] ml-[4px]">
                <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5 mt-3">
                  <span>Tanggal dan Waktu</span>
                  <span>{user?.working_date ? dayjs(user?.working_date).format('DD MMMM YYYY, HH:mm WIB') : '-'}</span>
                </div>
                <div>
                  <p className="text-black leading-[21px] mb-2">
                    Input Nilai <span className="text-red-600">*</span>
                  </p>
                  <Input
                    value={user?.weight_total ?? inputValueAssesmentVerbal}
                    onChange={handleInputChange}
                    size="md"
                    placeholder="Masukan nilai"
                  />
                </div>
              </div>
            </>
          )}
        </AdaptableCard>
        <Dialog
          isOpen={dialogRepeatOpen}
          onClose={onRepeatClose}
          onRequestClose={onRepeatClose}
          width={600}
          className={'relative'}
        >
          <div className="flex flex-col p-4">
            <div className="flex justify-center">
              <ExclamationTriangleIcon height={64} width={64} color="#C63838" />
            </div>
            <div className="flex flex-col">
              <p className="text-h3 font-opificio text-black text-center mt-10">
                Anda akan memberikan akses untuk asesmen ulang
              </p>
              <div className="flex justify-center mt-4">
                <p className="font-goth text-[#78716C] text-center">
                  Nilai yang sudah di submit akan tersimpan di log dan nilai yang akan digunakan adalah nilai terakhir.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-8">
              <div className="flex justify-center gap-2">
                <Button variant="default" className="!py-0 h-10 w-[200px]" onClick={onRepeatClose}>
                  <div className="font-goth text-black font-normal">Tidak, Kembali</div>
                </Button>

                <Button variant="default" className="!py-0 h-10 w-[200px]" onClick={handleRepeat}>
                  <div className="font-goth text-black font-normal">Ya, Lanjutkan</div>
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
        <DialogAsesmenVerbal isOpen={dialogAsesmenVerbalIsOpen} onClose={onDialogCloseAsesmentVerbal} user={user} />
      </div>
    </>
  );
};

const DialogAsesmenVerbal = ({ isOpen, onClose, initialValue, user }) => {
  const handleSave = async ({ working_date, link }) => {
    try {
      let ress = await apiRepeatAssementVerbal({ id: user?.id, working_date: working_date, link: link });
      console.log('dataaa', ress);
      openNotification('Success', 'success', 'Berhasil simpan data');
      onClose();
      window.location.href = '/training/score/detail/' + ress?.data?.data?.uuid;
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      onClose();
    }
  };
  const validationSchema = Yup.object().shape({
    link: Yup.string().url('Invalid URL').required('Wajib diisi'),
    working_date: Yup.string().required('Wajib diisi'),
  });
  return (
    <Dialog isOpen={isOpen} onClose={onClose} closable={false}>
      <div className="mb-1 flex items-center justify-between">
        <div className=" text-blue-950 text-xl font-normal font-opificio">Jadwal Asesmen Lisan</div>
        <img src="/img/icon/icon-radix.svg" alt="" onClick={onClose} />
      </div>

      {initialValue !== '' ? (
        <Formik
          // initialValues={initialValue}
          initialValues={{
            working_date: null,
            link: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSave(values);
            setSubmitting(true);
          }}
        >
          {({ values, isSubmitting, handleSubmit, setFieldValue, setSubmitting }) => (
            <div>
              <Form>
                <div className="mt-4 mb-2">
                  <div className="justify-start items-center gap-0.5 inline-flex mb-2">
                    <div className="text-black text-sm font-normal font-goth leading-[21px]">
                      Tanggal dan Waktu (WIB)
                    </div>
                    <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                  </div>
                  <Field name="working_date">
                    {({ field, form }) => (
                      <div>
                        <DateTimepicker
                          amPm={false}
                          field={field}
                          form={form}
                          inputFormat="DD MMMM YYYY, HH:mm"
                          placeholder="Pilih Tanggal dan Waktu (WIB)"
                          value={values?.working_date || ''}
                          inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                          onChange={(date) => {
                            setFieldValue(field.name, date);
                          }}
                        />
                      </div>
                    )}
                  </Field>

                  <ErrorMessage name="working_date" component="div" className="field-error" />
                </div>

                <div className="mt-4 mb-2">
                  <div className="justify-start items-center gap-0.5 inline-flex mb-2">
                    <div className="text-black text-sm font-normal font-goth leading-[21px]">Link</div>
                    <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                  </div>
                  <Field name="link" placeholder="Masukkan link">
                    {({ field, form }) => (
                      <div>
                        <Input
                          value={values.link}
                          placeholder="Masukkan link"
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.target.value);
                          }}
                        />
                      </div>
                    )}
                  </Field>

                  <ErrorMessage name="link" component="div" className="field-error" />
                </div>
              </Form>
              <div className="h-5"></div>

              <Button
                type="button"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={() => {
                  setSubmitting(true);
                  handleSubmit();
                }}
                style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
                className="w-full h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex"
              >
                <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">Konfirmasi</div>
              </Button>
            </div>
          )}
        </Formik>
      ) : (
        ''
      )}
    </Dialog>
  );
};

export default Score;
