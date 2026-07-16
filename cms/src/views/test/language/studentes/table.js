import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable, ConfirmDialog } from 'components/shared';

import { apiDestroy, apiReminderPratestLanguage } from '../api/api';
import { Button, Dialog, Input, Notification, toast } from 'components/ui';
import { PageConfig } from './config';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { TrashIcon } from '@radix-ui/react-icons';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import { numberToRupiah } from 'components/ui/utils/formatter';
import { useNavigate } from 'react-router-dom';
import CustomeButton from '../components/CustomeButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';

dayjs.extend(utc);

const ActionColumn = ({ row, setDialogDeleteOpen, setRow }) => {
  const navigate = useNavigate();

  const onDelete = () => {
    setRow(row);
    setDialogDeleteOpen(true);
  };

  const onEdit = () => {
    navigate(`${PageConfig.url}/${row.id}`);
  };

  const actionItems = [];

  if (PageConfig.enableEdit) {
    actionItems.push(
      <div className="flex items-center content-center justify-center">
        <CustomeButton onClick={onEdit} img_url="/img/icon/eye-open.svg" title="Lihat Detail" />
      </div>,
    );
  }

  if (PageConfig.enableDelete) {
    actionItems.push(
      <Button icon={<TrashIcon />} variant="plain" className="text-main-100" type="button" onClick={onDelete}>
        <span>Delete Data</span>
      </Button>,
    );
  }

  return <div>{PageConfig.enableActions && actionItems.map((item, index) => <div key={index}>{item}</div>)}</div>;
};

export const PageTable = (props) => {
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const [row, setRow] = useState({});
  const { getData, localState } = props;
  const [dialogIsOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const openDialog = (id) => {
    setIsOpen(true);
    setUserId(id);
  };
  const onDialogClose = () => {
    setIsOpen(false);
    setUserId(null);
  };

  const columns = useMemo(() => {
    const cols = [];

    for (let index = 0; index < PageConfig.listFields.length; index++) {
      const el = PageConfig.listFields[index];
      if (props.checkboxList.includes(el.key)) {
        if (['created_at', 'updated_at', 'finished_at'].includes(el.key)) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: true,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return row[el.key] ? <span className="text-xs">{dayjs(row[el.key]).format('D MMMM YYYY')} </span> : '-';
            },
          });
        } else if (el.type === 'currency') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: true,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return <span className="flex justify-end text-xs">{numberToRupiah(row[el.key])} </span>;
            },
          });
        } else if (el.status) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: true,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return (
                <div className="flex text-xs">
                  {el.key === 'status' || el.key === 'is_active' ? (
                    row[el.key] == 1 ? (
                      <div className="px-3">
                        <span className="px-3 py-2 bg-green-50 rounded-full border border-green-500 text-green-500 text-xs font-normal font-goth">
                          {row[el.target]}
                        </span>
                      </div>
                    ) : (
                      <div className="px-3">
                        {row[el.target] !== null ? (
                          <div className="h-[31px] px-3 py-2 bg-orange-50 rounded-[100px] border border-orange-500 justify-center items-center gap-2.5 inline-flex">
                            <div className="text-orange-500 text-xs font-normal font-goth">{row[el.target]}</div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </div>
                    )
                  ) : (
                    <span>{row[el.target]}</span>
                  )}
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
              return <span className="text-xs">{value != '' ? value : '-'}</span>;
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
        // width: 200,
        Cell: (props) => {
          let status = props?.row?.original?.status;
          return (
            <div className="">
              {status == 1 ? (
                <ActionColumn
                  row={props.row.original}
                  index={props.row.index}
                  length={props.rows.length}
                  setRow={setRow}
                  setDialogDeleteOpen={setDialogDeleteOpen}
                />
              ) : (
                <div className="flex items-center content-center justify-center">
                  <CustomeButton
                    onClick={() => openDialog(props?.row?.original?.user?.id)}
                    className="text-blue-950"
                    img_url="/img/icon/bell.svg"
                    title="Ingatkan"
                  />
                </div>
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
      <ConfirmDialog
        isOpen={dialogDeleteOpen}
        onClose={() => {
          setDialogDeleteOpen(false);
        }}
        onRequestClose={() => {
          setDialogDeleteOpen(false);
        }}
        type="danger"
        title="Delete data"
        onCancel={() => {
          setDialogDeleteOpen(false);
        }}
        onConfirm={async () => {
          try {
            await apiDestroy(row[PageConfig.primaryKey]);
            getData({ ...localState.params, page: 1 });
            setDialogDeleteOpen(false);

            toast.push(
              <Notification title={'Successfuly Deleted'} type="success" duration={2500}>
                Data successfuly deleted
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
        }}
        confirmButtonColor="red-600"
      >
        <p>
          Are you sure you want to delete this data? All record related to this data will be deleted as well. This
          action cannot be undone.
        </p>
      </ConfirmDialog>

      <DialogNotification isOpen={dialogIsOpen} userId={userId} onClose={onDialogClose} />
    </>
  );
};

const validationSchema = Yup.object().shape({
  notifikasi: Yup.string().max(200, 'Maksimal 200 karakter').required('Harap isi notifikasi'),
});

const DialogNotification = ({ isOpen, onClose, userId, toast }) => {
  const formik = useFormik({
    initialValues: {
      notifikasi: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var bodyData = {
          note: values.notifikasi,
        };
        await apiReminderPratestLanguage(userId, bodyData);

        toast.push(
          <Notification title={'Success'} type="success">
            {'Berhasil Kirim Notifikasi'}
          </Notification>,
          {
            placement: 'top-center',
          },
        );
      } catch (error) {
        toast.push(
          <Notification title={'Error'} type="danger">
            {error?.response?.data?.message || error?.message || 'Something went wrong on fetch data'}
          </Notification>,
          {
            placement: 'top-center',
          },
        );
      } finally {
        formik.resetForm();
        setSubmitting(false);
        onClose();
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} closable={false}>
      <div className="mb-1 flex items-center justify-between">
        <div className=" text-blue-950 text-xl font-normal font-opificio">Input Notifikasi</div>
        <img src="/img/icon/icon-radix.svg" className="cursor-pointer" alt="" onClick={onClose} />
      </div>

      <div className="text-blue-950 text-sm font-normal font-goth leading-[21px]">
        Silahkan isi pesan notifikasi yang akan Anda kirim kepada siswa
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-4 mb-2">
          <div className="justify-start items-center gap-0.5 inline-flex mb-2">
            <div className="text-black text-sm font-normal font-goth leading-[21px]">Isi Notifikasi</div>
          </div>
          <Input
            name="notifikasi"
            placeholder="ketik notifikasi"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.notifikasi}
            textArea
          />
          {formik.touched.notifikasi && formik.errors.notifikasi && (
            <div className="text-red-500 text-sm font-normal font-goth leading-[21px]">{formik.errors.notifikasi}</div>
          )}
        </div>
        <div className="text-black text-sm font-normal font-goth leading-[21px]">*maksimal 200 karakter</div>
        <div className="h-5"></div>
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          style={{ boxShadow: '-2px 2px 0px 0px #000', color: '#262564' }}
          className="w-full h-10 p-3 bg-white rounded-lg shadow border border-black justify-center items-center gap-2 inline-flex"
        >
          <div className="text-center text-black text-sm font-normal font-goth leading-[21px]">Konfirmasi</div>
        </Button>
      </form>
    </Dialog>
  );
};

export default DialogNotification;
