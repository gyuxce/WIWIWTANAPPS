import HomeSvg from 'components/custom/svg/HomeSvg';
import { AdaptableCard } from 'components/shared';
import { PageConfig } from './config';
import ArrowRightSvg from 'components/custom/svg/ArrowRightSvg';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { apiShow, apiStore, apiUpdate } from './api';
import { useEffect, useState } from 'react';
import { Button, FormContainer, FormItem, Input, Notification, Select, toast } from 'components/ui';
import * as Yup from 'yup';
import { OPTION_STATUS_MASTER_DATA } from 'components/ui/utils/constant';
import { Field, Form, Formik } from 'formik';
import ArrowBackSvg from 'components/custom/svg/ArrowsBackSvg';
import ConfirmationSave from 'components/custom/ConfirmationSave';
import ConfirmationChange from 'components/custom/ConfirmationChange';
import { apiGetRole } from 'services/AppService';
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi';

const validationSchema = Yup.object().shape({
  name: Yup.string().required(`${PageConfig.moduleTitle} Name Required`),
  is_active: Yup.string().required(`${PageConfig.moduleTitle} Status Required`),
  email: Yup.string().required(`${PageConfig.moduleTitle} Email Required`),
  role_id: Yup.string().required(`${PageConfig.moduleTitle} Role Required`),
  password: Yup.string().required(`${PageConfig.moduleTitle} Password Required`),
});

const FormPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const segments = pathname.split('/');
  const code = segments[segments.length - 1];
  const [title, setTitle] = useState();
  const [pwInputType, setPwInputType] = useState('password');
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationChangeModal, setConfirmationChangeModal] = useState(false);
  const [role, setRole] = useState([]);
  const [editData, setEditData] = useState();
  const [localState, setLocalState] = useState({
    loading: false,
    data: null,
    params: {
      relations: [].join(),
    },
  });

  const onPasswordVisibleClick = (e) => {
    e.preventDefault();
    setPwInputType(pwInputType === 'password' ? 'text' : 'password');
  };

  const inputIcon = (
    <span className="cursor-pointer" onClick={(e) => onPasswordVisibleClick(e)}>
      {pwInputType === 'password' ? <HiOutlineEyeOff /> : <HiOutlineEye />}
    </span>
  );

  const getRole = async () => {
    try {
      const ress = await apiGetRole({ type: 'collection' });
      setRole(ress.data?.data || []);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch data role'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const fetchData = async () => {
    try {
      const ress = await apiShow(code, localState.params);
      setLocalState({
        ...localState,
        data: ress.data?.data,
      });
      setTitle('Edit');
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      navigate(PageConfig.url);
    }
  };

  const onSubmit = async (values, setSubmitting) => {
    if (code === 'add') {
      try {
        const api = await apiStore(values);
        if (api.status === 201) {
          setConfirmationModal(true);
        }
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
      setSubmitting(false);
    } else {
      setConfirmationChangeModal(true);
      setSubmitting(false);
      setEditData(values);
    }
  };

  const doEdit = async () => {
    try {
      const api = await apiUpdate(localState.data.id, editData);
      if (api.status === 200) {
        setConfirmationChangeModal(false);
        setConfirmationModal(true);
      }
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

  useEffect(() => {
    if (code !== 'add') {
      fetchData();
    }
    getRole();
  }, []);

  return (
    <div className="pr-5">
      <AdaptableCard className="rounded-2xl border-none">
        <div className="flex justify-start items-center space-x-[0.5rem] mb-[1.5rem]">
          <div>
            <HomeSvg />
          </div>
          <div>
            <Link className="text-gray-600" to={PageConfig.url}>
              {PageConfig.moduleTitle}
            </Link>
          </div>
          <div>
            <ArrowRightSvg />
          </div>
          <div className="text-main-100">{`${title ?? 'Add New'} ${PageConfig.moduleTitle}`}</div>
        </div>
        <h1 className="mb-[1.5rem] text-2xl font-bold">{`${title ?? 'Add New'} ${PageConfig.moduleTitle}`}</h1>
        <Formik
          initialValues={{
            name: localState?.data?.name || '',
            is_active: localState?.data?.is_active || '',
            email: localState?.data?.email || '',
            role_id: localState?.data?.role?.id || '',
            description: localState?.data?.description || '',
            password: localState?.data?.password || '',
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            setTimeout(() => {
              onSubmit(values, setSubmitting);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, touched, errors, isSubmitting }) => {
            return (
              <Form>
                <FormContainer className="text-sm">
                  <FormItem invalid={errors.is_active && touched.is_active} errorMessage={errors.is_active}>
                    <Field name="is_active">
                      {({ field, form }) => (
                        <div>
                          <p className="text-gray-800 font-bold leading-[21px] mb-[.25rem]">Status</p>

                          <Select
                            size="md"
                            options={OPTION_STATUS_MASTER_DATA}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option.value);
                            }}
                            value={OPTION_STATUS_MASTER_DATA.find((v) => v.value === values.is_active)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.name && touched.name} errorMessage={errors.name}>
                    <Field name="name">
                      {({ field, form }) => (
                        <div>
                          <p className="text-gray-800 font-bold leading-[21px] mb-[.25rem]">Name</p>
                          <Input
                            value={values.name}
                            size="md"
                            placeholder="Enter name here"
                            onChange={(option) => form.setFieldValue(field.name, option.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.email && touched.email} errorMessage={errors.email}>
                    <Field name="email">
                      {({ field, form }) => (
                        <div>
                          <p className="text-gray-800 font-bold leading-[21px] mb-[.25rem]">Email</p>
                          <Input
                            value={values.email}
                            size="md"
                            placeholder="Enter your email here"
                            onChange={(option) => form.setFieldValue(field.name, option.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.password && touched.password} errorMessage={errors.password}>
                    <Field name="password">
                      {({ field, form }) => (
                        <div>
                          <p className="text-gray-800 font-bold leading-[21px] mb-[.25rem]">Password</p>
                          <Input
                            type={pwInputType}
                            suffix={inputIcon}
                            value={values.password}
                            size="md"
                            placeholder="Enter your password here"
                            onChange={(option) => form.setFieldValue(field.name, option.target.value)}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem invalid={errors.role_id && touched.role_id} errorMessage={errors.role_id}>
                    <Field name="role_id">
                      {({ field, form }) => {
                        const optionData = role?.map((option) => ({
                          value: option?.id,
                          label: option?.name,
                        }));

                        return (
                          <div>
                            <p className="text-gray-800 font-bold leading-[21px] mb-[.25rem]">Role</p>

                            <Select
                              size="md"
                              options={optionData}
                              onChange={(option) => {
                                form.setFieldValue(field.name, option.value);
                              }}
                              value={optionData.find((v) => v.value === values.role_id)}
                              placeholder="Select Role"
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </FormItem>
                </FormContainer>
                <div className="flex justify-end">
                  <div className="mr-[1.25rem]">
                    <Button
                      icon={<ArrowBackSvg />}
                      className="font-bold flex flex-1 items-center justify-center text-base !text-black bg-white border"
                      type="button"
                      size="md"
                      onClick={() => {
                        navigate(PageConfig.url);
                      }}
                      loading={isSubmitting}
                    >
                      Back
                    </Button>
                  </div>
                  <div>
                    <Button
                      loading={isSubmitting}
                      variant="solid"
                      size="md"
                      className="font-bold flex flex-1 items-center justify-center text-base"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Loading...' : 'Submit Data'}
                    </Button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </AdaptableCard>
      <ConfirmationSave
        isOpen={confirmationModal}
        onClose={() => setConfirmationModal(false)}
        redirectTo={PageConfig.url}
      />
      <ConfirmationChange
        isOpen={confirmationChangeModal}
        onClose={() => setConfirmationChangeModal(false)}
        onOk={doEdit}
      />
    </div>
  );
};

export default FormPage;
