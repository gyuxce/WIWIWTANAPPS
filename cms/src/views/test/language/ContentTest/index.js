import { AdaptableCard } from 'components/shared';
import { Button, Dialog, Input } from 'components/ui';
import React, { useState, useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { openNotification } from 'components/custom/NotificationComponent';
import { useNavigate } from 'react-router-dom';

import {
  apiAddContentLanguage,
  apiDeleteContentLanguage,
  apiGetPratestLanguage,
  apiUpdateContentLanguage,
} from '../api/api';
import CloseSvg from 'assets/svg/CloseSvg';
const ContentTestPage = () => {
  const [dialogIsOpen, setIsOpen] = useState(false);
  const [dialogIsOpenDelete, setIsOpenDelete] = useState(false);
  const [sesi, setSesi] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate();
  const initialSesi = {
    template_id: 2,
    is_header: 1,
    title: '',
    duration: '',
  };

  const [dataSesi, setDataSesi] = useState(initialSesi);
  const [initialValue, setInitialValue] = useState('');
  const onDialogClose = () => {
    setInitialValue('');
    setIsOpen(!dialogIsOpen);
  };

  const onDialogCloseDelete = () => {
    setIsOpenDelete(!dialogIsOpenDelete);
  };

  const editDataSesi = ({ id, title, duration }) => {
    onDialogClose();
    setInitialValue({
      title: title,
      duration: duration,
    });
    setDataSesi({ ...dataSesi, id: id, title: title, duration: duration });
  };

  const addDataSesi = () => {
    onDialogClose();
    setInitialValue({
      title: '',
      duration: 0,
    });
    setDataSesi({ ...dataSesi, title: '', duration: 0 });
  };
  const deleteDataSesi = (data) => {
    onDialogCloseDelete();
    setDataSesi(data);
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await apiDeleteContentLanguage(dataSesi?.id);
      openNotification('Success', 'success', 'Berhasil hapus data');
      getSesiContent();
      onDialogCloseDelete();
    } catch (error) {
      openNotification('Error', 'danger', 'Error saving data: ' + error);
    }
    setDataSesi(initialSesi);
    setLoadingDelete(false);
  };
  const getSesiContent = async () => {
    try {
      const response = await apiGetPratestLanguage();
      let new_value = response?.data?.data?.sesi.map((x) => {
        let det = { ...x };
        det.duration = parseFloat(x.duration).toFixed(0);
        return det;
      });
      setSesi(new_value);
    } catch (error) {
      openNotification('Error fetching data:', 'danger', error);
    }
  };

  useEffect(() => {
    getSesiContent();
  }, []);

  return (
    <AdaptableCard className="rounded-2xl border-none">
      <div className="text-black text-xl font-normal font-opificio mb-5 flex justify-between items-center">
        <span>Sesi Konten Tes Bakat Bahasa</span>
      </div>

      <div>
        {sesi.map((sesiItem, index) => (
          <div key={index} className="px-6 py-4 rounded-xl border border-stone-300 mb-5">
            <div className="relative mb-6">
              <div className="text-blue-950 text-xl font-normal font-opificio">{sesiItem?.title}</div>
              <div className="w-[930px] text-slate-600 text-sm font-normal font-goth leading-[21px]">
                Sesi {index + 1} - Tes Bakat Bahasa
              </div>
              <img
                src="/img/icon/icon-trash.svg"
                className="absolute top-0 right-0 w-6 h-6 cursor-pointer"
                onClick={() => deleteDataSesi(sesiItem)}
                alt=""
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate(`/test/language/question/${sesiItem.id}`)}
                  type="button"
                  size="custome"
                  className="p-0"
                >
                  <div className="text-center space-x-2 text-black flex items-center text-sm font-normal font-goth leading-[21px]">
                    <img src="/img/icon/Icons-plus.svg" alt="" />{' '}
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                      Edit Soal
                    </span>
                  </div>
                </Button>
                <Button
                  type="button"
                  onClick={() => editDataSesi(sesiItem)}
                  variant="plain"
                  size="custome"
                  className="rounded-lg border border-black "
                >
                  <div className="text-center space-x-2 text-black flex items-center text-sm font-normal font-goth leading-[21px]">
                    <img src="/img/icon/Icons-edit.svg" alt="" />{' '}
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                      Edit Sesi
                    </span>
                  </div>
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-blue-950 px-4 py-1 bg-gray-50 rounded-xl border border-stone-200 flex items-center space-x-2">
                  <div className="text-sm font-normal font-goth leading-[21px]">Total Soal</div>
                  <div className="text-xl font-normal font-opificio">{sesiItem?.count_question ?? 0}</div>
                </div>
                <div className="text-blue-950 px-4 py-1 bg-gray-50 rounded-xl border border-stone-200 flex items-center space-x-2">
                  <div className="text-sm font-normal font-goth leading-[21px]">Durasi</div>
                  <div className="text-xl font-normal font-'Opificio Neue'">{sesiItem?.duration}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          onClick={() => addDataSesi()}
          className="p-3 h-12 w-full"
          icon={<img src="/img/icon/btn-plus.svg" alt="" />}
        >
          <div className="text-center text-blue-950 text-base font-semibold font-goth">Tambah Konten</div>
        </Button>

        <DialogNotification
          isOpen={dialogIsOpen}
          onClose={onDialogClose}
          dataSesi={dataSesi}
          initialValue={initialValue}
          onRefresh={getSesiContent}
        />

        <Dialog
          isOpen={dialogIsOpenDelete}
          onClose={() => onDialogCloseDelete}
          onRequestClose={() => onDialogCloseDelete}
          width={600}
          closable={false}
          className={'relative'}
        >
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => onDialogCloseDelete}
              variant="plain"
              size="xs"
              icon={
                <>
                  <CloseSvg />
                </>
              }
            />
          </div>
          <div className="flex flex-col p-4">
            <div className="flex justify-center">
              <img src="/img/icon/trash.png" alt="trash" className="h-[64px] w-[64px]" />
            </div>
            <div className="flex flex-col">
              <p className="text-h3 font-opificio text-black text-center mt-10">Anda akan menghapus data ini</p>
              <div className="flex justify-center mt-4">
                <p className="text-caption-b-goth text-second-500 text-center">
                  Data yang sudah dihapus tidak dapat dipulihkan. Klik "Kembali” untuk memastikan kembali.
                </p>{' '}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-8">
              <div className="flex justify-center">
                <Button
                  variant="default"
                  className="!py-0 mr-2"
                  style={{ height: '40px', width: '200px' }}
                  onClick={onDialogCloseDelete}
                >
                  <div className="text-black font-normal">Kembali</div>
                </Button>

                <Button
                  variant="default"
                  className="!py-0"
                  style={{ height: '40px', width: '200px' }}
                  onClick={() => handleDelete()}
                  loading={loadingDelete}
                  disabled={loadingDelete}
                >
                  <div className="text-black font-normal">Hapus</div>
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </AdaptableCard>
  );
};

const DialogNotification = ({ isOpen, onClose, initialValue, dataSesi, onRefresh }) => {
  const handleSave = async ({ title, duration }) => {
    try {
      let param = {
        ...dataSesi,
        title: title,
        duration: duration,
      };
      dataSesi.id ? await apiUpdateContentLanguage(dataSesi.id, param) : await apiAddContentLanguage(param);
      openNotification('Success', 'success', 'Berhasil simpan data');
      onRefresh();
      onClose();
    } catch (error) {
      openNotification('Error', 'danger', 'Error saving data: ' + error);
    }
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Input Nama Sesi'),
    duration: Yup.number().required('Input Durasi Sesi'),
  });
  return (
    <Dialog isOpen={isOpen} onClose={onClose} closable={false}>
      <div className="mb-1 flex items-center justify-between">
        <div className=" text-blue-950 text-xl font-normal font-opificio">
          {dataSesi.id ? 'Edit ' : 'Tambah '} Konten Tes Bakat Bahasa
        </div>
        <img src="/img/icon/icon-radix.svg" alt="" onClick={onClose} />
      </div>

      {initialValue !== '' ? (
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSave(values);
            setSubmitting(true);
          }}
        >
          {({ values, isSubmitting, handleSubmit, setSubmitting }) => (
            <div>
              <Form>
                <div className="mt-4 mb-2">
                  <div className="justify-start items-center gap-0.5 inline-flex mb-2">
                    <div className="text-black text-sm font-normal font-goth leading-[21px]">Input Nama Sesi</div>
                    <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                  </div>
                  <Field name="title" placeholder="Nama Sesi">
                    {({ field, form }) => (
                      <div>
                        <Input
                          value={values.title}
                          placeholder="Nama Sesi"
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.target.value);
                          }}
                        />
                      </div>
                    )}
                  </Field>

                  <ErrorMessage name="title" component="div" className="field-error" />
                </div>

                <div className="mt-4 mb-2">
                  <div className="justify-start items-center gap-0.5 inline-flex mb-2">
                    <div className="text-black text-sm font-normal font-goth leading-[21px]">Durasi (Menit)</div>
                    <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                  </div>
                  <Field name="duration" placeholder="Masukkan durasi dalam menit">
                    {({ field, form }) => (
                      <div>
                        <Input
                          value={values.duration}
                          placeholder="Masukkan durasi dalam menit"
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.target.value);
                          }}
                        />
                      </div>
                    )}
                  </Field>

                  <ErrorMessage name="duration" component="div" className="field-error" />
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

export default ContentTestPage;
