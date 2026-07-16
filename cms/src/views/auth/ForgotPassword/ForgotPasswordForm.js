import React, { useState, useEffect } from 'react';
import { Input, Button, FormItem, FormContainer, Alert } from 'components/ui';
import { apiForgotPassword } from 'services/AuthService';
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Masukkan kata sandi anda'),
});

const ForgotPasswordForm = (props) => {
  const { disableSubmit = false, className } = props;

  const [emailSent, setEmailSent] = useState(false);

  const [count, setCount] = useState(0);

  const [message, setMessage] = useTimeOutMessage();

  const onSendMail = async (values, setSubmitting) => {
    const { email, redirect_url } = values;
    setSubmitting(true);
    try {
      const resp = await apiForgotPassword({
        email,
        redirect_url,
        is_mobile: 0,
      });
      if (resp.data) {
        setSubmitting(false);
        setEmailSent(true);
        setCount(30);
      }
    } catch (errors) {
      setMessage(errors?.response?.data?.message || errors.toString());
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (count > 0) {
      const timerId = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [count]);

  return (
    <>
      <div className="flex justify-center mb-[2rem]"></div>
      <div className={className}>
        <div className="mb-[2rem] font-opificio">
          {emailSent ? (
            <>
              <div className="grid grid-cols-6 mb-8">
                <div className="col-start-3 col-span-4">
                  <img style={{ height: 200, width: 200 }} src="/img/others/email-send.gif" alt="email-send" />
                </div>
              </div>
              <div className="flex-col justify-start items-start gap-5 inline-flex">
                <p className="self-stretch text-center text-main-200 text-[28px]">
                  Kami telah mengirimkan instruksi pemulihan kata sandi ke email Anda
                </p>
                <p className="self-stretch text-center text-gray-800 text-xl">
                  Tidak menerima email? periksa filter spam Anda atau kirim ulang
                </p>
              </div>
            </>
          ) : (
            <div className="flex-col justify-start items-start gap-7 inline-flex">
              <p className="text-main-200 text-[28px]">Ubah kata sandi</p>
              <p className="self-stretch text-gray-800 text-xl">
                Silahkan masukkan email yang terdaftar sebagai admin wiwitan
              </p>
            </div>
          )}
        </div>
        {message && (
          <Alert className="my-2" type="danger" showIcon>
            {message}
          </Alert>
        )}
        <Formik
          initialValues={{
            email: '',
            redirect_url: `${window.location.origin}/reset-password`,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (!disableSubmit) {
              onSendMail(values, setSubmitting);
            } else {
              setSubmitting(false);
            }
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <FormContainer>
                <div className={emailSent ? 'hidden' : ''}>
                  <FormItem
                    label="Email"
                    invalid={errors.email && touched.email}
                    errorMessage={errors.email}
                    labelClass="form-login-label !text-black"
                    asterisk
                  >
                    <Field
                      type="email"
                      autoComplete="off"
                      name="email"
                      id="email"
                      placeholder="Masukan email anda"
                      component={Input}
                    />
                  </FormItem>
                </div>
                <Button
                  id="btn-send"
                  block
                  loading={isSubmitting}
                  variant={emailSent ? 'plain' : 'default'}
                  type="submit"
                  style={{ boxShadow: emailSent ? '' : '-2px 2px 0px 0px #000', color: '#262564' }}
                >
                  {emailSent ? <span> Kirim Ulang Email</span> : 'Kirim'}
                </Button>
                {emailSent && count ? (
                  <p className="text-gray-800 text-center mt-[.5rem]">in : {count} seconds</p>
                ) : null}
              </FormContainer>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
