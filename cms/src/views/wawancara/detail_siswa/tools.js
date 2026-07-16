import { Button, Dialog } from 'components/ui';
import {
  MixerHorizontalIcon,
  SymbolIcon,
  DownloadIcon,
  TrashIcon,
  UploadIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { useState, useRef } from 'react';
import { PageConfig } from '../config';
import { RiFileExcel2Line } from 'react-icons/ri';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Filter } from './filter';
import { useNavigate } from 'react-router-dom';
import { exportData } from 'utils/helper/uploadfile';
import { apiExport } from '../api';
import { TableSearch } from 'components/custom/search';
dayjs.extend(utc);

export const Tools = (props) => {
  const [openDialogBulkConfirm, setopenDialogBulkConfirm] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [countFilter, setCountFilter] = useState(0);

  const dropdownItems = [];

  if (PageConfig.enableTemplateTools) {
    dropdownItems.push({
      key: 'Download',
      label: 'Download Template',
      icon: <RiFileExcel2Line size={15} />,
      className: 'text-gray-800 font-normal leading-normal',
      onClick: null,
    });
  }

  if (PageConfig.enableImportTools) {
    dropdownItems.push({
      key: 'Import',
      label: 'Import .xlsx',
      icon: <DownloadIcon />,
      className: 'text-gray-800 font-normal leading-normal',
      onClick: () => {
        ref.current.click();
      },
    });
  }

  if (PageConfig.enableExportTools) {
    dropdownItems.push({
      key: 'Export',
      label: 'Export Data',
      icon: <UploadIcon />,
      className: 'text-gray-800 font-normal leading-normal',
    });
  }

  const onDialogClose = () => {
    setopenDialogBulkConfirm(false);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportData('xlsx', apiExport, 'wawancara', props.localState.params);
    setIsExporting(false);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-[1rem]">
          {PageConfig.enableBulkDelete && props.deleteIds.length > 0 && (
            <Button
              variant="solid"
              color="red-600"
              size="sm"
              className="block mb-0"
              icon={<TrashIcon />}
              onClick={() => {
                setopenDialogBulkConfirm(true);
              }}
            >
              Bulk Delete
            </Button>
          )}

          {PageConfig.enableRefreshTable && (
            <Button
              icon={<SymbolIcon />}
              size="sm"
              className="block mb-0"
              onClick={() => {
                props.getData(props.localState.params);
              }}
            />
          )}
          <TableSearch size="md" placeholder="Cari" localState={props.localState} getData={props.getData} />

          <Button
            className={`w-[200px] h-[40px] !px-[12px] ml-3 text-second-100 border-gray-300`}
            variant="plain"
            onClick={() => {
              setToggleDrawer((prev) => !prev);
            }}
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-1 items-center">
                <div>
                  <MixerHorizontalIcon style={{ height: '16px', width: '16px' }} />
                </div>
                <div className="text-[12px]">Filter</div>
              </div>
              {countFilter > 0 ? (
                <div className="h-auto w-5 bg-main-200 rounded flex justify-center items-center">
                  <p className="text-sub-b text-white -mb-[2px] text-[12px]">{countFilter}</p>
                </div>
              ) : null}
            </div>
          </Button>
        </div>

        <div className="flex justify-end items-center space-x-[0.5rem]">
          {PageConfig.enableTools && (
            <Button
              isAction
              loading={isExporting}
              icon={<DownloadIcon height={16} width={16} />}
              type="button"
              onClick={handleExport}
              className="bg-white !px-3 !py-2 flex items-center !rounded"
            >
              <div className="mt-1 ml-1 !font-goth text-black  !font-normal text-xs">Export Data</div>
            </Button>
          )}
          <Button
            isAction
            icon={<CheckCircledIcon height={16} width={16} />}
            type="button"
            onClick={() => navigate(`${PageConfig.url}/${props.id}/create`)}
            className="bg-white !px-3 !py-2 flex items-center !rounded"
          >
            <div className="mt-1 ml-1 !font-goth text-black !font-normal text-xs">Tambah Jadwal</div>
          </Button>
        </div>
      </div>

      <Dialog
        isOpen={openDialogBulkConfirm}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
        width={600}
        closable={false}
        className={'relative'}
      >
        <div className="flex flex-col p-4">
          <div className="flex justify-center">
            <ExclamationTriangleIcon height={64} width={64} color="#C63838" />
          </div>
          <div className="flex flex-col">
            <p className="text-h3 font-opificio text-black text-center mt-10">
              Lanjutkan progres siswa ke tahap wawancara?
            </p>
            <div className="flex justify-center mt-4">
              <p className="font-goth text-second-500 text-center">
                Status yang sudah di konfirmasi, tidak dapat dipulihkan. Pastikan siswa sudah mencapai target kelulusan
                minimum.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex justify-center gap-2">
              <Button variant="default" className="!py-0 h-10 w-[200px]" onClick={onDialogClose}>
                <div className="text-black font-normal">Tidak, Kembali</div>
              </Button>

              <Button variant="default" className="!py-0 h-10 w-[200px]">
                <div className="text-black font-normal">Ya, Konfirmasi</div>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Filter
        id={props.id}
        localState={props.localState}
        getData={props.getData}
        setCountFilter={setCountFilter}
        setToggleDrawer={setToggleDrawer}
        toggleDrawer={toggleDrawer}
        interviewers={props.interviewers}
        agencies={props.agencies}
      />
    </>
  );
};
