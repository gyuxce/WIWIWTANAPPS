import React, { useState, useEffect } from 'react';
import Card from 'components/ui/Card';
import Select from 'components/ui/Select';
import Input from 'components/ui/Input';
import { apiGetPhase } from './api';
import { apiSetting, apiSettingUpdate } from 'services/ApiBase';
import { FormContainer, FormItem, Notification, toast } from 'components/ui';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  phase: Yup.string().required('Wajib diisi'),
  admin_ssw: Yup.string().max(15, 'tidak boleh lebih dari 15 karakter').required('Wajib diisi'),
  admin_pelatihan: Yup.string().max(15, 'tidak boleh lebih dari 15 karakter').required('Wajib diisi'),
  admin_titp: Yup.string().max(15, 'tidak boleh lebih dari 15 karakter').required('Wajib diisi'),
});

const Sistem = () => {
  const bahasaOption = [{ value: 'Jepang', label: 'Jepang' }];
  const [faseOption, setFaseOption] = useState([
    { value: 'Sertifikasi Bahasa Jepang', label: 'Sertifikasi Bahasa Jepang', index: 0 },
  ]);
  const [detail, setDetail] = useState();

  const getListFaseData = async () => {
    try {
      const ress = await apiGetPhase();
      let mapping = ress.data.map((x, index) => {
        let det = x;
        det.label = x.name;
        det.value = x.value;
        det.index = index;
        return det;
      });
      setFaseOption(mapping);
      return mapping;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const ress = await apiSetting();
      let adminSSWfind = await ress.data?.data?.find((x) => x.slug == 'nomor-whatsapp-admin-ssw');
      let adminTITPfind = await ress.data?.data?.find((x) => x.slug == 'nomor-whatsapp-admin-titp');
      let adminPelatihanfind = await ress.data?.data?.find((x) => x.slug == 'nomor-whatsapp-admin-program-pelatihan');
      let fase = await ress.data?.data?.find((x) => x.slug == 'fase');
      setDetail({
        admin_ssw: adminSSWfind?.value,
        admin_pelatihan: adminPelatihanfind?.value,
        admin_titp: adminTITPfind?.value,
        phase: fase?.value,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getListFaseData();
    fetchData();
  }, []);

  const handleSubmit = async (body) => {
    try {
      let value = [
        {
          slug: 'fase',
          value: body?.phase,
        },
        {
          slug: 'nomor-whatsapp-admin-ssw',
          value: body?.admin_ssw,
        },
        {
          slug: 'nomor-whatsapp-admin-titp',
          value: body?.admin_titp,
        },
        {
          slug: 'nomor-whatsapp-admin-program-pelatihan',
          value: body?.admin_pelatihan,
        },
      ];
      await apiSettingUpdate({
        settings: value,
      });
      toast.push(
        <Notification title={'Success'} type="success">
          {'Berhasil Update data'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch data'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  return (
    <div className="-mt-7">
      <Formik
        initialValues={{
          admin_ssw: detail?.admin_ssw || '',
          admin_pelatihan: detail?.admin_pelatihan || '',
          admin_titp: detail?.admin_titp || '',
          phase: detail?.phase || '',
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ values, touched, errors, setFieldValue, isSubmitting }) => {
          return (
            <Form>
              <div className="bg-blue-950 w-full px-7 relative z-0">
                <div className="flex items-center justify-between py-10">
                  <div className="text-white text-[28px] font-normal font-opificio">Pengaturan Sistem</div>
                  <div className="h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex">
                    <button
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="text-center text-black text-sm font-normal font-goth leading-[21px] cursor-pointer"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-blue-950 absolute top-0 left-0 h-[80px] w-full z-0"></div>
                <div className="px-7 relative z-10">
                  <Card className="rounded-lg bg-white px-6 py-8 ">
                    <div className="text-blue-950 text-xl font-normal font-opificio">Pengaturan Bahasa</div>
                    <div className="my-4">
                      <div className="text-left text-black text-sm font-normal font-goth leading-[21px]">
                        Catatan: Sistem akan merubah aksesibilitas bahasa di aplikasi wiwitan , jika siswa sudah masuk
                        ke Fase yang sudah di tentukan.
                      </div>
                    </div>

                    <FormContainer className="text-sm">
                      <div className="grid grid-cols-2 gap-5">
                        <FormItem>
                          <Field>
                            {() => {
                              return (
                                <div>
                                  <p className="text-gray-800 font-normal font-goth leading-[21px] mb-2">Bahasa</p>
                                  <Select
                                    placeholder="Please Select"
                                    size="md"
                                    isDisabled
                                    options={bahasaOption}
                                    defaultValue={bahasaOption[0]}
                                    className={'bg-slate-100'}
                                    styles={{ backgroundColor: '#F1F5F9' }}
                                  />
                                </div>
                              );
                            }}
                          </Field>
                        </FormItem>
                        <FormItem invalid={errors.phase && touched.phase} errorMessage={errors.phase}>
                          <Field name="phase">
                            {({ field, form }) => {
                              return (
                                <div>
                                  <p className="text-gray-800 font-normal font-goth leading-[21px] mb-2">
                                    Fase <span className="text-red-600">*</span>
                                  </p>

                                  <Select
                                    size="md"
                                    options={faseOption}
                                    onChange={(option) => {
                                      form.setFieldValue(field.name, option.value);
                                    }}
                                    value={faseOption.find((v) => v.value == values.phase)}
                                    placeholder="Please Select"
                                  />
                                </div>
                              );
                            }}
                          </Field>
                        </FormItem>
                      </div>

                      <div className="divider mt-3 mb-8 w-full">
                        <img src="/img/others/Divider.svg" className="h-2" alt="" />
                      </div>

                      <div className="">
                        <div className="text-blue-950 text-xl font-normal font-opificio mb-4">Daftar Kontak Admin</div>
                        <FormItem invalid={errors.admin_ssw && touched.admin_ssw} errorMessage={errors.admin_ssw}>
                          <Field name="admin_ssw">
                            {({ field }) => (
                              <div>
                                <p className="text-black leading-[21px] mb-2">
                                  Nomor Whatsapp Admin 1 <span className="text-red-600">*</span>
                                </p>
                                <Input
                                  value={values?.admin_ssw}
                                  size="md"
                                  placeholder="Masukan nomor whatsapp admin SSW"
                                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                                />
                                <p className="text-xs text-gray-600 mt-2">Diawali dengan kode negara</p>
                              </div>
                            )}
                          </Field>
                        </FormItem>
                        <FormItem invalid={errors.admin_titp && touched.admin_titp} errorMessage={errors.admin_titp}>
                          <Field name="admin_titp">
                            {({ field }) => (
                              <div>
                                <p className="text-black leading-[21px] mb-2">
                                  Nomor Whatsapp Admin 2 <span className="text-red-600">*</span>
                                </p>
                                <Input
                                  value={values?.admin_titp}
                                  size="md"
                                  placeholder="Masukan nomor whatsapp admin TITP"
                                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                                />
                                <p className="text-xs text-gray-600 mt-2">Diawali dengan kode negara</p>
                              </div>
                            )}
                          </Field>
                        </FormItem>
                        <FormItem
                          invalid={errors.admin_pelatihan && touched.admin_pelatihan}
                          errorMessage={errors.admin_pelatihan}
                        >
                          <Field name="admin_pelatihan">
                            {({ field }) => (
                              <div>
                                <p className="text-black leading-[21px] mb-2">
                                  Nomor Whatsapp Admin Program Pelatihan <span className="text-red-600">*</span>
                                </p>
                                <Input
                                  value={values?.admin_pelatihan}
                                  size="md"
                                  placeholder="Masukan nomor whatsapp admin program pelatihan"
                                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                                />
                                <p className="text-xs text-gray-600 mt-2">Diawali dengan kode negara</p>
                              </div>
                            )}
                          </Field>
                        </FormItem>
                      </div>
                    </FormContainer>
                  </Card>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Sistem;
