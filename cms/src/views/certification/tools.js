import { Button, Notification, toast } from 'components/ui';
import {
  MixerHorizontalIcon,
  SymbolIcon,
  DownloadIcon,
  TrashIcon,
  UploadIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import { useState, useRef } from 'react';
import { PageConfig } from './config';
import { ConfirmDialog } from 'components/shared';
import { TableSearch } from 'components/custom/search';
import { RiFileExcel2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import SideBar from 'components/template/SideFilter';
import { Filter } from './filter';
import { apiExport } from './api';
import { exportData } from 'utils/helper/uploadfile';
dayjs.extend(utc);

export const Tools = (props) => {
  const [openDialogBulkDelete, setOpenDialogBulkDelete] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const [checkboxListStatus, setCheckboxListStatus] = useState([]);
  const [checkboxSorting] = useState();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const submitFilter = async () => {
    let params = { ...props.localState.params };
    params.options = [];
    if (checkboxListStatus.length > 0) {
      params.options.push('filter,status,in,' + checkboxListStatus.join('|'));
    }
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

  const handleExport = async () => {
    setIsExporting(true);
    await exportData('xlsx', apiExport, 'sertifikasi', props.localState.params);
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
                setOpenDialogBulkDelete(true);
              }}
            >
              Bulk Delete
            </Button>
          )}

          {PageConfig.enableSearchTools && (
            <TableSearch
              size="md"
              placeholder="Cari sertifikasi"
              localState={props.localState}
              getData={props.getData}
            />
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
                <div className="text-[12px] !text-black">Filter</div>
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
          {PageConfig.enableCreate && (
            <Button
              isAction
              icon={<PlusCircledIcon height={24} width={24} />}
              type="button"
              onClick={() => navigate(PageConfig.url + '/create')}
              className="bg-white !px-3 !py-2 flex items-center !rounded"
            >
              <div className="mt-1 ml-1 !font-goth text-black !font-normal text-sm">Buat Baru</div>
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={openDialogBulkDelete}
        onClose={() => {
          setOpenDialogBulkDelete(false);
        }}
        onRequestClose={() => {
          setOpenDialogBulkDelete(false);
        }}
        type="danger"
        title="Bulk Delete data"
        onCancel={() => {
          setOpenDialogBulkDelete(false);
        }}
        onConfirm={async () => {
          try {
            let params = {
              ids: [],
            };

            for (let index = 0; index < props.deleteIds.length; index++) {
              const el = props.deleteIds[index];
              params.ids.push(el);
            }

            props.getData({ ...props.localState.params, page: 1 });
            setOpenDialogBulkDelete(false);

            toast.push(
              <Notification title={'Successfuly Deleted'} type="success" duration={2500}>
                Data successfuly deleted
              </Notification>,
              {
                placement: 'top-center',
              },
            );

            props.setIds([]);
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
        }}
        confirmButtonColor="red-600"
      >
        <p>
          Are you sure you want to delete this data? All record related to this data will be deleted as well. This
          action cannot be undone.
        </p>
      </ConfirmDialog>
      <SideBar
        closePanel={() => {
          setToggleDrawer(false);
        }}
        panelExpand={toggleDrawer}
        className="w-[520px]"
      >
        <div className="h-[85%] 2xl:h-[88%] overflow-auto">
          <Filter setCheckboxListStatus={setCheckboxListStatus} checkboxListStatus={checkboxListStatus} />
        </div>
        <div className="">
          <div className="flex items-center justify-center border-t border-stone-200 space-x-3 pt-6 pb-8">
            <Button
              variant="default"
              className="!py-0 w-[200px] h-10 "
              icon={<img src="/img/icon/refresh-icon.svg" alt="" style={{ height: '24px', width: '24px' }} />}
              onClick={() => {
                setCheckboxListStatus([]);
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
