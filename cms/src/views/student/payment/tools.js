import { Button, Dropdown, Notification, toast } from 'components/ui';
import { Link } from 'react-router-dom';
// import { CSVLink } from 'react-csv';
import { useState, useRef, useEffect } from 'react';
import { PageConfig } from './config';
import { ConfirmDialog } from 'components/shared';
import { apiDestroy, apiExport, apiImport } from './api';
import { SymbolIcon, DownloadIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons';
import { Filter } from './filter';
import { TableSearch } from 'components/custom/search';
import { RiFileExcel2Line } from 'react-icons/ri';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { apiTemplate } from 'services/AppService';

export const Tools = (props) => {
  const [openDialogBulkDelete, setOpenDialogBulkDelete] = useState(false);
  const ref = useRef();

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

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
      const result = await apiExport({ options: props?.localState?.params?.options });
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
        const fileName = `export_${PageConfig.pageTitle}_${formattedTime}.xlsx`;
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

  const handleImport = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile, selectedFile.filename);

      try {
        await apiImport(formData);
        toast.push(
          <Notification title={'Successfuly Imported'} type="success" duration={2500}>
            Data successfuly imported
          </Notification>,
          {
            placement: 'top-center',
          },
        );
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

          {PageConfig.enableFilterTools && <Filter localState={props.localState} getData={props.getData} />}
        </div>

        <div className="flex justify-end items-center space-x-[0.5rem]">
          <div>
            {PageConfig.enableTools && (
              <Dropdown
                ref={dropdownRef}
                renderTitle={
                  <Button
                    size="sm"
                    variant="twoTone"
                    className={`flex items-center justify-items-center bg-white text-xs font-bold border border-gray-300 hover:!bg-white/75 !py-0 ${
                      isOpen ? 'text-blue-800' : '!text-gray-800'
                    }`}
                    onClick={handleButtonClick}
                  >
                    <span className="mr-2">Actions</span>
                    {isOpen ? (
                      <BsChevronUp className="pointer-events-none" />
                    ) : (
                      <BsChevronDown className="pointer-events-none" />
                    )}
                  </Button>
                }
                placement="bottom-end"
              >
                {dropdownItems.map((item) => (
                  <Dropdown.Item key={item.key} eventKey={item.key} onSelect={item.onClick}>
                    <div className={`flex gap-2 items-center ${item.className}`}>
                      <span className="text-xl opacity-50">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </Dropdown.Item>
                ))}
                <input
                  ref={ref}
                  type="file"
                  hidden
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleImport}
                  onClick={(e) => (e.target.value = null)}
                />
              </Dropdown>
            )}
          </div>

          <div>
            {PageConfig.enableCreate && (
              <Link to={PageConfig.url + '/add'} className="block mb-0">
                <Button block size="sm" variant="solid" className="text-white">
                  Add New
                </Button>
              </Link>
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
    </>
  );
};
