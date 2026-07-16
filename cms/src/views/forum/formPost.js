import { ArchiveIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { AdaptableCard } from 'components/shared';
import { Button, FormContainer, FormItem, Input, Notification, Select, toast } from 'components/ui';
import { AccordionCardForm, AccordionCardFormItem } from 'components/ui/AccordionCardForm/AccordionCardForm';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { Field, Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import useAuth from 'utils/hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import useForum from 'utils/hooks/useForum';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { apiForumPostUpdate } from 'services/ForumService';

const validationSchema = Yup.object().shape({
  description: Yup.string().min(3, 'Too Short!').required('Konten Required'),
  topic_id: Yup.string().required('Topic Required'),
  title: Yup.string().min(3, 'Too Short!').required('Title Required'),
});

const FormPost = () => {
  const { id } = useParams();
  const { getTopicsForum, getListHashWords, hashWordsList, addForumPost } = useForum();
  const { getDetailForumPost, forumPostDetail } = useForum();
  const [content, setContent] = useState();

  const { dataUser } = useAuth();
  const navigate = useNavigate();
  const [filterTopik, setFilterTopik] = useState([]);
  const quillRef = useRef(null);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Daftar Postingan', path: '/forum' },
    { label: 'Buat Post Baru', path: '/forum/post' },
    // Add more breadcrumb items as needed
  ];

  const openNotification = (title, type, value) => {
    toast.push(
      <Notification title={title} type={type}>
        {value}
      </Notification>,
    );
  };

  const fetchDetailForum = async () => {
    try {
      const params = {
        relations: 'user.role,topic,parentComment.child,parentComment.user',
      };
      const data = await getDetailForumPost(id, params);
      const text = JSON.parse(JSON.parse(data?.data?.description));
      const converter = new QuillDeltaToHtmlConverter(text?.ops, {
        inlineStyles: true,
      });
      let convertedHtml = converter.convert();
      convertedHtml = convertedHtml
        .replace(/<ol>/g, '<ol class="list-decimal">')
        .replace(/<ul>/g, '<ul class="list-disc">');
      setContent(convertedHtml);
    } catch (error) {
      openNotification('Error', 'danger', error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetailForum();
    }
  }, [id]);

  const loadTopics = async () => {
    try {
      const listTopicForum = await getTopicsForum({
        q: null,
        type: 'collection',
      });
      setFilterTopik(
        listTopicForum?.map((v) => {
          return {
            value: v.id,
            label: v.name,
          };
        }),
      );
    } catch (error) {
      openNotification('Error', 'danger', error?.message);
    }
    // setFirstLoad(false);
  };

  const loadHashWords = async () => {
    try {
      await getListHashWords({
        type: 'collection',
      });
    } catch (error) {
      openNotification('Error', 'danger', error?.message);
    }
  };

  const uploadImages = (quill) => {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
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
            message: 'File tidak boleh melebihi 2MB',
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
    loadTopics();
    loadHashWords();
    quillRef.current
      ?.getEditor()
      .getModule('toolbar')
      .addHandler('image', () => {
        uploadImages(quillRef.current);
      });
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
        'image',
      ],
    ],
  };

  const formats = ['bold', 'italic', 'align', 'list', 'bullet', 'indent', 'image', 'underline'];

  const submitEvent = async (values) => {
    try {
      let postForumResponse;
      let data;
      if (id) {
        postForumResponse = await apiForumPostUpdate(id, values);
        data = postForumResponse.data.data;
      } else {
        postForumResponse = await addForumPost(values);
        data = postForumResponse.data;
      }

      if (data?.id) {
        const actionVerb = id ? 'diubah' : 'dibuat';
        const editCondition = data?.is_publish === '1' ? 'lagi setelah 24 Jam' : 'draft post kamu';
        const message = `Post kamu berhasil ${actionVerb}. Kamu dapat edit ${editCondition}.`;

        openNotification('Terima Kasih', 'success', message);
        navigate(`/forum/detail/${data?.id}`);
      } else {
        openNotification('Error', 'danger', postForumResponse?.message);
      }
    } catch (error) {
      openNotification('Error', 'danger', error?.message);
    }
  };

  return (
    <div className="mt-7 w-full pr-7 ml-7">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="text-xl mt-2 mb-5">{id ? 'Edit Post' : 'Buat Post Baru'}</div>
      <div>
        <Formik
          initialValues={{
            title: forumPostDetail?.title || '',
            description: content || '',
            topic_id: forumPostDetail?.topic?.id || '',
            is_draft: 0,
            is_publish: 0,
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            const { current } = quillRef;

            const { ops } = current.getEditor().getContents() || [];
            const dataHarsh = hashWordsList.map((item) => item?.name);
            const highlightedTextSet = new Set();

            ops?.forEach((item) => {
              if (!item?.insert?.image) {
                const hars = new RegExp(`(${dataHarsh.join('|')})`, 'gi');
                const parts = item?.insert?.split(hars);
                parts?.forEach((part) => {
                  const isHighlighted = dataHarsh.some(
                    (searchTerm) => part?.toLowerCase() === searchTerm?.toLowerCase(),
                  );
                  if (isHighlighted) {
                    highlightedTextSet.add(part?.toLowerCase());
                  }
                });
              }
            });

            const highlightedTextArray = [...highlightedTextSet];

            if (highlightedTextArray?.length > 0) {
              setTimeout(() => {
                openNotification(
                  'Coba cek lagi deh postingan kamu',
                  'danger',
                  'Ada beberapa kata yang dilarang di forum Wiwitan, perbaiki yuk',
                );
              }, 400);
              return false;
            } else {
              const textData = current.getEditor().getContents();
              setTimeout(() => {
                const resultValue = {
                  ...values,
                  description: JSON.stringify(JSON.stringify(textData)),
                  status: 1,
                  user_id: dataUser?.user.id,
                };
                setSubmitting(false);
                submitEvent(resultValue);
                resetForm();
              }, 400);
            }
          }}
        >
          {({ values, touched, errors, isSubmitting, handleSubmit, setFieldValue }) => (
            <div className="flex flex-row gap-5">
              <AdaptableCard className="rounded-2xl border-none w-[65%] " bodyClass="p-6">
                <Form>
                  <FormContainer>
                    <FormItem label="Judul" invalid={errors.title && touched.title} errorMessage={errors.title}>
                      <Field
                        asterisk="true"
                        type="text"
                        autoComplete="off"
                        name="title"
                        value={values.title}
                        placeholder="Masukkan Judul"
                        component={Input}
                        required
                      />
                    </FormItem>
                    <FormItem
                      label="Konten"
                      invalid={errors.description && touched.description}
                      errorMessage={errors.description}
                    >
                      <Field asterisk type="text" autoComplete="off" name="description" placeholder="Description">
                        {({ field, form }) => {
                          return (
                            <ReactQuill
                              ref={quillRef}
                              style={{ height: '300px', marginBottom: '24px' }}
                              theme="snow"
                              initialValue=""
                              value={values.description || ''}
                              onChange={(val) => {
                                form.setFieldValue(field.name, val);
                              }}
                              modules={modules}
                              formats={formats}
                            />
                          );
                        }}
                      </Field>
                    </FormItem>
                  </FormContainer>
                </Form>
              </AdaptableCard>
              <div className="flex flex-col">
                <AccordionCardForm>
                  <AccordionCardFormItem title="Penerbitan">
                    <div className="flex flex-col gap-2 pb-5 border-b-[1px] border-grey-150 mb-2">
                      <div className="inline-flex justify-between items-center mb-1">
                        <div>Status :</div>
                        <div>
                          {id ? (
                            <span
                              style={{
                                width: '65px',
                                height: '31px',
                                borderRadius: '100px',
                                border: '1px solid',
                                padding: '8px 12px',
                              }}
                              className={`inline-flex items-center justify-center text-xs font-normal font-goth ${
                                forumPostDetail?.is_publish == 1
                                  ? 'bg-green-50 border-green-500 text-green-500'
                                  : 'bg-red-50 border-red-500 text-red-500'
                              }`}
                            >
                              {forumPostDetail?.is_publish == 1 ? 'Terbit' : 'Draft'}
                            </span>
                          ) : (
                            '-'
                          )}
                        </div>
                      </div>
                      <div className="inline-flex justify-between">
                        <div>Diterbitkan Pada :</div>
                        <div>
                          {forumPostDetail?.is_publish == 1
                            ? dayjs(forumPostDetail?.updated_at).format('DD MMMM YYYY, HH:mm')
                            : '-'}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row mt-2 mb-2">
                      <Button
                        className="w-[141px] h-4"
                        variant="plain"
                        icon={<ArchiveIcon color="#C63838" />}
                        loading={isSubmitting}
                        disabled={isSubmitting || forumPostDetail?.is_publish == 1}
                        onClick={() => {
                          setFieldValue('is_draft', 1);
                          setFieldValue('is_publish', 0);
                          handleSubmit();
                        }}
                      >
                        <div className="text-red-300 text-sm">Masukkan Draft</div>
                      </Button>
                      <Button
                        className="w-[141px] h-4"
                        variant="plain"
                        icon={<PaperPlaneIcon />}
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        onClick={() => {
                          setFieldValue('is_draft', 0);
                          setFieldValue('is_publish', 1);
                          handleSubmit();
                        }}
                      >
                        {id ? 'Simpan Postingan' : 'Buat Postingan'}
                      </Button>
                    </div>
                  </AccordionCardFormItem>
                </AccordionCardForm>
                <AccordionCardForm>
                  <AccordionCardFormItem title="Topik">
                    <FormContainer>
                      <FormItem label="Topik" invalid={errors.topic && touched.topic_id} errorMessage={errors.topic_id}>
                        <Field autoComplete="off" name="topic_id" placeholder="Topik" required>
                          {({ field, form }) => {
                            const optionData = filterTopik?.map((option) => ({
                              value: option?.value,
                              label: option?.label,
                            }));
                            return (
                              <div>
                                <Select
                                  className={
                                    errors.topic_id && touched.topic_id
                                      ? 'border rounded-md border-2 border-red-100' // Add border class for error state
                                      : ''
                                  }
                                  required
                                  size="md"
                                  options={optionData}
                                  onChange={(option) => {
                                    form.setFieldValue(field.name, option.value);
                                  }}
                                  value={optionData.find((v) => v.value === values.topic_id)}
                                  placeholder="Pilih Topik"
                                />
                              </div>
                            );
                          }}
                        </Field>
                        {errors.topic_id && touched.topic_id && <div className="text-red-100">{errors.topic_id}</div>}
                      </FormItem>
                    </FormContainer>
                  </AccordionCardFormItem>
                </AccordionCardForm>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FormPost;
