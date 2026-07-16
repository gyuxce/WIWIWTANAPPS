import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams } from 'react-router-dom';
import { apiDownload, apiShow, apiUpdate } from '../api/api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { apiFile } from 'services/ApiBase';
import { Button, toast, Notification } from 'components/ui';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { PageConfig } from './config';
import { UPLOAD_SIZE } from 'constants/api.constant';

dayjs.extend(utc);
const DetailTestStudent = () => {
  const { id } = useParams();
  const [fileId, setFileId] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [data, setData] = useState({});
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Tes Karakter', path: '/test/character' },
    { label: 'Detail', path: '' },
  ];

  const getFile = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = async (event) => {
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
        return;
      }
      uploadFile(selectedFile);
    }
  };

  const uploadFile = async (selectedFile) => {
    setIsLoadingUpload(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    const ress = await apiFile(formData);
    if (ress) {
      setFileId(ress.data?.uuid);
      setFileName(selectedFile.name);
    } else {
      setFileId('');
    }
    setIsLoadingUpload(false);
  };

  const removeFile = () => {
    setFileId('');
    setFileName('');
  };

  const downloadFile = async () => {
    try {
      const result = await apiDownload(data?.fileTesCharacter?.id);
      if (result && result.status === 200) {
        const headers = result.headers;
        const blob = new Blob([result.data], { type: headers['content-type'] });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;

        const fileName = `${data?.fileTesCharacter?.filename}`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
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

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (fileId) {
        await apiUpdate(id, {
          file_tes_karakter_id: fileId,
          file_tes_character_status: 1,
        });

        await getData();
        removeFile();

        toast.push(
          <Notification title={'Successfuly Update'} type="success" duration={2500}>
            Data successfuly update
          </Notification>,
          {
            placement: 'top-center',
          },
        );
      } else {
        toast.push(
          <Notification title={'Error'} type="danger">
            {'File Not Found'}
          </Notification>,
          {
            placement: 'top-center',
          },
        );
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
    setIsLoading(false);
  };

  const getData = async () => {
    try {
      const params = {
        relations: 'user,fileTesCharacter',
      };
      const ress = await apiShow(id, params);
      setData(ress.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6 mb-1" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{data?.user?.name}</div>
        </div>
      </div>
      <Card className="border-none rounded-xl">
        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div className="p-1">
          <div className=" text-black text-xl font-normal font-opificio mb-6">Forum Tes Karakter</div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Lampiran</span>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="plain"
                loading={isLoadingUpload}
                disabled={isLoadingUpload}
                onClick={() => {
                  getFile();
                }}
                style={{ padding: '0px' }}
              >
                <span className="text-center cursor-pointer text-black text-sm font-normal font-goth leading-[21px] p-3 border border-stone-300 rounded-lg">
                  Unggah File
                </span>
              </Button>
              <div className="text-black">*Max {UPLOAD_SIZE}mb</div>
              {fileName ? (
                <div className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center">
                  <span className="mr-1">{fileName}</span>
                  <img
                    src="/img/icon/icon-trash-file.svg"
                    className="-mt-1 cursor-pointer"
                    onClick={() => removeFile()}
                    alt=""
                  />
                </div>
              ) : data.fileTesCharacter ? (
                <div
                  className="text-blue-950 text-sm font-normal font-goth leading-[21px] flex items-center cursor-pointer"
                  onClick={() => downloadFile()}
                >
                  <img src="/img/icon/icon-document.svg" className="mr-1" alt="" /> Download
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Nama Siswa</span>
            <span>{data?.user?.name}</span>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Tanggal Submit Tes</span>
            <span>{data?.finished_at ? dayjs(data?.finished_at).format('D MMM YYYY') : '-'}</span>
          </div>
          <div className="flex justify-between items-center text-black text-sm font-normal font-goth leading-[21px] pb-3 border-b border-stone-200 mb-5">
            <span>Status</span>
            {data?.status == 1 ? (
              <div className="">
                <span className="px-3 py-2 bg-green-50 rounded-full border border-green-500 text-green-500 text-xs font-normal font-goth">
                  {data.status_label}
                </span>
              </div>
            ) : (
              <div className="">
                {data.status_label !== null ? (
                  <div className="h-[31px] px-3 py-2 bg-orange-50 rounded-[100px] border border-orange-500 justify-center items-center gap-2.5 inline-flex">
                    <div className="text-orange-500 text-xs font-normal font-goth">{data.status_label}</div>
                  </div>
                ) : (
                  '-'
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              loading={isLoading}
              disabled={isLoading}
              onClick={() => {
                handleSubmit();
              }}
              className="w-[200px] h-12 p-3 mb-2"
            >
              <div className=" text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailTestStudent;
