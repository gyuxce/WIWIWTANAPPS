import { Button, Notification, toast } from 'components/ui';
import { useState, useRef } from 'react';
import { PageConfig } from './config';
import { ConfirmDialog } from 'components/shared';
import { apiDestroy, apiExport } from '../api/api';
import { SymbolIcon, DownloadIcon, TrashIcon, UploadIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import { TableSearch } from 'components/custom/search';
import { RiFileExcel2Line } from 'react-icons/ri';

import { apiTemplate } from 'services/AppService';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Filter } from './filter';
dayjs.extend(utc);

export const Tools = (props) => {
  const [openDialogBulkDelete, setOpenDialogBulkDelete] = useState(false);
  const ref = useRef();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [countFilter, setCountFilter] = useState(0);

  const downloadTemplate = async () => {
    try {
      const result = await apiTemplate({ module: PageConfig.moduleSlug });
      if (result && result.status === 200) {
        const headers = result.headers;
        const blob = new Blob([result.data], { type: headers['content-type'] });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        const currentTime = new Date();
        const formattedTime = currentTime
          .toISOString()
          .replace(/[-T:.]/g, '')
          .slice(0, -5); // Format: yyyyMMdd_HHmm
        const fileName = `template_import_${PageConfig.moduleSlug}_${formattedTime}.xlsx`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.push(
          <Notification title={'Download Template'} type="success" duration={2500}>
            Template Successfuly Downloaded
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
  };

  const exportAction = async () => {
    try {
      const result = await apiExport(props.localState.params);
      if (result && result.status === 200) {
        const headers = result.headers;
        const blob = new Blob([result.data], { type: headers['content-type'] });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);

        const contentDisposition = headers['content-disposition'];
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        const defaultFileName = matches && matches[1] ? matches[1].replace(/['"]/g, '') : null;

        const currentTime = new Date();
        const formattedTime = currentTime.toISOString().slice(0, 10).replace(/-/g, '');
        const defaultTimeBasedFileName = `Hasil Tes Bakat Bahasa Siswa_${formattedTime}.xlsx`;

        const fileName = defaultFileName || defaultTimeBasedFileName;

        link.href = url;
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

  const dropdownItems = [];

  if (PageConfig.enableTemplateTools) {
    dropdownItems.push({
      key: 'Download',
      label: 'Download Template',
      icon: <RiFileExcel2Line size={15} />,
      className: 'text-gray-800 font-normal leading-normal',
      onClick: downloadTemplate,
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
      onClick: exportAction,
    });
  }

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

          {PageConfig.enableSearchTools && <TableSearch localState={props.localState} getData={props.getData} />}

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

          {PageConfig.enableFilterTools && (
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
                  <div className="text-[12px] mt-[4px] !text-black">Filter</div>
                </div>
                {countFilter > 0 ? (
                  <div className="h-auto w-5 bg-main-200 rounded flex justify-center items-center">
                    <p className="text-sub-b text-white -mb-[2px] text-[12px]">{countFilter}</p>
                  </div>
                ) : null}
              </div>
            </Button>
          )}
        </div>

        <div className="flex justify-end items-center space-x-[0.5rem]">
          <div>
            {PageConfig.enableTools && (
              <Button
                isAction
                icon={<DownloadIcon height={16} width={16} />}
                type="button"
                onClick={exportAction}
                className="bg-white !px-3 !py-2 flex items-center !rounded"
              >
                <div className="mt-1 ml-1 !font-goth text-black  !font-normal text-xs">Export Data</div>
              </Button>
            )}
          </div>
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

            await apiDestroy(0, params);
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
      <Filter
        localState={props.localState}
        getData={props.getData}
        setCountFilter={setCountFilter}
        setToggleDrawer={setToggleDrawer}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
};
