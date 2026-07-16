import { AdaptableCard } from 'components/shared';
import { Button, Dialog, Input } from 'components/ui';
import React, { useState, useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { openNotification } from 'components/custom/NotificationComponent';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiStore, apiDestroy, apiIndex, apiUpdate } from './api';
import CloseSvg from 'assets/svg/CloseSvg';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { PageConfig } from './config';
import { PageConfig as ModuleConfig } from '../../../config';

const ContentTestPage = () => {
  const { id, parentId } = useParams();
  const [dialogIsOpen, setIsOpen] = useState(false);
  const [dialogIsOpenDelete, setIsOpenDelete] = useState(false);
  const [data, setData] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: ModuleConfig.moduleTitle, path: `${ModuleConfig.detailModulelUrl + parentId}/assesment/${id}/question` },
    { label: 'Detail', path: `${ModuleConfig.detailModulelUrl + parentId}` },
    { label: PageConfig.moduleTitle, path: '' },
  ];
  const initialPackage = {
    course_item_id: id,
    template_id: 1,
    is_header: 1,
    weight_minimum: '',
    title: '',
    duration: '',
  };

  const [dataPackage, setDataPackage] = useState(initialPackage);
  const [initialValue, setInitialValue] = useState('');
  const onDialogClose = () => {
    setInitialValue('');
    setIsOpen(!dialogIsOpen);
  };

  const onDialogCloseDelete = () => {
    setIsOpenDelete(!dialogIsOpenDelete);
  };

  const editData = (val, idx) => {
    onDialogClose();
    setInitialValue({
      title: val.title || 'Asesmen ' + (idx + 1),
      weight_minimum: val.weight_minimum,
      duration: val.duration,
    });
    setDataPackage({
      ...dataPackage,
      id: val.id,
      title: val.title || 'Asesmen ' + (idx + 1),
      weight_minimum: val.weight_minimum,
      duration: val.duration,
    });
  };

  const addDataPackage = () => {
    onDialogClose();
    setInitialValue({
      title: 'Asesmen ' + (data.length + 1),
      weight_minimum: 0,
      duration: 0,
    });
    setDataPackage({ ...dataPackage, title: 'Asesmen ' + (data.length + 1), weight_minimum: 0, duration: 0 });
  };

  const deleteData = (data) => {
    onDialogCloseDelete();
    setDataPackage(data);
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await apiDestroy(dataPackage?.id);
      openNotification('Success', 'success', 'Berhasil hapus data');
      getData();
      onDialogCloseDelete();
    } catch (error) {
      openNotification('Error', 'danger', 'Error saving data: ' + error);
    }
    setDataPackage(initialPackage);
    setLoadingDelete(false);
  };

  const getData = async () => {
    try {
      const params = {
        q: '',
        type: 'collection',
        order_by: 'id',
        sort_by: 'asc',
        options: [
          'filter,template.exam_template_type,equal,1',
          'filter,parent_id,is_null',
          'filter,courseItem.uuid,equal,' + id,
        ],
        relations: ['template', 'question', 'child', 'courseItem.module'].join(),
      };
      const response = await apiIndex(params);
      let val = response?.data?.data?.map((dt) => {
        let det = { ...dt };
        det.duration = dt.duration ? parseFloat(dt.duration).toFixed(0) : 0;
        return det;
      });
      setData(val);
    } catch (error) {
      openNotification('Error fetching data:', 'danger', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={`${ModuleConfig.detailModulelUrl + parentId}?page=assessment`}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{PageConfig.pageTitle}</div>
        </div>
      </div>
      <AdaptableCard bodyClass="!p-6" className="rounded-2xl border-none">
        <div className="text-black text-xl font-normal font-opificio mb-5 flex justify-between items-center">
          <span>{PageConfig.moduleTitle}</span>
        </div>

        <div>
          {data.map((dt, index) => (
            <div key={index} className="px-6 py-4 rounded-xl border border-stone-300 mb-5">
              <div className="relative mb-6">
                <div className="w-[930px] text-slate-600 text-sm font-normal font-goth leading-[21px]">Paket Soal</div>
                <div className="text-blue-950 text-xl font-normal font-opificio">{dt?.title}</div>
                <img
                  src="/img/icon/icon-trash.svg"
                  className="absolute top-0 right-0 w-6 h-6 cursor-pointer"
                  onClick={() => deleteData(dt)}
                  alt=""
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => navigate(`/training/module/detail/${parentId}/assesment/${id}/question/${dt.id}`)}
                    type="button"
                    size="custome"
                    className="p-0"
                  >
                    <div className="text-center space-x-2 text-black flex items-center text-sm font-normal font-goth leading-[21px]">
                      <img src="/img/icon/Icons-plus.svg" alt="" />
                      <span className="mt-1 text-center text-black text-sm font-normal font-goth leading-[21px]">
                        Tambah Soal
                      </span>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => editData(dt, index)}
                    variant="plain"
                    size="custome"
                    className="rounded-lg border border-black "
                  >
                    <div className="text-center space-x-2 text-black flex items-center text-sm font-normal font-goth leading-[21px]">
                      <img src="/img/icon/Icons-edit.svg" alt="" />
                      <span className="mt-1 text-center text-black text-sm font-normal font-goth leading-[21px]">
                        Edit Sesi
                      </span>
                    </div>
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-blue-950 px-4 py-1 bg-gray-50 rounded-xl border border-stone-200 flex items-center justify-center space-x-2">
                    <div className="mt-1 text-sm font-normal font-goth leading-[21px]">Total Soal</div>
                    <div className="text-xl font-normal font-opificio">{dt?.count_question ?? 0}</div>
                  </div>
                  <div className="text-blue-950 px-4 py-1 bg-gray-50 rounded-xl border border-stone-200 flex items-center justify-center space-x-2">
                    <div className="mt-1 text-sm font-normal font-goth leading-[21px]">Durasi</div>
                    <div className="text-xl font-normal font-'Opificio Neue'">{dt?.duration}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            onClick={() => addDataPackage()}
            className="p-3 h-12 w-full"
            icon={<img src="/img/icon/btn-plus.svg" alt="" />}
          >
            <div className="text-center text-blue-950 text-base font-semibold font-goth">Tambah Asesmen</div>
          </Button>

          <DialogNotification
            isOpen={dialogIsOpen}
            onClose={onDialogClose}
            dataPackage={dataPackage}
            initialValue={initialValue}
            onRefresh={getData}
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
    </div>
  );
};

const DialogNotification = ({ isOpen, onClose, initialValue, dataPackage, onRefresh }) => {
  const handleSave = async ({ weight_minimum, duration }) => {
    try {
      let param = {
        ...dataPackage,
        weight_minimum: weight_minimum,
        duration: duration,
      };
      dataPackage.id ? await apiUpdate(dataPackage.id, param) : await apiStore(param);
      openNotification('Success', 'success', 'Berhasil simpan data');
      onRefresh();
      onClose();
    } catch (error) {
      openNotification('Error', 'danger', 'Error saving data: ' + error);
    }
  };

  const validationSchema = Yup.object().shape({
    weight_minimum: Yup.number()
      .required('Wajib diisi')
      .typeError('Harus berupa angka')
      .positive('Harus lebih dari 0')
      .max(100, 'Tidak boleh lebih dari 100'),
    duration: Yup.number().required('Wajib diisi'),
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} closable={false}>
      <div className="mb-1 flex items-center justify-between">
        <div className=" text-blue-950 text-xl font-normal font-opificio">{dataPackage.title}</div>
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
                    <div className="text-black text-sm font-normal font-goth leading-[21px]">
                      Nilai Kelulusan Minimum
                    </div>
                    <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                  </div>
                  <Field name="weight_minimum" placeholder="Masukin nilai kelulusan minimum">
                    {({ field, form }) => (
                      <div>
                        <Input
                          value={values.weight_minimum}
                          placeholder="Masukin nilai kelulusan minimum"
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.target.value);
                          }}
                        />
                      </div>
                    )}
                  </Field>

                  <ErrorMessage name="weight_minimum" component="div" className="field-error" />
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
