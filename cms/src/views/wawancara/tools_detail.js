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
import { PageConfig } from './config';
import { RiFileExcel2Line } from 'react-icons/ri';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import SideBar from 'components/template/SideFilter';
import { Filter } from './detail_siswa/filter';
dayjs.extend(utc);

export const Tools = (props) => {
  const [openDialogBulkConfirm, setopenDialogBulkConfirm] = useState(false);
  const ref = useRef();
  const [checkboxListStatus, setCheckboxListStatus] = useState([]);
  const [checkboxListType, setCheckboxListType] = useState([]);
  const [checkboxSorting] = useState();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const handleDateStartDate = (date) => {
    if (date == null) {
      setStartDate('');
    } else {
      setStartDate(date);
    }
  };

  const handleDateEndDate = (date) => {
    if (date == null) {
      setEndDate('');
    } else {
      setEndDate(date);
    }
  };

  const submitFilter = async () => {
    let params = { ...props.localState.params };
    let optionsFilter = [];
    if (checkboxListStatus.length > 0) {
      optionsFilter.push('filter,status,in,' + checkboxListStatus.join('|'));
    }
    if (checkboxListType.length > 0) {
      optionsFilter.push('filter,certification.name,in,' + checkboxListType.join('|'));
    }
    params.options = [params.options[0], ...optionsFilter];
    props.getData(params);
    setToggleDrawer(false);
  };

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

  const parsedStatus = () => {
    return props.localState.data?.every((v) => v.status !== 1);
  };

  const onDialogClose = () => {
    setopenDialogBulkConfirm(false);
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
              {checkboxListStatus.length > 0 || checkboxSorting ? (
                <div className="h-auto w-5 bg-main-200 rounded flex justify-center items-center">
                  <p className="text-sub-b text-white -mb-[2px] text-[12px]">
                    {checkboxListStatus.length + (checkboxSorting ? 1 : 0)}
                  </p>
                </div>
              ) : null}
            </div>
          </Button>
        </div>
        <div className="flex justify-end items-center space-x-[0.5rem]">
          <Button
            isAction
            icon={<CheckCircledIcon height={24} width={24} />}
            type="button"
            onClick={() => setopenDialogBulkConfirm(true)}
            className="bg-white !px-3 !py-2 flex items-center !rounded h-12! w-12!"
            disabled={parsedStatus()}
          >
            <div className="mt-1 ml-1 !font-goth text-black !font-normal text-xs">Konfirmasi Kelulusan</div>
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
      <SideBar
        closePanel={() => {
          setToggleDrawer(false);
        }}
        panelExpand={toggleDrawer}
        className="w-[520px]"
      >
        <div className="h-[85%] 2xl:h-[88%] overflow-auto">
          <Filter
            checkboxListType={checkboxListType}
            setCheckboxListType={setCheckboxListType}
            setCheckboxListStatus={setCheckboxListStatus}
            checkboxListStatus={checkboxListStatus}
            startDate={startDate}
            endDate={endDate}
            handleDateStartDate={handleDateStartDate}
            handleDateEndDate={handleDateEndDate}
          />
        </div>
        <div className="">
          <div className="flex items-center justify-center border-t border-stone-200 space-x-3 pt-6 pb-8">
            <Button
              variant="default"
              className="!py-0 w-[200px] h-10 "
              icon={<img src="/img/icon/refresh-icon.svg" alt="" style={{ height: '24px', width: '24px' }} />}
              onClick={() => {
                setCheckboxListStatus([]);
                setCheckboxListType([]);
                setStartDate(null);
                setEndDate(null);
              }}
            >
              <div className="text-black font-normal">Atur Ulang</div>
            </Button>
            <Button
              variant="default"
              className="!py-0 w-[200px] h-10"
              icon={<img src="/img/icon/checklist-icon.svg" alt="" style={{ height: '24px', width: '24px' }} />}
              onClick={submitFilter}
            >
              <div className="text-black font-normal">Konfirmasi</div>
            </Button>
          </div>
        </div>
      </SideBar>
    </>
  );
};
