import { Button, Notification, toast } from 'components/ui';
import { MixerHorizontalIcon, SymbolIcon, DownloadIcon, TrashIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { PageConfig } from './config';
import { ConfirmDialog } from 'components/shared';
import { TableSearch } from 'components/custom/search';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Filter } from './filter';
import { apiExport } from './api';
import { exportData } from 'utils/helper/uploadfile';
dayjs.extend(utc);

export const Tools = (props) => {
  const [openDialogBulkDelete, setOpenDialogBulkDelete] = useState(false);
  const navigate = useNavigate();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [countFilter, setCountFilter] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    await exportData('xlsx', apiExport, 'nilai_pelatihan', props.localState.params);
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
            <TableSearch size="md" placeholder="Cari siswa" localState={props.localState} getData={props.getData} />
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
          {PageConfig.enableExportTools && (
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
      <Filter
        localState={props.localState}
        getData={props.getData}
        setCountFilter={setCountFilter}
        setToggleDrawer={setToggleDrawer}
        toggleDrawer={toggleDrawer}
        program={props.program}
        categories={props.categories}
        trainings={props.trainings}
        asessmentTypes={props.asessmentTypes}
      />
    </>
  );
};
