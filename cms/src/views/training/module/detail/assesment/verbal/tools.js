import { Button, Dialog, Dropdown, Input, Notification, toast } from 'components/ui';
import { useState, useRef, useEffect } from 'react';
import { PageConfig } from './config';
import { ConfirmDialog } from 'components/shared';
import { apiDestroy, apiExport, apiImport, apiShowScoreMinimum, apiUpdateScoreMinimum } from './api';
import {
  SymbolIcon,
  DownloadIcon,
  TrashIcon,
  UploadIcon,
  MixerHorizontalIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import { TableSearch } from 'components/custom/search';
import { RiFileExcel2Line } from 'react-icons/ri';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { apiTemplate } from 'services/AppService';
import { openNotification } from 'components/custom/NotificationComponent';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Filter } from './filter';

export const Tools = (props) => {
  const ref = useRef();
  const [openDialogBulkDelete, setOpenDialogBulkDelete] = useState(false);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [countFilter, setCountFilter] = useState(0);
  const [dialogIsOpen, setIsOpenDialog] = useState(false);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onDialogClose = () => {
    setIsOpenDialog(!dialogIsOpen);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

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
      const result = await apiExport(props.id, {
        options: props?.localState?.params?.options,
      });
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

          {PageConfig.enableSearchTools && (
            <TableSearch
              localState={props.localState}
              getData={props.getData}
              placeholder="Cari Siswa"
              size="md"
              className="!w-[15.625rem]"
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
            {PageConfig.enableExportSingleTools && (
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

          <div>
            {PageConfig.enableCreate && (
              <Button
                isAction
                icon={<PlusCircledIcon height={24} width={24} />}
                type="button"
                onClick={() => {
                  setIsOpenDialog(!dialogIsOpen);
                }}
                className="bg-white !px-3 !py-2 flex items-center !rounded"
              >
                <div className="mt-1 ml-1 !font-goth text-black !font-normal text-sm">Update Nilai Minimum</div>
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
        schedule={props.statusScheduleAssesmentVerbalConstant}
        setCountFilter={setCountFilter}
        setToggleDrawer={setToggleDrawer}
        toggleDrawer={toggleDrawer}
      />

      <DialogNotification
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        props={props}
        // onRefresh={getData}
      />
    </>
  );
};

const DialogNotification = ({ isOpen, onClose, props }) => {
  const [data, setData] = useState({});
  const getData = async () => {
    try {
      const ress = await apiShowScoreMinimum(props.id);
      setData(ress?.data?.data);
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

  useEffect(() => {
    if (props.id) {
      getData();
    }
  }, [props.id]);

  const handleSave = async ({ weight_minimum }) => {
    try {
      let param = {
        weight_minimum: weight_minimum,
      };
      await apiUpdateScoreMinimum(props.id, param);
      getData();
      props.getData({ ...props.localState.params, page: 1 });
      openNotification('Success', 'success', 'Berhasil simpan data');
      onClose();
    } catch (error) {
      openNotification('Error', 'danger', 'Error saving data: ' + error);
    }
  };
  const validationSchema = Yup.object().shape({
    weight_minimum: Yup.string().required('Input nilai minimum kelulusan'),
  });
  return (
    <Dialog isOpen={isOpen} onClose={onClose} closable={false}>
      <div className="mb-1 flex items-center justify-between">
        <div className=" text-blue-950 text-xl font-normal font-opificio">Update Nilai Minimum Kelulusan</div>
        <img src="/img/icon/icon-radix.svg" alt="" onClick={onClose} />
      </div>
      <div className="text-blue-950 text-sm font-normal font-goth leading-[21px]">
        Nilai standar kelulusan semua siswa dalam materi ini
      </div>

      {data !== '' ? (
        <Formik
          initialValues={{
            weight_minimum: data?.weight_minimum || '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSave(values);
            setSubmitting(true);
          }}
        >
          {({ values, isSubmitting, handleSubmit, setSubmitting }) => (
            <div>
              <Form>
                <div className="mt-4 mb-2">
                  <div className="justify-start items-center gap-0.5 inline-flex mb-2">
                    <div className="text-black text-sm font-normal font-goth leading-[21px]">
                      Nilai Kelulusan Minimum
                    </div>
                    <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                  </div>
                  <Field name="weight_minimum" placeholder="Masukkan Nilai Kelulusan Minimum">
                    {({ field, form }) => (
                      <div>
                        <Input
                          value={values.weight_minimum}
                          placeholder="Masukkan nilai kelulusan minimum"
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.target.value);
                          }}
                        />
                      </div>
                    )}
                  </Field>

                  <ErrorMessage name="weight_minimum" component="div" className="field-error" />
                </div>
              </Form>
              <div className="h-5"></div>

              <Button
                type="button"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={() => {
                  setSubmitting(true);
                  handleSubmit();
                }}
                style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
                className="w-full h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex"
              >
                <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">Konfirmasi</div>
              </Button>
            </div>
          )}
        </Formik>
      ) : (
        ''
      )}
    </Dialog>
  );
};
