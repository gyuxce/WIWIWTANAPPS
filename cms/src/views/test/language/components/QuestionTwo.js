import { Button, Input, Notification, toast } from 'components/ui';
import React from 'react';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { uploadFile } from 'utils/helper/uploadfile';
import { UPLOAD_SIZE } from 'constants/api.constant';

const QuestionTwo = ({
  number,
  handleQuestionActive,
  questionActive,
  getFile,
  removeQuestion,
  loadingQuestion,
  setLoading,
}) => {
  const handleTitleChange = (e) => {
    let new_data = { ...questionActive };
    new_data.title = e.target.value;
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

  const addOption = () => {
    let new_data = { ...questionActive };
    new_data.question_items.push({
      description: '',
      weight: 0,
    });
    handleQuestionActive(new_data);
  };
  const removeOption = (index) => {
    let new_data = { ...questionActive };
    new_data.question_items.splice(index, 1);
    handleQuestionActive(new_data);
  };

  const handleUpdateOption = (field, value, index) => {
    let new_data = { ...questionActive };
    let optionToUpdate = { ...new_data.question_items[index] };

    if (field === 'description') {
      optionToUpdate.description = value;
    } else if (field === 'weight') {
      const numericValue = parseFloat(value);
      optionToUpdate.weight = isNaN(numericValue) ? 0 : numericValue;
    }

    new_data.question_items[index] = optionToUpdate;

    handleQuestionActive(new_data);
  };
  return (
    <div>
      <input
        id="fileQtwo"
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
            <div className="text-black text-xl font-normal font-opificio">Pilihan Ganda</div>
          </div>
          <img src="/img/icon/trash-red.svg" className="cursor-pointer" onClick={() => removeQuestion()} alt="" />
        </div>
      </div>
      <div className="bg-white py-4 px-6 border-none rounded-b-xl rounded-t-none ">
        <Input
          placeholder="Masukkan soal disini..."
          onChange={handleTitleChange}
          value={questionActive.title}
          className="mb-6 border-t-0 border-r-0 rounded-none !p-3 border-l-0 text-gray-400 text-base font-normal font-goth leading-normal"
        />

        <div className="mb-6">
          <div className=" text-black text-sm font-normal font-goth leading-[21px] mb-2">Unggah Audio (Opsional)</div>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              loading={loadingQuestion}
              disabled={loadingQuestion}
              onClick={() => getFile('fileQtwo')}
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

        {questionActive?.question_items?.map((x, index) => (
          <div key={index} className="mb-6 flex items-center justify-between">
            <Input
              placeholder={'opsi ' + (index + 1)}
              onChange={(e) => handleUpdateOption('description', e.target.value, index)}
              value={x.description}
              className="w-[442px]"
            />
            <div className="flex items-center justify-center">
              <div className="text-black text-sm font-normal font-goth leading-[21px] mr-2">Bobot Soal</div>
              <Input
                placeholder=""
                onChange={(e) => handleUpdateOption('weight', e.target.value, index)}
                value={parseFloat(x.weight).toFixed(0)}
                className="w-[100px] mr-1"
              />
              {questionActive?.question_items?.length == index + 1 ? (
                <div className="flex items-center justify-center h-8 w-8" onClick={() => removeOption(index)}>
                  <img src="/img/icon/trash-black.svg" alt="" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-8 w-8"></div>
              )}
            </div>
          </div>
        ))}

        <Button type="button" className="" variant="plain" style={{ padding: '0px' }} onClick={() => addOption()}>
          <div className="rounded border border-black flex items-center justify-center space-x-2 px-3 py-2">
            <PlusCircledIcon Plus className="h-4 w-4 -mt-1" />
            <span className="text-center text-black text-xs font-normal font-goth">Tambah Jawaban</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuestionTwo;
