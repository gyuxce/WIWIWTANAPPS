import React, { useState, useEffect } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams } from 'react-router-dom';
import { Button, Dialog, Input, Notification, toast } from 'components/ui';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import QuestionNotFound from '../components/QuestionNotFound';
import CustomeRadio from '../components/CustomeRadio';
import QuestionTwo from '../components/QuestionTwo';
import QuestionOne from '../components/QuestionOne';
import { openNotification } from 'components/custom/NotificationComponent';
import { apiGetQuestionLanguage, apiPostQuestionLanguage } from '../api/api';
import { uploadFile } from 'utils/helper/uploadfile';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { UPLOAD_SIZE } from 'constants/api.constant';

const QuestionPage = () => {
  const [typeQuestion, setTypeQuestion] = useState('');
  const [isOpenAddQuestion, setIsOpenAddQuestion] = useState(false);

  const { id } = useParams();
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
    { label: 'Tes Bakat Bahasa', path: '/test/language' },
    { label: 'Konten Tes Bakat Bahasa', path: '/test/language?page=content' },
    { label: 'Buat Soal', path: '' },
  ];

  const getDataQuestion = async () => {
    try {
      const ress = await apiGetQuestionLanguage(id);
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

  const removeFileSesi = () => {
    setSesi({ ...sesi, body_file_id: '', file_name: '' });
  };

  const onOpenAddQuestion = () => {
    setIsOpenAddQuestion(!isOpenAddQuestion);
  };

  const submmitForm = async () => {
    setSubmitLoading(true);
    if (!sesi?.body_file_id) {
      openNotification('Error', 'danger', 'Video/audio wajib diisi');
      setSubmitLoading(false);
      return;
    }
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
      openNotification('Error', 'danger', 'Error saving data: ' + error?.response?.data?.message || error?.message);
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
      let cek_items = question.question_items.find((x) => x.description == '');
      if (cek_items) {
        message = 'Silakan isi option soal nomor ' + (index + 1);
        break;
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
          <div className="flex justify-center items-center">
            <Link to={'/test/language?page=content'}>
              <img src="/img/icon/previous.png" alt="" className="h-6 w-6 mb-1" />
            </Link>
            <div className="text-blue-950 text-xl font-normal font-opificio">Buat Soal</div>
          </div>
          <div>
            <Button
              type="button"
              loading={submitLoading}
              disabled={submitLoading || sesiLoading || loadingQuestion}
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
          <Card className="border-none rounded-xl px-1">
            <div className="text-black text-base font-semibold font-goth">Instruksi</div>
            <div className="my-6">
              <div className="text-black text-sm font-normal font-goth leading-[21px] mb-2">Instruksi (Opsional)</div>
              <Input
                name="notifikasi"
                onChange={(e) => setSesi({ ...sesi, description: e.target.value })}
                value={sesi.description}
                className="h-20 pl-3 pr-10 py-3"
                placeholder="ketik notifikasi"
                textArea
              />
            </div>
            <div className="w-[740px] text-black text-sm font-normal font-goth leading-[21px] mb-2">
              Unggah Video/Audio <span className="text-sm font-normal text-red-100">*</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="plain"
                loading={sesiLoading}
                disabled={sesiLoading}
                onClick={() => getFile('fileInput')}
                style={{ padding: '0px' }}
              >
                <span className="text-center cursor-pointer text-black text-sm font-normal font-goth leading-[21px] p-3 border border-stone-300 rounded-lg">
                  Unggah File
                </span>
              </Button>
              <div className="text-sm">*Maks {UPLOAD_SIZE}mb</div>

              {sesi.file_name ? (
                <div className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center">
                  <img
                    src="/img/icon/icon-trash-file.svg"
                    className="-mt-1 cursor-pointer mr-1"
                    alt=""
                    onClick={() => removeFileSesi()}
                  />
                  <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                    {sesi.file_name}
                  </div>
                </div>
              ) : null}
            </div>
          </Card>

          <img src="/img/others/line.svg" alt="" className="h-1 my-5" />
          {questionActive.id == '' ? (
            <QuestionNotFound questions={questions} />
          ) : questionActive.type == 1 ? (
            <QuestionOne
              number={indexQuestion + 1}
              getFile={getFile}
              handleQuestionActive={handleQuestionActive}
              questionActive={questionActive}
              removeQuestion={removeQuestion}
              loadingQuestion={loadingQuestion}
              setLoading={handleLoadingQuestion}
            />
          ) : (
            <QuestionTwo
              number={indexQuestion + 1}
              getFile={getFile}
              handleQuestionActive={handleQuestionActive}
              questionActive={questionActive}
              removeQuestion={removeQuestion}
              loadingQuestion={loadingQuestion}
              setLoading={handleLoadingQuestion}
            />
          )}
        </div>
        <div className="col-span-3">
          <Card className="border-none rounded-xl -py-1">
            <div className="text-zinc-600 text-sm font-semibold font-goth leading-[21px]">Nomor Soal</div>
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
          <div className="flex items-center content-center mt-4 space-x-2" onClick={() => onChange(1)}>
            <CustomeRadio selected={typeQuestion == 1 ? true : false} />
            <span className="text-black text-sm font-normal font-goth leading-[21px]">
              Pilihan Ganda (Bobot per soal)
            </span>
          </div>
          <div className="flex items-center content-center mt-4 space-x-2" onClick={() => onChange(2)}>
            <CustomeRadio selected={typeQuestion == 2 ? true : false} />
            <span className="text-black text-sm font-normal font-goth leading-[21px]">
              Pilihan Ganda (Bobot per opsi jawaban)
            </span>
          </div>
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

export default QuestionPage;
