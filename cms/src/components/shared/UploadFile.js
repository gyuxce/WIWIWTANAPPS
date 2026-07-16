import { TrashIcon } from '@radix-ui/react-icons';
import CloudUploadSvg from 'components/custom/svg/CloudUploadSvg';
import { Upload, Button, Progress } from 'components/ui';
import React from 'react';

const UploadFile = ({ accept, onChange, onRemove, file, progressValue }) => {
  return (
    <div className="flex flex-col justify-center items-center h-[212px] border rounded-lg">
      <CloudUploadSvg />
      <p className="text-copy-b mt-1">Upload Data (.xlsx)</p>
      {file ? (
        <>
          <div className="mt-1 flex items-center">
            <p className="text-copy text-main-400 ">{file?.name ?? ''}</p>
            <TrashIcon color="#EF4444" width={24} height={20} onClick={onRemove} className="cursor-pointer" />
          </div>
          {progressValue > 0 && progressValue < 100 ? (
            <div className="w-full px-5 mt-10">
              <Progress percent={progressValue} />
            </div>
          ) : null}
        </>
      ) : (
        <Upload
          showList={false}
          uploadLimit={1}
          accept={
            accept || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
          }
          onChange={onChange}
        >
          <Button className="text-sub-b !h-8 !rounded mt-5 !py-0" type="button">
            Browse File
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default UploadFile;
