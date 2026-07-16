import { useCallback, useMemo, useState } from 'react';
import { DataTable } from 'components/shared';
import { PageConfig } from './config';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import { TrashIcon, Pencil2Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Button, Dialog, Input, Notification, toast } from 'components/ui';
import { openNotification } from 'components/custom/NotificationComponent';
import { apiUpdate, apiDestroy } from './api';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import DateTimepicker from 'components/ui/DatePicker/DateTimepicker';

dayjs.extend(utc);

export const PageTable = (props) => {
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [row, setRow] = useState({});
  const [initialValue, setInitialValue] = useState('');
  const [dialogIsOpen, setIsOpen] = useState(false);

  const onDialogClose = () => {
    setInitialValue('');
    setIsOpen(!dialogIsOpen);
    setRow({});
  };

  const columns = useMemo(() => {
    const cols = [];

    for (let index = 0; index < PageConfig.listFields.length; index++) {
      const el = PageConfig.listFields[index];
      if (props.checkboxList.includes(el.key)) {
        if (['created_at', 'updated_at'].includes(el.key)) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              const data = row[el.key];
              return data ? <span className="text-xs">{dayjs(data).format('DD MMMM YYYY, HH:mm')} </span> : '-';
            },
          });
        } else if (el.status_schedule) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              if (row.is_scheduled == null) {
                return '-';
              }

              const tagStyle = getTagStyleStatusSchedule(row.is_scheduled);
              return (
                <div className="flex text-xs">
                  <span className={tagStyle}>{row.is_scheduled_label}</span>
                </div>
              );
            },
          });
        } else {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              const value = getValueByKey(row, el.key);
              return <span className="text-xs">{value ? value : el.is_num ? 0 : '-'}</span>;
            },
          });
        }
      }
    }

    if (PageConfig.enableActions) {
      cols.push({
        Header: 'Action',
        id: 'action',
        accessor: (row) => row,
        Cell: (props) => {
          return (
            <div className="flex items-center justify-center content-center w-full gap-2">
              {PageConfig.enableEdit && (
                <Button
                  onClick={() => {
                    setRow(props?.row?.original);
                    setInitialValue(props?.row?.original);
                    setIsOpen(!dialogIsOpen);
                  }}
                  className="shadow-none rounded border border-stone-300"
                  icon={<Pencil2Icon height={20} width={20} color="#262564" />}
                />
              )}
              {PageConfig.enableDelete && (
                <Button
                  onClick={() => onDelete(props?.row?.original)}
                  className="shadow-none rounded border border-stone-300"
                  icon={<TrashIcon height={20} width={20} color="#C63838" />}
                />
              )}
            </div>
          );
        },
      });
    }

    return cols;
  }, [props.checkboxList]);

  const metaTable = {
    total: props.localState.meta?.total || 0,
    pageIndex: props.localState.meta?.current_page || 1,
    pageSize: props.localState.meta?.per_page || 10,
  };

  const onPaginationChange = (page) => {
    props.getData({ ...props.localState.params, page: page });
  };

  const onSelectChange = (value) => {
    props.getData({ ...props.localState.params, limit: value, page: 1 });
  };

  const onSort = (sort) => {
    props.getData({
      ...props.localState.params,
      order_by: sort.key,
      sort_by: sort.order,
      page: 1,
    });
  };

  const onAllRowSelect = useCallback(
    (checked, rows) => {
      if (checked) {
        const originalRows = rows.map((row) => row.original);
        const selectedIds = [];

        for (let index = 0; index < originalRows.length; index++) {
          const el = originalRows[index];
          selectedIds.push(el[PageConfig.primaryKey]);
        }

        props.setIds(selectedIds);
      } else {
        props.setIds([]);
      }
    },
    [props],
  );

  const onCheckBoxChange = (checked, row) => {
    props.setIds((s) => {
      let x = [...s];
      if (checked) {
        x.push(row[PageConfig.primaryKey]);
      } else {
        for (let index = 0; index < x.length; index++) {
          const el = x[index];

          if (row[PageConfig.primaryKey] === el) {
            x.splice(index, 1);
          }
        }
      }

      return x;
    });
  };

  // const navigate = useNavigate();

  // const onEdit = (id) => {
  //   navigate(`${PageConfig.url}/edit/${id}`);
  // };

  const onDelete = (id) => {
    setDialogDeleteOpen(true);
    setRow(id);
  };

  function getTagStyleStatusSchedule(status) {
    const styles = {
      1: 'px-3 py-2 rounded-full bg-green-50 border border-green-500 text-green-500',
      0: 'px-3 py-2 rounded-full bg-red-50 border border-red-500 text-red-500',
    };

    return styles[status] || 'text-gray-100 bg-gray-200';
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={props.localState.data}
        loading={props.localState?.loading || false}
        pagingData={metaTable}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        onSort={onSort}
        selectable={PageConfig.enableBulkDelete}
        wrapClass="min-h-[360px]"
        onCheckBoxChange={onCheckBoxChange}
        onIndeterminateCheckBoxChange={onAllRowSelect}
        showPagination={PageConfig.enablePagination}
        showLimitPerPage={PageConfig.enableLimitPerPage}
      />
      <DialogNotification
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        dataSesi={row}
        initialValue={initialValue}
        props={props}
        // onRefresh={getData}
      />
      <Dialog
        isOpen={dialogDeleteOpen}
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
            <p className="text-h3 font-opificio text-black text-center mt-10">Konfirmasi hapus</p>
            <div className="flex justify-center mt-4">
              <p className="font-goth text-second-500 text-center">Apakah anda yakin akan menghapus data ini?</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex justify-center gap-2">
              <Button variant="default" className="!py-0 h-10 w-[200px]" onClick={onDialogClose}>
                <div className="text-black font-normal">Tidak, Kembali</div>
              </Button>

              <Button
                loading={isDeleting}
                variant="default"
                className="!py-0 h-10 w-[200px]"
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await apiDestroy(row?.id);
                    props.getData({ ...props.localState.params, page: 1 });
                    setIsDeleting(false);
                    onDialogClose();
                    toast.push(
                      <Notification title={'Sukses'} type="success" duration={2500}>
                        Data berhasil dihapus
                      </Notification>,
                      {
                        placement: 'top-center',
                      },
                    );
                  } catch (error) {
                    setIsDeleting(false);
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
              >
                <div className="text-black font-normal">Ya, Konfirmasi</div>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

const DialogNotification = ({ isOpen, onClose, initialValue, dataSesi, props }) => {
  const handleSave = async ({ working_date, link }) => {
    try {
      let param = {
        working_date: working_date,
        link: link,
      };
      await apiUpdate(dataSesi.id, param);
      props.getData({ ...props.localState.params, page: 1 });
      openNotification('Success', 'success', 'Berhasil simpan data');
      // onRefresh();
      onClose();
    } catch (error) {
      openNotification('Error', 'danger', 'Error saving data: ' + error);
    }
  };
  const validationSchema = Yup.object().shape({
    link: Yup.string().url('Invalid URL').required('Wajib diisi'),
  });
  return (
    <Dialog isOpen={isOpen} onClose={onClose} closable={false}>
      <div className="mb-1 flex items-center justify-between">
        <div className=" text-blue-950 text-xl font-normal font-opificio">Jadwal Asesmen Lisan</div>
        <img src="/img/icon/icon-radix.svg" alt="" onClick={onClose} />
      </div>

      {initialValue !== '' ? (
        <Formik
          // initialValues={initialValue}
          initialValues={{
            working_date: dataSesi?.working_date ? new Date(dataSesi?.working_date) : null,
            link: dataSesi?.link || '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSave(values);
            setSubmitting(true);
          }}
        >
          {({ values, isSubmitting, handleSubmit, setFieldValue, setSubmitting }) => (
            <div>
              <Form>
                <div className="mt-4 mb-2">
                  <div className="justify-start items-center gap-0.5 inline-flex mb-2">
                    <div className="text-black text-sm font-normal font-goth leading-[21px]">
                      Tanggal dan Waktu (WIB)
                    </div>
                    <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                  </div>
                  <Field name="working_date">
                    {({ field, form }) => (
                      <div>
                        <DateTimepicker
                          amPm={false}
                          field={field}
                          form={form}
                          inputFormat="DD MMMM YYYY, HH:mm"
                          placeholder="Pilih Tanggal dan Waktu (WIB)"
                          value={values?.working_date || ''}
                          inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                          onChange={(date) => {
                            setFieldValue(field.name, date);
                          }}
                        />
                      </div>
                    )}
                  </Field>

                  <ErrorMessage name="working_date" component="div" className="field-error" />
                </div>

                <div className="mt-4 mb-2">
                  <div className="justify-start items-center gap-0.5 inline-flex mb-2">
                    <div className="text-black text-sm font-normal font-goth leading-[21px]">Link</div>
                    <div className="text-red-600 text-sm font-normal font-goth leading-[21px]">*</div>
                  </div>
                  <Field name="link" placeholder="Masukkan link">
                    {({ field, form }) => (
                      <div>
                        <Input
                          value={values.link}
                          placeholder="Masukkan link"
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.target.value);
                          }}
                        />
                      </div>
                    )}
                  </Field>

                  <ErrorMessage name="link" component="div" className="field-error" />
                </div>
              </Form>
              <div className="h-5"></div>

              <Button
                type="button"
                loading={isSubmitting}
                disabled={isSubmitting || dataSesi?.status == 4}
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
