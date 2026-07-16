import { Button, Input, Notification, toast } from 'components/ui';
import React from 'react';
import { uploadFile } from 'utils/helper/uploadfile';
import { UPLOAD_SIZE } from 'constants/api.constant';

const QuestionFour = ({
  number,
  name,
  handleQuestionActive,
  questionActive,
  getFile,
  removeQuestion,
  loadingQuestion,
  setLoading,
}) => {
  const handleTitleChange = (field, value) => {
    let new_data = { ...questionActive };
    if (field === 'weight_true') {
      const numericValue = parseFloat(value);
      new_data[field] = isNaN(numericValue) ? 0 : numericValue;
    } else {
      new_data[field] = value;
    }
    handleQuestionActive(new_data);
  };

  const handleFileChangeQuestion = async (event) => {
    setLoading(true);
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
        setLoading(false);
        return; // Menghentikan eksekusi jika ukuran melebihi batas
      }
      const ress = await uploadFile(selectedFile);
      if (ress) {
        let new_data = { ...questionActive, body_file_id: ress?.data?.uuid, file_name: ress?.data?.filename };
        handleQuestionActive(new_data);
      }
    }
    setLoading(false);
  };

  const removeFileQuestion = () => {
    let new_data = { ...questionActive, body_file_id: '', file_name: '', removeFile: true };
    handleQuestionActive(new_data);
  };

  return (
    <div>
      <input
        id="fileQone"
        type="file"
        accept="audio/*,video/*,.pdf"
        style={{ display: 'none' }}
        onChange={handleFileChangeQuestion}
      />
      <div className="bg-white py-3 border border-b-2 border-stone-50  px-6 rounded-t-xl rounded-b-none ">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex justify-center content-center items-center">
              <div className="text-gray-800 text-xl font-normal font-opificio -mb-1">{number}</div>
            </div>
            <div className="text-black text-xl font-normal font-opificio">{name}</div>
          </div>
          <div className="flex items-center">
            <div className="text-black text-sm font-normal font-goth leading-[21px] mr-2">Bobot Soal</div>
            <Input
              onChange={(e) => handleTitleChange('weight_true', e.target.value)}
              placeholder=""
              value={questionActive?.weight_true}
              className="w-[100px] mr-3"
            />
            <img src="/img/icon/trash-red.svg" onClick={() => removeQuestion()} alt="" />
          </div>
        </div>
      </div>
      <div className="bg-white py-4 px-6 border-none rounded-b-xl rounded-t-none ">
        <Input
          placeholder="Masukkan soal disini..."
          onChange={(e) => handleTitleChange('title', e.target.value)}
          value={questionActive.title}
          className="mb-6 border-t-0 border-r-0 rounded-none !p-3 border-l-0 text-gray-400 text-base font-normal font-goth leading-normal"
        />

        <div className="mb-6">
          <div className=" text-black text-sm font-normal font-goth leading-[21px] mb-2">Unggah Audio (Opsional)</div>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              onClick={() => getFile('fileQone')}
              loading={loadingQuestion}
              disabled={loadingQuestion}
              variant="plain"
              style={{ padding: '0px' }}
            >
              <span className="text-center cursor-pointer text-black text-sm font-normal font-goth leading-[21px] p-3 border border-stone-300 rounded-lg">
                Unggah File
              </span>
            </Button>
            {questionActive.file_name ? (
              <div className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center">
                <img
                  src="/img/icon/icon-trash-file.svg"
                  className="-mt-1 cursor-pointer mr-1"
                  alt=""
                  onClick={() => removeFileQuestion()}
                />
                <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                  {questionActive.file_name}
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-1 text-black">*Max {UPLOAD_SIZE}mb</div>
        </div>
      </div>
    </div>
  );
};

export default QuestionFour;
