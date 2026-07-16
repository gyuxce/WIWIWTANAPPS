import React, { useState, useEffect } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams } from 'react-router-dom';
import { Button, Dialog, Notification, toast } from 'components/ui';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { openNotification } from 'components/custom/NotificationComponent';
import { uploadFile } from 'utils/helper/uploadfile';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { apiGetQuestionLanguage, apiPostQuestionLanguage } from 'views/test/language/api/api';
import QuestionNotFound from 'views/test/language/components/QuestionNotFound';
import QuestionOne from 'views/test/language/components/QuestionOne';
import QuestionTwo from 'views/test/language/components/QuestionTwo';
import CustomeRadio from 'views/test/language/components/CustomeRadio';
import { PageConfig as ModuleConfig } from '../../../config';
import { QUESTION_TYPE } from 'components/ui/utils/constant';
import QuestionThree from 'views/test/language/components/QuestionThree';
import QuestionFour from 'views/test/language/components/QuestionFour';
import { UPLOAD_SIZE } from 'constants/api.constant';

const QuestionForm = () => {
  const [typeQuestion, setTypeQuestion] = useState('');
  const [isOpenAddQuestion, setIsOpenAddQuestion] = useState(false);

  const { id, id_package, parentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [showManyStatus, setShowManyStatus] = useState(false);
  const [questionActive, setQuestionActive] = useState({
    id: '',
  });
  const [indexQuestion, setIndexQuestion] = useState(null);
  const [sesi, setSesi] = useState({
    description: '',
    body_file_id: '',
    file_name: '',
  });

  const [sesiLoading, setSesiLoading] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: ModuleConfig.moduleTitle, path: ModuleConfig.detailModulelUrl + id },
    { label: 'Detail', path: `${ModuleConfig.detailModulelUrl + parentId}` },
    { label: 'Asesmen Soal', path: `${ModuleConfig.detailModulelUrl + parentId}/assesment/${id}/question` },
    { label: 'Tambah Soal', path: '' },
  ];

  const getDataQuestion = async () => {
    try {
      const ress = await apiGetQuestionLanguage(id_package);
      setSesi({
        sesi_question_id: ress?.data?.id,
        description: ress?.data?.description,
        body_file_id: ress?.data?.file?.id,
        file_name: ress?.data?.file?.filename,
      });
      setQuestions(ress?.data?.question);
      if (ress?.data?.question?.length > 0) {
        setIndexQuestion(0);
        changeQuestion(ress?.data?.question[0]);
      }
    } catch (error) {
      openNotification('Error', 'danger', 'Error saving data: ' + error);
    }
  };

  useEffect(() => {
    getDataQuestion();
  }, []);

  const onChange = (val) => {
    setTypeQuestion(val);
  };

  const handleLoadingQuestion = (val) => {
    setLoadingQuestion(val);
  };

  const getFile = (id) => {
    document.getElementById(id).click();
  };

  const handleFileChange = async (event) => {
    setSesiLoading(true);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeInMB > UPLOAD_SIZE) {
        toast.push(
          <Notification title={'Error'} type="danger">
            {'Maximum size ' + UPLOAD_SIZE + ' MB'}
          </Notification>,
          {
            placement: 'top-center',
          },
        );
        setSesiLoading(false);
        return; // Menghentikan eksekusi jika ukuran melebihi batas
      }
      const ress = await uploadFile(selectedFile);
      if (ress) {
        setSesi({ ...sesi, body_file_id: ress?.data?.uuid, file_name: ress?.data?.filename });
      }
    }
    setSesiLoading(false);
  };

  const onOpenAddQuestion = () => {
    setIsOpenAddQuestion(!isOpenAddQuestion);
  };

  const submmitForm = async () => {
    setSubmitLoading(true);
    try {
      let error_message = validation();
      if (error_message) {
        openNotification('Error', 'danger', error_message);
      } else {
        let param = {
          ...sesi,
          questions: questions,
        };
        await apiPostQuestionLanguage(param);
        openNotification('Success', 'success', 'Berhasil Simpan Data');
      }
    } catch (error) {
      openNotification('Error', 'danger', 'Error saving data: ' + error);
    }
    setSubmitLoading(false);
  };

  const changeQuestion = (question) => {
    let mapData = { ...question };
    if (!mapData.body_file_id && !mapData.removeFile) {
      mapData.body_file_id = mapData?.file?.id;
      mapData.file_name = mapData?.file?.filename;
    }
    setQuestionActive(mapData);
  };

  const handleQuestionActive = (new_data) => {
    let data_question = [...questions];
    data_question.splice(indexQuestion, 1, new_data);
    setQuestions(data_question);
    changeQuestion(new_data);
  };

  const removeQuestion = () => {
    let new_data = [...questions];
    new_data.splice(indexQuestion, 1);
    setQuestions(new_data);
    setQuestionActive({
      id: '',
    });
    setIndexQuestion('');
  };

  const addQuestion = () => {
    if (typeQuestion) {
      let new_question = {
        title: '',
        weight_true: 0,
        question_items: [
          {
            description: '',
            is_correct: typeQuestion == 1 ? 1 : 0,
            weight: 0,
          },
        ],
        body_file_id: '',
        type: typeQuestion,
      };
      setQuestionActive(new_question);
      setQuestions([...questions, new_question]);
      setTypeQuestion('');
      setIsOpenAddQuestion(false);
      setIndexQuestion(questions.length);
      if (questions.length > 12) {
        setShowManyStatus(true);
      }
    } else {
      openNotification('Error', 'danger', 'Silakan pilih type soal');
    }
  };

  const validation = () => {
    let message = '';
    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];

      if (question.title === '') {
        message = 'Silakan isi soal nomor ' + (index + 1);
        break;
      }
      if (question.type == QUESTION_TYPE[0]?.value || question.type == QUESTION_TYPE[1]?.value) {
        let cek_items = question.question_items.find((x) => x.description == '');
        if (cek_items) {
          message = 'Silakan isi option soal nomor ' + (index + 1);
          break;
        }
      }
      if (question.type == QUESTION_TYPE[2]?.value) {
        if (question.description === '') {
          message = 'Silakan isi konten membaca nomor ' + (index + 1);
          break;
        }
      }
    }
    return message;
  };

  return (
    <div className="px-7">
      <input
        id="fileInput"
        type="file"
        accept="audio/*,video/*,.pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-between items-center">
          <div className="flex justify-start items-center">
            <Link to={`${ModuleConfig.detailModulelUrl + parentId}/assesment/${id}/question`}>
              <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
            </Link>
            <div className="text-blue-950 text-xl font-normal font-opificio">Tambah Soal</div>
          </div>
          <div>
            <Button
              type="button"
              loading={submitLoading}
              disabled={
                submitLoading ||
                sesiLoading ||
                loadingQuestion ||
                (questionActive?.type == QUESTION_TYPE?.[2]?.value && questionActive?.description?.length > 1000)
              }
              className="w-[200px] h-12 p-3"
              onClick={() => submmitForm()}
            >
              <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          {questionActive.type == QUESTION_TYPE[0]?.value ? (
            <QuestionOne
              number={indexQuestion + 1}
              getFile={getFile}
              handleQuestionActive={handleQuestionActive}
              questionActive={questionActive}
              removeQuestion={removeQuestion}
              loadingQuestion={loadingQuestion}
              setLoading={handleLoadingQuestion}
            />
          ) : questionActive.type == QUESTION_TYPE[1]?.value ? (
            <QuestionTwo
              number={indexQuestion + 1}
              getFile={getFile}
              handleQuestionActive={handleQuestionActive}
              questionActive={questionActive}
              removeQuestion={removeQuestion}
              loadingQuestion={loadingQuestion}
              setLoading={handleLoadingQuestion}
            />
          ) : questionActive.type == QUESTION_TYPE[2]?.value ? (
            <QuestionThree
              number={indexQuestion + 1}
              name={QUESTION_TYPE[2]?.label}
              getFile={getFile}
              handleQuestionActive={handleQuestionActive}
              questionActive={questionActive}
              removeQuestion={removeQuestion}
              loadingQuestion={loadingQuestion}
              setLoading={handleLoadingQuestion}
            />
          ) : questionActive.type == QUESTION_TYPE[3]?.value ? (
            <QuestionFour
              number={indexQuestion + 1}
              name={QUESTION_TYPE[3]?.label}
              getFile={getFile}
              handleQuestionActive={handleQuestionActive}
              questionActive={questionActive}
              removeQuestion={removeQuestion}
              loadingQuestion={loadingQuestion}
              setLoading={handleLoadingQuestion}
            />
          ) : questionActive.type == QUESTION_TYPE[4]?.value ? (
            <QuestionFour
              number={indexQuestion + 1}
              name={QUESTION_TYPE[4]?.label}
              getFile={getFile}
              handleQuestionActive={handleQuestionActive}
              questionActive={questionActive}
              removeQuestion={removeQuestion}
              loadingQuestion={loadingQuestion}
              setLoading={handleLoadingQuestion}
            />
          ) : (
            <QuestionNotFound questions={questions} />
          )}
        </div>
        <div className="col-span-3">
          <Card className="border-none rounded-xl -py-1">
            <div className="text-[#484C57] text-sm font-semibold font-goth leading-[21px]">Nomor Soal</div>
            <Button
              type="button"
              className="w-full my-4"
              variant="plain"
              style={{ padding: '0px' }}
              onClick={() => onOpenAddQuestion()}
            >
              <div className="rounded border border-black flex items-center justify-center space-x-1 py-2">
                <PlusCircledIcon className="h-4 w-4 -mt-1" />
                <span className="text-center text-black text-xs font-normal font-goth">Tambah Soal</span>
              </div>
            </Button>

            {questions.length < 1 ? (
              <div className="h-[83px] flex items-center justify-center text-center text-black text-xs font-normal font-goth">
                Belum ada data
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-12 gap-x-5 gap-y-3">
                  {questions.slice(0, showManyStatus ? questions.length : 12).map((x, index) => (
                    <div
                      key={index}
                      onClick={
                        sesiLoading && loadingQuestion
                          ? ''
                          : () => {
                              changeQuestion(x);
                              setIndexQuestion(index);
                            }
                      }
                      className={`cursor-pointer col-span-3  p-2.5  rounded-lg border ${
                        index === indexQuestion ? 'border-red-500 bg-red-50 ' : 'bg-gray-100 '
                      } flex-col justify-center items-center gap-2.5 inline-flex`}
                    >
                      <div
                        className={` ${
                          index === indexQuestion ? ' text-red-500' : 'text-gray-800 '
                        } text-sm font-semibold font-goth leading-[21px]`}
                      >
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                {questions.length > 12 ? (
                  <div
                    onClick={() => setShowManyStatus(!showManyStatus)}
                    className="cursor-pointer text-center text-blue-950 text-xs font-semibold font-goth mt-4"
                  >
                    Lihat Lebih {showManyStatus ? 'Sedikit' : 'Banyak'}
                  </div>
                ) : null}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Dialog isOpen={isOpenAddQuestion} closable={false}>
        <div className="mb-1 flex items-center justify-between">
          <div className=" text-blue-950 text-xl font-normal font-opificio">Tambah Soal</div>
          <img src="/img/icon/icon-radix.svg" className="cursor-pointer" alt="" onClick={onOpenAddQuestion} />
        </div>
        <div className="text-blue-950 text-sm font-normal font-goth leading-[21px]">
          Silahkan pilih jenis soal yang tersedia.
        </div>

        <div>
          {QUESTION_TYPE.map((dt, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center content-center mt-4 space-x-2"
                onClick={() => onChange(dt.value)}
              >
                <CustomeRadio selected={typeQuestion === dt.value} />
                <span className="text-black text-sm font-normal font-goth leading-[21px]">{dt.label}</span>
              </div>
            );
          })}
        </div>

        <div className="w-[512px] h-5"></div>
        <Button
          type="submit"
          style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
          onClick={() => addQuestion()}
          className="w-full mt-5 mb-6 h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex"
        >
          <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">Konfirmasi</div>
        </Button>
      </Dialog>
    </div>
  );
};

export default QuestionForm;
