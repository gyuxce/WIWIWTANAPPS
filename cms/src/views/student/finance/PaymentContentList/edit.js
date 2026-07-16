import Card from 'components/ui/Card';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, Input, Spinner } from 'components/ui';
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import ReactQuill from 'react-quill';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { AdaptableCard } from 'components/shared';
import { openNotification } from 'components/custom/NotificationComponent';
import { useEffect, useState } from 'react';
import { apiConstantLanguage } from 'services/ApiBase';
import { apiGetPaymentContent, apiSavePaymentContent } from './api';
import Breadcrumbs from 'components/ui/Breadcrumbs';
dayjs.extend(utc);

const Edit = () => {
  const { id } = useParams();
  const [child, setChild] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [initialData, setInitialData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Data Pembayaran', path: '/student/payment?tab=tab3' },
    { label: 'Konten Pembayaran', path: '' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const contents = await apiGetPaymentContent(id);
        setInitialData(contents.data);
        const response = await apiConstantLanguage();
        let value_child = [];
        await response.data.forEach((val) => {
          value_child.push({
            title: '',
            description: '',
            language_type: val.value,
          });
        });
        setChild(value_child);

        if (contents?.data?.data?.items?.length > 0) {
          setInitialValue({
            contents: contents?.data?.data?.items,
          });
        } else {
          setInitialValue({
            contents: [
              {
                title: '',
                description: '',
                child: value_child,
              },
            ],
          });
        }
      } catch (error) {
        openNotification('Error fetching data:', 'danger', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const modules = {
    toolbar: [
      [
        'bold',
        'italic',
        'underline',
        { align: null },
        { align: 'center' },
        { align: 'right' },
        { align: 'justify' },
        { list: 'ordered' },
        { list: 'bullet' },
      ],
    ],
  };

  const formats = ['bold', 'italic', 'align', 'list', 'bullet', 'indent', 'underline'];

  const validationSchema = Yup.object().shape({
    contents: Yup.array().of(
      Yup.object().shape({
        child: Yup.array().of(
          Yup.object().shape({
            title: Yup.string().required('Judul persiapan harus diisi'),
            description: Yup.string()
              .required('Deskripsi persiapan harus diisi')
              .max(1000, 'Deskripsi persiapan tidak boleh lebih dari 1000 karakter'),
          }),
        ),
      }),
    ),
  });

  return (
    <div className="px-7">
      <div className="router mb-6">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to="/student/payment?tab=tab3">
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{initialData?.data?.title}</div>
        </div>
      </div>
      <Card bodyClass="!p-1" className="border-none rounded-xl">
        <div className="w-full">
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Spinner className="text-grey-300" size={20} />
            </div>
          ) : (
            <Formik
              enableReinitialize
              initialValues={initialValue}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  let new_value = values.contents.map((x, index) => {
                    let dat = { ...x };
                    dat.title = `Bagian ${index + 1}`;
                    return dat;
                  });
                  new_value = {
                    content_items: [...new_value],
                  };
                  await apiSavePaymentContent(id, new_value);
                  openNotification('Success', 'success', 'Berhasil Simpan Data');
                  setSubmitting(false);
                } catch {
                  setSubmitting(false);
                }
              }}
              validationSchema={validationSchema}
            >
              {({ values, handleSubmit, isSubmitting, errors }) => (
                <AdaptableCard className="rounded-2xl border-none">
                  <div className="text-black text-xl font-normal font-opificio mb-4 flex justify-between items-center">
                    <span>Detail Konten Pembayaran</span>
                    <div>
                      <Button
                        type="button"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        onClick={() => {
                          if (errors.contents) {
                            let src_index = errors.contents.findIndex((x) => x != null);
                            openNotification(
                              'Error Validasi',
                              'danger',
                              'Periksa kembali pada bagian ' + (src_index + 1),
                            );
                          }

                          handleSubmit();
                        }}
                        className="w-[200px] h-12 p-3"
                      >
                        <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
                      </Button>
                    </div>
                  </div>

                  <Form>
                    <FieldArray name="contents">
                      {({ remove, push }) => (
                        <div className="">
                          {values &&
                            values?.contents?.length > 0 &&
                            values?.contents?.map((content, index) => (
                              <div className="border border-stone-300 rounded-xl my-6" key={index}>
                                <AccordionCustome>
                                  <AccordionItemCustome
                                    title={`Bagian ${index + 1}`}
                                    className="text-black text-xl font-normalfont-opificio"
                                    containerClass="m-4"
                                    headerClass="pb-4"
                                  >
                                    <Field
                                      asterisk="true"
                                      type="hidden"
                                      autoComplete="off"
                                      name={`contents.${index}.title`}
                                      placeholder="Masukkan Judul Bagian"
                                      component={Input}
                                      className="mb-3"
                                      value={`Bagian ${index + 1}`}
                                    />
                                    {content?.child?.map((ch, i) => (
                                      <div key={i}>
                                        <div className="col">
                                          <div>
                                            <div className="flex items-center mb-3 mt-4">
                                              <img
                                                src={i == 0 ? `/img/logo/flag-indo.svg` : `/img/logo/flag-japan.svg`}
                                                alt=""
                                              />
                                              <div className="text-black text-sm font-semibold font-goth leading-[21px] ml-2">
                                                {i == 0 ? 'Bahasa Indonesia' : 'Bahasa Jepang'}
                                              </div>
                                            </div>
                                          </div>

                                          <label
                                            className="justify-start items-center gap-0.5 inline-flex mb-2"
                                            htmlFor={`contents.${index}.child.${i}.title`}
                                          >
                                            <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                              Judul Konten
                                            </div>
                                            <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">
                                              *
                                            </div>
                                          </label>
                                          <div className="mb-3">
                                            <Field
                                              asterisk="true"
                                              type="text"
                                              autoComplete="off"
                                              name={`contents.${index}.child.${i}.title`}
                                              placeholder="Masukkan Judul"
                                              component={Input}
                                              className="mb-1"
                                            />
                                            <ErrorMessage
                                              name={`contents.${index}.child.${i}.title`}
                                              component="div"
                                              className="field-error"
                                            />
                                          </div>
                                          <div>
                                            <label
                                              className="justify-start items-center gap-0.5 inline-flex mb-2"
                                              htmlFor={`contents.${index}.child.${i}.description`}
                                            >
                                              <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                                Deskripsi Konten
                                              </div>
                                              <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">
                                                *
                                              </div>
                                            </label>
                                            <Field
                                              asterisk
                                              className="rounded-md border h-[109px] border-stone-300"
                                              type="text"
                                              autoComplete="off"
                                              name={`contents.${index}.child.${i}.description`}
                                              placeholder="Masukkan Deskripsi"
                                            >
                                              {({ field, form }) => {
                                                return (
                                                  <div>
                                                    <ReactQuill
                                                      style={{ marginBottom: '24px' }}
                                                      theme="snow"
                                                      // className="rounded-md border h-[109px]"
                                                      initialValue=""
                                                      placeholder="Masukkan Deskripsi"
                                                      value={values.contents[index].child[i].description}
                                                      onChange={(val) => {
                                                        form.setFieldValue(field.name, val);
                                                      }}
                                                      modules={modules}
                                                      formats={formats}
                                                    />
                                                  </div>
                                                );
                                              }}
                                            </Field>
                                            <div className="text-black text-sm font-normal font-goth leading-[21px] -mt-3 mb-2">
                                              <ErrorMessage
                                                name={`contents.${index}.child.${i}.description`}
                                                component="div"
                                                className="field-error "
                                              />
                                              *Maksimal 200 karakter
                                            </div>
                                          </div>

                                          {i == 0 ? (
                                            <img src="/img/others/Divider.svg" alt="" className="mb-4 h-2" />
                                          ) : (
                                            ''
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      className={`flex mt-4 ${
                                        values.contents.length > 1
                                          ? 'items-center justify-center contents-center p-3 rounded-lg border border-red-600 space-x-2 cursor-pointer'
                                          : 'bg-stone-200 items-center justify-center contents-center p-3 rounded-lg space-x-2 cursor-pointer'
                                      }`}
                                      onClick={() => remove(index)}
                                    >
                                      <img
                                        src={
                                          values.contents.length > 1
                                            ? '/img/icon/icon-trash.svg'
                                            : '/img/icon/icon-trash-disable.svg'
                                        }
                                        alt=""
                                      />
                                      <span
                                        className={`text-center ${
                                          values.contents.length > 1 ? 'text-red-600' : 'text-gray-500'
                                        } text-sm font-normal font-goth leading-[21px]`}
                                      >
                                        Delete Section
                                      </span>
                                    </div>
                                  </AccordionItemCustome>
                                </AccordionCustome>
                              </div>
                            ))}
                          <Button
                            className="p-3 h-12 w-full"
                            icon={<img src="/img/icon/btn-plus.svg" alt="" />}
                            onClick={(event) => {
                              event.preventDefault();
                              push({
                                title: '',
                                description: '',
                                child: child,
                              });
                            }}
                          >
                            <div className="text-center text-blue-950 text-base font-bold font-goth">Tambah Konten</div>
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </Form>
                </AdaptableCard>
              )}
            </Formik>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Edit;
