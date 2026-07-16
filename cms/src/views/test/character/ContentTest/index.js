import { AdaptableCard } from 'components/shared';
import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from 'components/ui';
import { apiGetPratestCharacter, apiSaveContentCharacter } from '../api/api';
import { openNotification } from 'components/custom/NotificationComponent';
const ContentTestPage = () => {
  const [data, setData] = useState('');
  const [initialValue, setInitialValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pratest_data = await apiGetPratestCharacter();
        setData(pratest_data?.data?.data);
        setInitialValue({
          link_url: pratest_data?.data?.data?.link_url,
        });
      } catch (error) {
        openNotification('Error fetching data:', 'danger', error);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    link_url: Yup.string().url('Invalid URL').required('URL Harus Diisi'),
  });
  return (
    <AdaptableCard className="rounded-2xl border-none p-2">
      <div className="w-[1002px] h-6 text-black text-xl font-normal font-opificio">Konten Tes Karakter</div>
      <div className="justify-start items-center gap-0.5 inline-flex mb-2 mt-5">
        <div className="text-black text-sm font-normal font-goth leading-[21px]">Tautan Tes Karakter</div>
        <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
      </div>
      {initialValue !== '' ? (
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await apiSaveContentCharacter(data.id, values);
              openNotification('Success', 'success', 'Berhasil update data');
            } catch (error) {
              openNotification('Error', 'danger', 'Error saving data: ' + error);
            }
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting, handleSubmit, setSubmitting }) => (
            <div>
              <Form>
                <Field name="link_url" placeholder="Masukkan tautan">
                  {({ field, form }) => (
                    <div>
                      <Input
                        value={values.link_url}
                        size="md"
                        placeholder="Masukkan tautan"
                        onChange={(option) => {
                          form.setFieldValue(field.name, option.target.value);
                        }}
                      />
                    </div>
                  )}
                </Field>

                <ErrorMessage name="link_url" component="div" className="field-error" />
              </Form>
              <div className="mt-5 flex items-end justify-end">
                <Button
                  type="button"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onClick={() => {
                    setSubmitting(true);
                    handleSubmit();
                  }}
                  className="w-[200px] h-12 p-3"
                >
                  <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
                </Button>
              </div>
            </div>
          )}
        </Formik>
      ) : (
        ''
      )}
    </AdaptableCard>
  );
};

export default ContentTestPage;
