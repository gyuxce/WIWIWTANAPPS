import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, Dialog, Input, Notification, Spinner, toast } from 'components/ui';
import { AdaptableCard } from 'components/shared';
import CustomeRadio from 'views/test/language/components/CustomeRadio';
import { useEffect, useRef, useState } from 'react';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { openNotification } from 'components/custom/NotificationComponent';
// import ReactQuill from 'react-quill';
import * as Yup from 'yup';
import { apiGetContentMaterial, apiSaveContentMaterial } from '../../api';
import { useParams } from 'react-router-dom';
import { uploadFile } from 'utils/helper/uploadfile';
import ReactQuill from 'react-quill';
import useAuth from 'utils/hooks/useAuth';
import { UPLOAD_SIZE } from 'constants/api.constant';

dayjs.extend(utc);

const Content = () => {
  const { id } = useParams();
  const [typeQuestion, setTypeQuestion] = useState('');
  const [isOpenAddQuestion, setIsOpenAddQuestion] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const quillRef = useRef(null);
  const { dataUser } = useAuth();

  const validationSchema = Yup.object().shape({
    material: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Judul materi harus diisi'),
        body_text: Yup.string()
          .required('Konten materi harus diisi')
          .max(5000, 'Konten materi tidak boleh lebih dari 5000 karakter'),
      }),
    ),
  });

  const uploadImages = (quill) => {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();
    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes

        if (file.size <= maxSize) {
          const formData = new FormData();
          formData.append('file', file);
          fetch(`${process.env.REACT_APP_API_HOST}/files`, {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${dataUser?.access_token} `,
            },
          })
            .then(async (response) => {
              const result = await response.json();
              const resultUpload = {
                type: 'success',
                message: 'success',
                data: result,
              };
              const range = quill.getEditor().getSelection();
              quill.getEditor().insertEmbed(range.index, 'image', resultUpload.data.url);
            })

            .catch((error) => {
              const err = {
                type: 'error',
                message: 'API Upload Error',
                data: error,
              };
              openNotification('Error', 'danger', err?.message);
            });
        } else {
          const err = {
            type: 'error',
            message: 'File tidak boleh melebihi 5MB',
            data: {},
          };
          openNotification('Error', 'danger', err?.message);
        }
      } else {
        const err = {
          type: 'error',
          message: 'API Upload Error',
          data: {},
        };
        openNotification('Error', 'danger', err?.message);
      }
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          relations: 'materialContent.file, materialContent.cover',
        };
        const content_data = await apiGetContentMaterial(id, params);
        if (content_data?.data?.data?.materialContent?.length > 0) {
          const formattedContents = content_data.data.data.materialContent.map((item) => {
            return {
              ...item,
              cover_image: item.cover?.url,
              cover_file_id: item.cover?.id,
              video_file: item.file?.filename,
              body_file_id: item.file?.id,
            };
          });

          setInitialValue({
            contents: formattedContents,
          });
        } else {
          setInitialValue({
            contents: [],
          });
        }
      } catch (error) {
        openNotification('Error fetching data:', 'danger', error);
      }
    };

    fetchData();
    quillRef.current
      ?.getEditor()
      .getModule('toolbar')
      .addHandler('image', () => {
        uploadImages(quillRef.current);
      });
  }, []);

  const onChange = (values, setField) => {
    const newItem = {
      id: '',
      title: '',
      description: '',
      body_type: typeQuestion,
      cover_image: '',
      cover_file_id: '',
      video_file: '',
      body_file_id: '',
    };
    setField('contents', [...values.contents, newItem]);
    onOpenAddQuestion();
  };

  const onOpenAddQuestion = () => {
    setIsOpenAddQuestion(!isOpenAddQuestion);
  };

  const handleCoverImageChange = async (event, setFieldValue, index) => {
    setIsLoading(true);
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
        setIsLoading(false);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      img.onload = async () => {
        const aspectRatio = img.width / img.height;
        if (aspectRatio !== 1) {
          toast.push(
            <Notification title={'Error'} type="danger">
              {'Ratio harus 1:1'}
            </Notification>,
            {
              placement: 'top-center',
            },
          );
          setIsLoading(false);
          return;
        }

        const ress = await uploadFile(selectedFile);

        if (ress) {
          setIsLoading(false);
          setFieldValue(`contents[${index}].cover_image`, ress?.data?.url);
          setFieldValue(`contents[${index}].cover_file_id`, ress?.data?.uuid);
        }
      };
    }
  };

  const removeCoverImage = async (setFieldValue, index) => {
    setFieldValue(`contents[${index}].cover_image`, '');
    setFieldValue(`contents[${index}].cover_file_id`, '');
  };

  const handleVideoFileChange = async (event, setFieldValue, index) => {
    setLoadingQuestion(true);

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const ress = await uploadFile(selectedFile);
      if (ress) {
        setFieldValue(`contents[${index}].video_file`, ress?.data?.name);
        setFieldValue(`contents[${index}].body_file_id`, ress?.data?.uuid);
      }
    }
    setLoadingQuestion(false);
  };

  const removeVideoFile = async (setFieldValue, index) => {
    setFieldValue(`contents[${index}].video_file`, '');
    setFieldValue(`contents[${index}].body_file_id`, '');
  };

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
        'image',
      ],
    ],
  };

  const formats = ['bold', 'italic', 'align', 'list', 'bullet', 'indent', 'image', 'underline'];

  return (
    <>
      <Formik
        initialValues={initialValue}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const filteredContents = values.contents.filter(
              (x) => !(x.id == '' && x.title == '' && x.description == ''),
            );

            const new_value = {
              course_item_id: id,
              contents: [...filteredContents],
            };

            await apiSaveContentMaterial(new_value);
            openNotification('Success', 'success', 'Berhasil Simpan Data');
            setSubmitting(false);
          } catch {
            setSubmitting(false);
          }
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {({ values, handleSubmit, isSubmitting, errors, setFieldValue }) => (
          <AdaptableCard className="rounded-2xl border-none">
            <div className="text-black text-xl font-normal font-opificio mb-4 flex justify-between items-center">
              <span>Konten Materi</span>
              <div>
                <Button
                  type="button"
                  className="w-[200px] h-12 p-3"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onClick={() => {
                    if (errors.contents) {
                      let src_index = errors.contents.findIndex((x) => x != null);
                      openNotification('Error Validasi', 'danger', 'Periksa kembali pada bagian ' + (src_index + 1));
                    }
                    handleSubmit();
                  }}
                >
                  <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
                </Button>
              </div>
            </div>
            {values?.contents?.length == 0 && (
              <div className="w-full  h-[323px] py-[120px] bg-white rounded-xl flex-col justify-center items-center inline-flex">
                <div className="text-center text-black text-xl font-normal font-opificio">Belum ada data</div>
              </div>
            )}

            <Form>
              <FieldArray name="contents">
                {({ remove }) => {
                  return (
                    <div className="">
                      {values.contents &&
                        values.contents.map((contentData, index) => (
                          <div className="border border-stone-300 rounded-xl my-6" key={index}>
                            {contentData.body_type == 1 && (
                              <AccordionCustome>
                                <AccordionItemCustome
                                  title="Materi Video"
                                  className="text-black text-xl font-normal opificio"
                                  containerClass="m-4"
                                  headerClass="pb-4"
                                >
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.${index}.id`}
                                    placeholder="Masukkan Nama Acara"
                                    component={Input}
                                    className="mb-3"
                                    value={contentData?.id}
                                  />
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.${index}.body_type`}
                                    placeholder="Masukkan body type"
                                    component={Input}
                                    className="mb-3"
                                    value={1}
                                  />
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.[${index}].cover_file_id`}
                                    component={Input}
                                    className="mb-3"
                                    value={contentData?.cover?.uuid}
                                  />
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.[${index}].body_file_id`}
                                    component={Input}
                                    className="mb-3"
                                    value={contentData?.file?.uuid}
                                  />
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                    }}
                                  >
                                    <div>
                                      <input
                                        id={`cover-image-${index}`}
                                        type="file"
                                        accept="image/png, image/jpeg,image/jpg"
                                        style={{ display: 'none' }}
                                        onChange={(event) => handleCoverImageChange(event, setFieldValue, index)}
                                      />
                                      <div className="text-black text-sm font-normal font-goth leading-[21px] mt-5 mb-2">
                                        Unggah Cover <span className="text-red-600">*</span>
                                      </div>

                                      <div
                                        onClick={() =>
                                          !isLoading && document.getElementById(`cover-image-${index}`).click()
                                        }
                                        className="cursor-pointer w-[200px] h-[200px] bg-white rounded-[20px] shadow flex-col justify-center items-center inline-flex"
                                      >
                                        {isLoading ? (
                                          <div
                                            style={{
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              height: '100vh',
                                            }}
                                          >
                                            <Spinner className="text-grey-300" size={20} />
                                          </div>
                                        ) : values.contents[index].cover_image ? (
                                          <div className="relative">
                                            <img
                                              src={values.contents[index].cover_image}
                                              onClick={() => window.open(values.contents[index].cover_image, '_blank')}
                                              alt=""
                                              className="w-full h-[200px] object-cover rounded-[20px]"
                                            />
                                            <div className="absolute bottom-0 right-0 p-3">
                                              <div className="flex space-x-2">
                                                <div
                                                  className="px-3 py-2 bg-white rounded"
                                                  onClick={() => removeCoverImage(setFieldValue, index)}
                                                >
                                                  <img className="h-5 w-5" src="/img/icon/icon-trash.svg" alt="" />
                                                </div>
                                                <div
                                                  className="px-3 py-2 bg-white rounded"
                                                  onClick={() =>
                                                    document.getElementById(`cover-image-${index}`).click()
                                                  }
                                                >
                                                  <img className="h-5 w-5" src="/img/icon/photo.svg" alt="" />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="items-center text-center">
                                            <div className="w-8 h-8 px-3 py-2 bg-white rounded justify-center items-center gap-1 inline-flex">
                                              <div className="w-5 h-5 relative">
                                                <div className="w-5 h-5 left-0 top-0">
                                                  <img src="/img/icon/photo.svg" alt="" />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                              Add Photo
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-black text-sm font-normal font-goth leading-[21px] mt-3 mb-2">
                                        (Rasio 1:1, Max {UPLOAD_SIZE}mb)
                                      </div>
                                    </div>
                                    <div className="mb-6 mt-5 ml-8">
                                      <input
                                        id={`video-file-${index}`}
                                        type="file"
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        onChange={(event) => handleVideoFileChange(event, setFieldValue, index)}
                                      />
                                      <div className=" text-black text-sm font-normal font-goth leading-[21px] mb-2">
                                        Unggah Video <span className="text-red-600">*</span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <Button
                                          type="button"
                                          onClick={() => document.getElementById(`video-file-${index}`).click()}
                                          loading={loadingQuestion}
                                          disabled={loadingQuestion}
                                          variant="plain"
                                          style={{ padding: '0px' }}
                                        >
                                          <span className="text-center cursor-pointer text-black text-sm font-normal font-goth leading-[21px] p-3 border border-stone-300 rounded-lg">
                                            Unggah File
                                          </span>
                                        </Button>
                                        {values.contents[index].video_file ? (
                                          <div className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center">
                                            <img
                                              src="/img/icon/icon-trash-file.svg"
                                              className="-mt-1 cursor-pointer mr-1"
                                              alt=""
                                              onClick={() => removeVideoFile(setFieldValue, index)}
                                            />
                                            <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                                              {values.contents[index].video_file}
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <label
                                      className="justify-start items-center gap-0.5 inline-flex mb-2 mt-4"
                                      htmlFor={`contents.${index}.title`}
                                    >
                                      <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                        Judul Materi
                                      </div>
                                      <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                                    </label>
                                    <div className="mb-3">
                                      <Field
                                        asterisk="true"
                                        type="text"
                                        autoComplete="off"
                                        name={`contents.${index}.title`}
                                        placeholder="Masukkan name materi"
                                        component={Input}
                                        className="mb-1"
                                      />
                                      <ErrorMessage
                                        name={`contents.${index}.title`}
                                        component="div"
                                        className="field-error"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      className="justify-start items-center gap-0.5 inline-flex mb-2"
                                      htmlFor={`contents.${index}.title`}
                                    >
                                      <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                        Deskripsi
                                      </div>
                                      <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                                    </label>
                                    <div className="mb-3">
                                      <Field
                                        asterisk="true"
                                        type="text"
                                        autoComplete="off"
                                        name={`contents.${index}.description`}
                                        placeholder="Masukkan name materi"
                                        component={Input}
                                        className="mb-1"
                                      />
                                    </div>
                                    <div className="text-black text-sm font-normal font-goth leading-[21px] -mt-3 mb-2">
                                      <ErrorMessage
                                        name={`contents.${index}.description`}
                                        component="div"
                                        className="field-error "
                                      />
                                      *Maksimal 200 karakter
                                    </div>
                                  </div>
                                  <img src="/img/others/Divider.svg" alt="" className="mb-4 mt-2 h-2" />

                                  <div
                                    className={`flex items-center justify-center content-center p-3 rounded-lg border border-red-600 space-x-2 cursor-pointer'
                                `}
                                    onClick={() => remove(index)}
                                  >
                                    <img src={'/img/icon/icon-trash.svg'} alt="" />
                                    <span className={`text-center text-red-600 `}>Delete Section</span>
                                  </div>
                                </AccordionItemCustome>
                              </AccordionCustome>
                            )}
                            {contentData.body_type == 2 && (
                              <AccordionCustome>
                                <AccordionItemCustome
                                  title="Lampiran Dokumen"
                                  className="text-black text-xl font-normal opificio"
                                  containerClass="m-4"
                                  headerClass="pb-4"
                                >
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.${index}.id`}
                                    placeholder="ID"
                                    component={Input}
                                    className="mb-3"
                                    value={contentData?.id}
                                  />
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.${index}.body_type`}
                                    placeholder="Masukkan body type"
                                    component={Input}
                                    className="mb-3"
                                    value={2}
                                  />
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.[${index}].cover_file_id`}
                                    component={Input}
                                    className="mb-3"
                                    value={contentData?.cover?.uuid}
                                  />
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.[${index}].body_file_id`}
                                    component={Input}
                                    className="mb-3"
                                    value={contentData?.file?.uuid}
                                  />
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                    }}
                                  >
                                    <div>
                                      <input
                                        id={`cover-image-${index}`}
                                        type="file"
                                        accept="image/png, image/jpeg,image/jpg"
                                        style={{ display: 'none' }}
                                        onChange={(event) => handleCoverImageChange(event, setFieldValue, index)}
                                      />
                                      <div className="text-black text-sm font-normal font-goth leading-[21px] mt-5 mb-2">
                                        Unggah Cover <span className="text-red-600">*</span>
                                      </div>

                                      <div
                                        onClick={() => document.getElementById(`cover-image-${index}`).click()}
                                        className="cursor-pointer w-[200px] h-[200px] bg-white rounded-[20px] shadow flex-col justify-center items-center inline-flex"
                                      >
                                        {values.contents[index].cover_image ? (
                                          <div className="relative">
                                            <img
                                              src={values.contents[index].cover_image}
                                              onClick={() => window.open(values.contents[index].cover_image, '_blank')}
                                              alt=""
                                              className="w-full h-[200px] object-cover rounded-[20px]"
                                            />
                                            <div className="absolute bottom-0 right-0 p-3">
                                              <div className="flex space-x-2">
                                                <div
                                                  className="px-3 py-2 bg-white rounded"
                                                  onClick={() => removeCoverImage(setFieldValue, index)}
                                                >
                                                  <img className="h-5 w-5" src="/img/icon/icon-trash.svg" alt="" />
                                                </div>
                                                <div
                                                  className="px-3 py-2 bg-white rounded"
                                                  onClick={() =>
                                                    document.getElementById(`cover-image-${index}`).click()
                                                  }
                                                >
                                                  <img className="h-5 w-5" src="/img/icon/photo.svg" alt="" />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="items-center text-center">
                                            <div className="w-8 h-8 px-3 py-2 bg-white rounded justify-center items-center gap-1 inline-flex">
                                              <div className="w-5 h-5 relative">
                                                <div className="w-5 h-5 left-0 top-0">
                                                  <img src="/img/icon/photo.svg" alt="" />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                              Add Photo
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-black text-sm font-normal font-goth leading-[21px] mt-3 mb-2">
                                        (Rasio 1:1, Max {UPLOAD_SIZE}mb)
                                      </div>
                                    </div>
                                    <div className="mb-6 mt-5 ml-8">
                                      <input
                                        id={`video-file-${index}`}
                                        type="file"
                                        accept=".pdf, .docx, .ppt, .pptx, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                        style={{ display: 'none' }}
                                        onChange={(event) => handleVideoFileChange(event, setFieldValue, index)}
                                      />
                                      <div className=" text-black text-sm font-normal font-goth leading-[21px] mb-2">
                                        Unggah Dokumen <span className="text-red-600">*</span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <Button
                                          type="button"
                                          onClick={() => document.getElementById(`video-file-${index}`).click()}
                                          loading={loadingQuestion}
                                          disabled={loadingQuestion}
                                          variant="plain"
                                          style={{ padding: '0px' }}
                                        >
                                          <span className="text-center cursor-pointer text-black text-sm font-normal font-goth leading-[21px] p-3 border border-stone-300 rounded-lg">
                                            Unggah File
                                          </span>
                                        </Button>
                                        {values.contents[index].video_file ? (
                                          <div className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center">
                                            <img
                                              src="/img/icon/icon-trash-file.svg"
                                              className="-mt-1 cursor-pointer mr-1"
                                              alt=""
                                              onClick={() => removeVideoFile(setFieldValue, index)}
                                            />
                                            <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                                              {values.contents[index].video_file}
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <label
                                      className="justify-start items-center gap-0.5 inline-flex mb-2 mt-4"
                                      htmlFor={`contents.${index}.title`}
                                    >
                                      <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                        Judul Materi
                                      </div>
                                      <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                                    </label>
                                    <div className="mb-3">
                                      <Field
                                        asterisk="true"
                                        type="text"
                                        autoComplete="off"
                                        name={`contents.${index}.title`}
                                        placeholder="Masukkan name materi"
                                        component={Input}
                                        className="mb-1"
                                      />
                                      <ErrorMessage
                                        name={`contents.${index}.title`}
                                        component="div"
                                        className="field-error"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      className="justify-start items-center gap-0.5 inline-flex mb-2"
                                      htmlFor={`contents.${index}.title`}
                                    >
                                      <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                        Deskripsi
                                      </div>
                                      <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                                    </label>
                                    <div className="mb-3">
                                      <Field
                                        asterisk="true"
                                        type="text"
                                        autoComplete="off"
                                        name={`contents.${index}.description`}
                                        placeholder="Masukkan name materi"
                                        component={Input}
                                        className="mb-1"
                                      />
                                    </div>
                                    <div className="text-black text-sm font-normal font-goth leading-[21px] -mt-3 mb-2">
                                      <ErrorMessage
                                        name={`contents.${index}.description`}
                                        component="div"
                                        className="field-error "
                                      />
                                      *Maksimal 200 karakter
                                    </div>
                                  </div>
                                  <img src="/img/others/Divider.svg" alt="" className="mb-4 mt-2 h-2" />

                                  <div
                                    className={`flex items-center justify-center content-center p-3 rounded-lg border border-red-600 space-x-2 cursor-pointer'
                                `}
                                    onClick={() => remove(index)}
                                  >
                                    <img src={'/img/icon/icon-trash.svg'} alt="" />
                                    <span className={`text-center text-red-600 `}>Delete Section</span>
                                  </div>
                                </AccordionItemCustome>
                              </AccordionCustome>
                            )}
                            {contentData.body_type == 3 && (
                              <AccordionCustome>
                                <AccordionItemCustome
                                  title="Teks Editor"
                                  className="text-black text-xl font-normal opificio"
                                  containerClass="m-4"
                                  headerClass="pb-4"
                                >
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.${index}.id`}
                                    placeholder="ID"
                                    component={Input}
                                    className="mb-3"
                                    value={contentData?.id}
                                  />
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.${index}.body_type`}
                                    placeholder="Masukkan body type"
                                    component={Input}
                                    className="mb-3"
                                    value={2}
                                  />
                                  <Field
                                    asterisk="true"
                                    type="hidden"
                                    autoComplete="off"
                                    name={`contents.[${index}].cover_file_id`}
                                    component={Input}
                                    className="mb-3"
                                    value={contentData?.cover?.uuid}
                                  />
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                    }}
                                  >
                                    <div>
                                      <input
                                        id={`cover-image-${index}`}
                                        type="file"
                                        accept="image/png, image/jpeg,image/jpg"
                                        style={{ display: 'none' }}
                                        onChange={(event) => handleCoverImageChange(event, setFieldValue, index)}
                                      />
                                      <div className="text-black text-sm font-normal font-goth leading-[21px] mt-5 mb-2">
                                        Unggah Cover <span className="text-red-600">*</span>
                                      </div>

                                      <div
                                        onClick={() => document.getElementById(`cover-image-${index}`).click()}
                                        className="cursor-pointer w-[200px] h-[200px] bg-white rounded-[20px] shadow flex-col justify-center items-center inline-flex"
                                      >
                                        {values.contents[index].cover_image ? (
                                          <div className="relative">
                                            <img
                                              src={values.contents[index].cover_image}
                                              onClick={() => window.open(values.contents[index].cover_image, '_blank')}
                                              alt=""
                                              className="w-full h-[200px] object-cover rounded-[20px]"
                                            />
                                            <div className="absolute bottom-0 right-0 p-3">
                                              <div className="flex space-x-2">
                                                <div
                                                  className="px-3 py-2 bg-white rounded"
                                                  onClick={() => removeCoverImage(setFieldValue, index)}
                                                >
                                                  <img className="h-5 w-5" src="/img/icon/icon-trash.svg" alt="" />
                                                </div>
                                                <div
                                                  className="px-3 py-2 bg-white rounded"
                                                  onClick={() =>
                                                    document.getElementById(`cover-image-${index}`).click()
                                                  }
                                                >
                                                  <img className="h-5 w-5" src="/img/icon/photo.svg" alt="" />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="items-center text-center">
                                            <div className="w-8 h-8 px-3 py-2 bg-white rounded justify-center items-center gap-1 inline-flex">
                                              <div className="w-5 h-5 relative">
                                                <div className="w-5 h-5 left-0 top-0">
                                                  <img src="/img/icon/photo.svg" alt="" />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                              Add Photo
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-black text-sm font-normal font-goth leading-[21px] mt-3 mb-2">
                                        (Rasio 1:1, Maks 1Mb)
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <label
                                      className="justify-start items-center gap-0.5 inline-flex mb-2 mt-4"
                                      htmlFor={`contents.${index}.title`}
                                    >
                                      <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                        Judul Materi
                                      </div>
                                      <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                                    </label>
                                    <div className="mb-3">
                                      <Field
                                        asterisk="true"
                                        type="text"
                                        autoComplete="off"
                                        name={`contents.${index}.title`}
                                        placeholder="Masukkan name materi"
                                        component={Input}
                                        className="mb-1"
                                      />
                                      <ErrorMessage
                                        name={`contents.${index}.title`}
                                        component="div"
                                        className="field-error"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      className="justify-start items-center gap-0.5 inline-flex mb-2"
                                      htmlFor={`contents.${index}.title`}
                                    >
                                      <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                        Deskripsi
                                      </div>
                                      <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                                    </label>
                                    <div className="mb-3">
                                      <Field
                                        asterisk="true"
                                        type="text"
                                        autoComplete="off"
                                        name={`contents.${index}.description`}
                                        placeholder="Masukkan name materi"
                                        component={Input}
                                        className="mb-1"
                                      />
                                    </div>
                                    <div className="text-black text-sm font-normal font-goth leading-[21px] -mt-3 mb-2">
                                      <ErrorMessage
                                        name={`contents.${index}.description`}
                                        component="div"
                                        className="field-error "
                                      />
                                      *Maksimal 200 karakter
                                    </div>
                                  </div>
                                  <div>
                                    <label
                                      className="justify-start items-center gap-0.5 inline-flex mb-2 mt-2"
                                      htmlFor={`contents.${index}.body_text`}
                                    >
                                      <div className="text-black text-sm font-normal font-goth leading-[21px]">
                                        Deskripsi Persiapan
                                      </div>
                                      <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                                    </label>
                                    <Field
                                      asterisk
                                      className="rounded-md border h-[109px] border-stone-300"
                                      type="text"
                                      autoComplete="off"
                                      name={`contents.${index}.body_text`}
                                      placeholder="Masukkan Deskripsi"
                                    >
                                      {({ field, form }) => {
                                        return (
                                          <div>
                                            <ReactQuill
                                              ref={quillRef}
                                              style={{ marginBottom: '24px' }}
                                              theme="snow"
                                              className="text-sm"
                                              // className="rounded-md border h-[109px]"
                                              initialValue=""
                                              placeholder="Masukkan Deskripsi"
                                              value={values.contents[index].body_text}
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
                                        name={`contentDataatest.${index}.body_text`}
                                        component="div"
                                        className="field-error "
                                      />
                                      *Maksimal 5000 karakter
                                    </div>
                                  </div>
                                  <img src="/img/others/Divider.svg" alt="" className="mb-4 mt-2 h-2" />

                                  <div
                                    className={`flex items-center justify-center content-center p-3 rounded-lg border border-red-600 space-x-2 cursor-pointer'
                                `}
                                    onClick={() => remove(index)}
                                  >
                                    <img src={'/img/icon/icon-trash.svg'} alt="" />
                                    <span className={`text-center text-red-600 `}>Delete Section</span>
                                  </div>
                                </AccordionItemCustome>
                              </AccordionCustome>
                            )}
                          </div>
                        ))}
                      <Button
                        type="button"
                        className="p-3 h-12 w-full"
                        onClick={() => onOpenAddQuestion()}
                        icon={<img src="/img/icon/btn-plus.svg" alt="" />}
                      >
                        <div className="text-center text-blue-950 text-base font-bold font-goth mt-1">
                          Tambah Konten
                        </div>
                      </Button>
                    </div>
                  );
                }}
              </FieldArray>
            </Form>
            <Dialog isOpen={isOpenAddQuestion} closable={false}>
              <div className="mb-1 flex items-center justify-between">
                <div className=" text-blue-950 text-xl font-normal font-opificio">Tambah Konten Materi</div>
                <img src="/img/icon/icon-radix.svg" className="cursor-pointer" alt="" onClick={onOpenAddQuestion} />
              </div>
              <div className="text-blue-950 text-sm font-normal font-goth leading-[21px]">
                Silahkan pilih jenis konten yang tersedia.
              </div>

              <div>
                <div className="flex items-center content-center mt-4 space-x-2" onClick={() => setTypeQuestion(1)}>
                  <CustomeRadio selected={typeQuestion == 1 ? true : false} />
                  <span className="text-black text-sm font-normal font-goth leading-[21px] mt-1">Materi Video</span>
                </div>
                <div className="flex items-center content-center mt-4 space-x-2" onClick={() => setTypeQuestion(2)}>
                  <CustomeRadio selected={typeQuestion == 2 ? true : false} />
                  <span className="text-black text-sm font-normal font-goth leading-[21px] mt-1">Lampiran Dokumen</span>
                </div>
                <div className="flex items-center content-center mt-4 space-x-2" onClick={() => setTypeQuestion(3)}>
                  <CustomeRadio selected={typeQuestion == 3 ? true : false} />
                  <span className="text-black text-sm font-normal font-goth leading-[21px] mt-1">Teks Editor</span>
                </div>
              </div>

              <div className="w-[512px] h-5"></div>
              <Button
                type="button"
                style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
                onClick={() => onChange(values, setFieldValue)}
                className="w-full mt-5 h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex"
              >
                <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">Konfirmasi</div>
              </Button>
            </Dialog>
          </AdaptableCard>
        )}
      </Formik>
    </>
  );
};

export default Content;
