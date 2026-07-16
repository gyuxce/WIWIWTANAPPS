import React from 'react';
import { Input, Button, FormItem, FormContainer, Alert } from 'components/ui';
import { ActionLink, PasswordInput } from 'components/shared';
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import useAuth from 'utils/hooks/useAuth';
// import { IoIosLogIn } from 'react-icons/io';
import { LoginSvg } from 'assets/svg';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Mohon menggunakan email anda').required('Mohon masukkan email anda'),
  password: Yup.string()
    .min(8, 'Minimal 8 karakter')
    .required('Mohon masukkan kata sandi anda')
    .matches(/^\S*$/, 'Mohon jangan menggunakan spasi'),
  rememberMe: Yup.bool(),
});

const SignInForm = (props) => {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = '/forgot-password',
    // signUpUrl = '/sign-up'
  } = props;

  const [message, setMessage] = useTimeOutMessage();

  const { signIn } = useAuth();

  const onSignIn = async (values, setSubmitting) => {
    const { email, password, rememberMe } = values;
    setSubmitting(true);

    const result = await signIn({
      email,
      password,
      is_mobile: 0,
      rememberMe,
    });

    if (result.status === 'failed' || result.status === 'error') {
      setMessage(result.message);
    }

    setSubmitting(false);
  };

  return (
    <div className={className}>
      {message && (
        <Alert className="mb-4" type="danger" showIcon>
          {message}
        </Alert>
      )}
      <Formik
        // Remove this initial value
        initialValues={{
          email: '',
          password: '',
          rememberMe: false,
          is_mobile: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignIn(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Email"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
                labelClass="!font-bold form-login-label"
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  id="email"
                  placeholder="Masukkan email anda"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Kata Sandi"
                invalid={errors.password && touched.password}
                errorMessage={errors.password}
                labelClass="!font-bold form-login-label"
              >
                <Field
                  autoComplete="off"
                  name="password"
                  id="password"
                  placeholder="Masukkan kata sandi anda"
                  component={PasswordInput}
                />
              </FormItem>
              <div className="flex justify-end mb-6">
                <ActionLink to={forgotPasswordUrl}>
                  <div className="font-bold font-goth">Lupa Kata Sandi?</div>
                </ActionLink>
              </div>
              <Button
                id="btn-signin"
                block
                loading={isSubmitting}
                icon={<LoginSvg />}
                variant="default"
                type="submit"
                style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
              >
                {isSubmitting ? 'Masuk...' : 'Masuk'}
              </Button>
              {/* <div className="mt-4 text-center">
								<span>Don't have an account yet? </span>
								<ActionLink to={signUpUrl}>
									Sign up
								</ActionLink>
							</div> */}
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignInForm;
