import React, { useState, useEffect } from 'react';
import Card from 'components/ui/Card';
import Input from 'components/ui/Input';
import Dialog from 'components/ui/Dialog';
import { apiChangePassword, apiUpdateProfile } from './api';
import { apiFile } from 'services/ApiBase';
import { Button, FormContainer, FormItem, Notification, Spinner, toast } from 'components/ui';
import moment from 'moment';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { apiUserMe } from 'services/AuthService';
import { UPLOAD_SIZE } from 'constants/api.constant';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Wajib diisi'),
});

const Profile = (props) => {
  const [detail, setDetail] = useState();
  const [file_id, setFileId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [passwordAt, setPasswordAt] = useState('');
  const [dialogIsOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const user = await apiUserMe({
        relations: ['profilePicture'].join(),
      });

      if (user) {
        setDetail(user?.data?.data);
        setImgUrl(user.data.data.profilePicture?.url);
        if (user.data?.data?.password_updated_at != null) {
          setPasswordAt(moment(user.data?.data?.password_updated_at).format('D MMMM YYYY, HH:mm'));
        }
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
    fetchData();
  }, []);

  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = () => {
    setIsOpen(false);
  };

  const changeImage = () => {
    // Trigger file input click programmatically
    document.getElementById('fileInput').click();
  };

  const handleFileChange = async (event) => {
    setLoading(true);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      if (fileSizeInMB > UPLOAD_SIZE) {
        toast.push(
          <Notification title={'Error'} type="danger">
            {'Maximum size ' + UPLOAD_SIZE + ' MB'}
          </Notification>,
          {
            placement: 'top-center',
          },
        );
        setLoading(false);
        return;
      }
      const reader = new FileReader();

      reader.onload = (e) => {
        setImgUrl(e.target.result);
      };

      await reader.readAsDataURL(selectedFile);
      await uploadImageFile(selectedFile);
    }
    setLoading(false);
  };

  const uploadImageFile = async (selectedFile) => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    const ress = await apiFile(formData);
    if (ress) {
      setFileId(ress.data?.uuid);
    } else {
      setFileId('');
    }
  };

  const updateProfile = async (body) => {
    try {
      let params = {
        profile_pic_id: file_id,
        name: body?.name,
      };
      await apiUpdateProfile(params);
      toast.push(
        <Notification title={'Success'} type="success">
          {'Berhasil update profile'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      props.fetchMe();
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
          name: detail?.name || '',
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await updateProfile(values);
          setSubmitting(false);
        }}
      >
        {({ values, touched, errors, setFieldValue, isSubmitting }) => {
          return (
            <Form>
              <div className="bg-blue-950 w-full px-7 relative z-0">
                <div className="flex items-center justify-between py-10">
                  <div className="text-white text-[28px] font-normal font-opificio">Pengaturan Profil</div>
                  <div className="h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex">
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className={`${
                        isSubmitting || loading ? null : 'cursor-pointer'
                      } text-center text-black text-sm font-normal font-goth leading-[21px]`}
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-blue-950 absolute top-0 left-0 h-[80px] w-full z-0"></div>
                <div className="px-7 relative z-10">
                  <Card className="rounded-xl p-6 w-full bg-white mb-4">
                    <div className="flex items-center space-x-3">
                      {loading ? (
                        <Spinner size="120px" />
                      ) : (
                        <div className="w-[120px] h-[120px] relative">
                          <div className="rounded-full bg-blue-950 w-[113.68px] h-[113.68px] flex items-center justify-center">
                            <img src={imgUrl} className="rounded-full object-cover w-[107.37px] h-[107.37px]" alt="" />
                          </div>
                          <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />
                          <div
                            onClick={changeImage}
                            className="cursor-pointer w-10 h-10 bg-red-600 absolute left-[70px] top-[76px]  flex items-center justify-center rounded-full"
                          >
                            <img src="/img/icon/icon-camera.svg" alt="" />
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-blue-950 text-[28px] font-normal font-opificio">{detail?.name}</p>
                        <span className="text-gray-400 text-xl font-normal font-opificio">{detail?.role?.name}</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="rounded-lg bg-white px-6 py-8 ">
                    <div className="text-blue-950 text-xl font-normal font-opificio">Informasi Personal</div>
                    <FormContainer className="text-sm my-4">
                      <FormItem invalid={errors.name && touched.name} errorMessage={errors.name}>
                        <Field name="name">
                          {({ field }) => (
                            <div>
                              <p className="text-black leading-[21px] font-normal font-goth mb-2">
                                Nama Lengkap <span className="text-red-600">*</span>
                              </p>
                              <Input
                                value={values?.name}
                                size="md"
                                placeholder="Masukan nama lengkap"
                                onChange={(e) => setFieldValue(field.name, e.target.value)}
                              />
                            </div>
                          )}
                        </Field>
                      </FormItem>
                    </FormContainer>

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <div className="justify-start items-center gap-0.5 inline-flex mb-2">
                          <div className="text-black text-sm font-normal font-goth leading-[21px]">Email</div>
                          <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                        </div>
                        <Input placeholder="Basic usage" value={detail?.email} className="bg-slate-100 p-3" disabled />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div className="justify-start items-center gap-0.5 inline-flex mb-2">
                          <div className="text-black text-sm font-normal font-goth leading-[21px]">Role</div>
                          <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                        </div>
                        <Input placeholder="Role" value={detail?.role?.name} className="bg-slate-100 p-3" disabled />
                      </div>
                    </div>

                    <div className="divider my-8 w-full">
                      <img src="/img/others/Divider.svg" className="h-2" alt="" />
                    </div>

                    <div className="w-[1002px] h-[101px] flex-col justify-start items-start gap-3.5 inline-flex">
                      <div className="text-blue-950 text-xl font-normal font-opificio">Keamanan</div>
                      <div className="text-center text-black text-xs font-normal font-goth">
                        Terakhir sandi diubah: {passwordAt}
                      </div>
                      <div className="h-8 px-3 py-2 rounded border border-black justify-center items-center gap-2 inline-flex">
                        <button
                          type="button"
                          className="text-center text-black text-xs font-normal font-goth"
                          onClick={() => openDialog()}
                        >
                          Ubah Kata Sandi
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      <DialogChangePassword isOpen={dialogIsOpen} onClose={onDialogClose} />
    </div>
  );
};

const DialogChangePassword = ({ isOpen, onClose }) => {
  const [pwInputType, setPwInputType] = useState('password');
  const [confirmpwInputType, setconfirmPwInputType] = useState('password');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'passwordConfirmation') {
      setPasswordConfirmation(value);
    }
  };

  const onSubmit = async () => {
    try {
      await apiChangePassword({ password: password, password_confirmation: passwordConfirmation });
      setPasswordConfirmation('');
      setPassword('');
      toast.push(
        <Notification title={'Success'} type="success">
          {'Berhasil Ubah Kata Sandi'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    } catch (error) {
      setPasswordConfirmation('');
      setPassword('');
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch data'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
    onClose();
  };

  const onPasswordVisibleClick = (e) => {
    e.preventDefault();
    setPwInputType(pwInputType === 'password' ? 'text' : 'password');
  };
  const onConfirmPasswordVisibleClick = (e) => {
    e.preventDefault();
    setconfirmPwInputType(confirmpwInputType === 'password' ? 'text' : 'password');
  };
  const inputIcon = (
    <span className="cursor-pointer" onClick={(e) => onPasswordVisibleClick(e)}>
      {pwInputType === 'password' ? (
        <img src="/img/icon/eye-closed.svg" alt="" />
      ) : (
        <img src="/img/icon/eye-open.svg" alt="" />
      )}
    </span>
  );

  const inputIconConfirm = (
    <span className="cursor-pointer" onClick={(e) => onConfirmPasswordVisibleClick(e)}>
      {confirmpwInputType === 'password' ? (
        <img src="/img/icon/eye-closed.svg" alt="" />
      ) : (
        <img src="/img/icon/eye-open.svg" alt="" />
      )}
    </span>
  );
  return (
    <Dialog isOpen={isOpen} onClose={onClose} closable={false}>
      <div className="mb-1 flex items-center justify-between">
        <div className=" text-blue-950 text-xl font-normal font-opificio">Ubah Kata Sandi</div>
        <img src="/img/icon/icon-radix.svg" alt="" onClick={onClose} />
      </div>

      <div className="text-blue-950 text-sm font-normal font-goth leading-[21px]">Silahkan buat kata sandi baru</div>
      <div className="my-4">
        <div className="justify-start items-center gap-0.5 inline-flex mb-2">
          <div className="text-black text-sm font-normal font-goth leading-[21px]">Kata Sandi Baru</div>
          <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
        </div>
        <Input
          type={pwInputType}
          name="password"
          onChange={handleChange}
          value={password}
          suffix={inputIcon}
          placeholder=""
        />
      </div>
      <div className="my-4">
        <div className="justify-start items-center gap-0.5 inline-flex mb-2">
          <div className="text-black text-sm font-normal font-goth leading-[21px]">Konfirmasi Kata Sandi</div>
          <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
        </div>
        <Input
          type={confirmpwInputType}
          name="passwordConfirmation"
          onChange={handleChange}
          value={passwordConfirmation}
          suffix={inputIconConfirm}
          placeholder=""
        />
      </div>
      <div className="h-5"></div>
      <Button
        onClick={onSubmit}
        style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
        className="w-full h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex"
      >
        <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">Konfirmasi</div>
      </Button>
    </Dialog>
  );
};

export default Profile;
