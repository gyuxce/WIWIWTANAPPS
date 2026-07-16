import React, { useState } from 'react';
import { Button, FormItem, FormContainer, Alert } from 'components/ui';
import { PasswordInput } from 'components/shared';
import { apiResetPassword } from 'services/AuthService';
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage';
import { useLocation, useNavigate } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Masukkan kata sandi anda')
    .min(8, 'Minimal 8 karakter')
    .matches(/^\S*$/, 'Mohon jangan menggunakan spasi'),
  password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Kata sandi tidak sesuai'),
});

const ResetPasswordForm = (props) => {
  const { disableSubmit = false, className } = props;

  const [resetComplete, setResetComplete] = useState(false);

  const [message, setMessage] = useTimeOutMessage();
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split('/');
  const token = segments[segments.length - 1];

  const navigate = useNavigate();

  const onSubmit = async (values, setSubmitting) => {
    const { password, password_confirmation } = values;
    setSubmitting(true);
    try {
      const resp = await apiResetPassword(
        {
          password,
          password_confirmation,
          is_mobile: 0,
        },
        token,
      );
      if (resp.data) {
        setSubmitting(false);
        setResetComplete(true);
      }
    } catch (errors) {
      setMessage(errors?.response?.data?.message || errors.toString());
      setSubmitting(false);
    }
  };

  const onContinue = () => {
    navigate('/sign-in');
  };

  return (
    <>
      <div className={className}>
        <div className="font-opificio mb-[2rem]">
          {resetComplete ? (
            <>
              <div className="grid grid-cols-6 mb-8">
                <div className="col-start-3 col-span-4">
                  <img style={{ height: 200, width: 200 }} src="/img/gif-check.gif" alt="placeholder" />
                </div>
              </div>
              <div className="flex-col justify-start items-start gap-7 inline-flex">
                <p className="text-gray-800 text-[28px]">Kata sandi berhasil di ubah</p>
                <p className="self-stretch text-gray-800 text-xl">
                  Kata sandi berhasil di ubah, silahkan masuk menggunakan kata sandi Anda yang baru
                </p>
              </div>
            </>
          ) : (
            <div className="flex-col justify-start items-start gap-7 inline-flex">
              <h3 className="text-main-200 font-normal text-[28px] font-opificio">Buat kata sandi baru</h3>
              <p className="text-gray-800 text-xl font-opificio">
                Kata sandi baru Anda harus berbeda dengan kata sandi yang digunakan sebelumnya.
              </p>
            </div>
          )}
        </div>
        {message && (
          <Alert className="mb-4" type="danger" showIcon>
            {message}
          </Alert>
        )}
        <Formik
          initialValues={{
            password: '',
            password_confirmation: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (!disableSubmit) {
              onSubmit(values, setSubmitting);
            } else {
              setSubmitting(false);
            }
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <FormContainer>
                {!resetComplete ? (
                  <>
                    <FormItem
                      label="Kata Sandi Baru"
                      invalid={errors.password && touched.password}
                      errorMessage={errors.password}
                      labelClass="form-login-label !text-black !font-goth"
                      asterisk
                    >
                      <Field
                        autoComplete="off"
                        name="password"
                        id="password"
                        placeholder="Masukan kata sandi anda"
                        component={PasswordInput}
                      />
                    </FormItem>
                    <FormItem
                      label="Konfirmasi Kata Sandi"
                      invalid={errors.password_confirmation && touched.password_confirmation}
                      errorMessage={errors.password_confirmation}
                      labelClass="form-login-label !text-black !font-goth"
                      asterisk
                    >
                      <Field
                        autoComplete="off"
                        name="password_confirmation"
                        id="password_confirmation"
                        placeholder="Masukan kata sandi anda"
                        component={PasswordInput}
                      />
                    </FormItem>
                    <Button
                      id="btn-submit"
                      block
                      loading={isSubmitting}
                      variant="default"
                      style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
                      type="submit"
                    >
                      {'Konfirmasi'}
                    </Button>
                  </>
                ) : (
                  <Button
                    id="btn-login"
                    block
                    variant="default"
                    style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
                    type="button"
                    onClick={onContinue}
                  >
                    Masuk Sekarang
                  </Button>
                )}
              </FormContainer>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ResetPasswordForm;
