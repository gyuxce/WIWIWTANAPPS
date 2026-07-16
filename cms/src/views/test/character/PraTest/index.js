import { AdaptableCard } from 'components/shared';
import { Button, Input } from 'components/ui';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import ReactQuill from 'react-quill';
import * as Yup from 'yup';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { apiGetPratestCharacter, apiSavePratestCharacter } from '../api/api';
import { useEffect, useState } from 'react';
import { apiConstantLanguage } from 'services/ApiBase';
import { openNotification } from 'components/custom/NotificationComponent';

const PraTestPage = () => {
  const [child, setChild] = useState([]);
  const [initialValue, setInitialValue] = useState({});

  const fetchData = async () => {
    try {
      const response = await apiConstantLanguage();
      const pratest_data = await apiGetPratestCharacter();
      let value_child = [];
      await response.data.forEach((val) => {
        value_child.push({
          title: '',
          description: '',
          language_type: val.value,
        });
      });

      setChild(value_child);
      if (pratest_data?.data?.data?.introduction?.length > 0) {
        setInitialValue({
          pratest: pratest_data?.data?.data?.introduction,
        });
      } else {
        setInitialValue({
          pratest: [
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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    pratest: Yup.array().of(
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
    <div className="w-full">
      {!initialValue.pratest ? (
        ''
      ) : (
        <Formik
          initialValues={initialValue}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              let new_value = values.pratest.map((x, index) => {
                let dat = { ...x };
                dat.title = `Bagian ${index + 1}`;
                return dat;
              });
              new_value = {
                pratest: [...new_value],
              };

              await apiSavePratestCharacter(new_value);
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
                <span>Persiapan Tes</span>
                <div>
                  <Button
                    type="button"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={() => {
                      if (errors.pratest) {
                        let src_index = errors.pratest.findIndex((x) => x != null);
                        openNotification('Error Validasi', 'danger', 'Periksa kembali pada bagian ' + (src_index + 1));
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
                <FieldArray name="pratest">
                  {({ remove, push }) => (
                    <div className="">
                      {values.pratest &&
                        values.pratest.length > 0 &&
                        values.pratest.map((pr, index) => (
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
                                  name={`pratest.${index}.title`}
                                  placeholder="Masukkan Nama Acara"
                                  component={Input}
                                  className="mb-3"
                                  value={`Bagian ${index + 1}`}
                                />
                                {pr.child.map((ch, i) => (
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
                                        htmlFor={`pratest.${index}.child.${i}.title`}
                                      >
                                        <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                          Judul Persiapan
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
                                          name={`pratest.${index}.child.${i}.title`}
                                          placeholder="Masukkan Judul"
                                          component={Input}
                                          className="mb-1"
                                        />
                                        <ErrorMessage
                                          name={`pratest.${index}.child.${i}.title`}
                                          component="div"
                                          className="field-error"
                                        />
                                      </div>
                                      <div>
                                        <label
                                          className="justify-start items-center gap-0.5 inline-flex mb-2"
                                          htmlFor={`pratest.${index}.child.${i}.description`}
                                        >
                                          <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                            Deskripsi Persiapan
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
                                          name={`pratest.${index}.child.${i}.description`}
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
                                                  value={values.pratest[index].child[i].description}
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
                                            name={`pratest.${index}.child.${i}.description`}
                                            component="div"
                                            className="field-error "
                                          />
                                          *Maksimal 1000 karakter
                                        </div>
                                      </div>

                                      {i == 0 ? (
                                        <img src="/img/others/Divider.svg" alt="" className="mb-4 mt-2 h-2" />
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </div>
                                ))}
                                <div
                                  className={`flex ${
                                    values.pratest.length > 1
                                      ? 'items-center justify-center content-center p-3 rounded-lg border border-red-600 space-x-2 cursor-pointer'
                                      : 'bg-stone-200 items-center justify-center content-center p-3 rounded-lg space-x-2 cursor-pointer'
                                  }`}
                                  onClick={() => remove(index)}
                                >
                                  <img
                                    src={
                                      values.pratest.length > 1
                                        ? '/img/icon/icon-trash.svg'
                                        : '/img/icon/icon-trash-disable.svg'
                                    }
                                    alt=""
                                  />
                                  <span
                                    className={`text-center ${
                                      values.pratest.length > 1 ? 'text-red-600' : 'text-gray-500'
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
  );
};

export default PraTestPage;
