import { useCallback, useMemo, useState } from 'react';
import { DataTable } from 'components/shared';
import { PageConfig } from './config';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import StatusBadge from 'components/ui/StatusBadge';
import { TrashIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { Button, Dialog, Input, Notification, toast } from 'components/ui';
import { apiDestroy } from './api';
import { formatDateDMY, formatDateTime } from 'components/ui/utils/formatter';
import { handleDownloadClick } from 'components/ui/utils/downloadFile';
import CloseSvg from 'assets/svg/CloseSvg';

dayjs.extend(utc);

export const PageTable = (props) => {
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [row, setRow] = useState({});
  const [deletedReason, setDeletedReason] = useState('');

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
        } else if (el.type === 'date') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return <span className="text-xs py-5">{formatDateDMY(row[el.key])}</span>;
            },
          });
        } else if (el.type === 'attachment') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              const value = getValueByKey(row, el.key);
              return (
                <div className="flex text-xs">
                  {value ? (
                    <div>
                      <div
                        className="grow shrink basis-0 cursor-pointer text-blue-950 text-xs font-normal font-goth underline"
                        onClick={() => handleDownloadClick(value)}
                      >
                        Lampiran.pdf
                      </div>
                    </div>
                  ) : (
                    <div>-</div>
                  )}
                </div>
              );
            },
          });
        } else if (el.type === 'datetime') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return <span className="text-xs py-5">{formatDateTime(row[el.key], 'id')}</span>;
            },
          });
        } else if (el.status) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return (
                <div className="flex items-center justify-center text-xs">
                  <StatusBadge text={row[el.target]} color={row[el.key] ? 'green' : 'red'} />
                </div>
              );
            },
          });
        } else if (el.type === 'label') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              const value = getValueByKey(row, el.target);
              return <span className="text-xs">{value ? value : el.is_num ? 0 : '-'}</span>;
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
            <div className="flex items-center justify-center gap-2">
              {PageConfig.enableDetail && (
                <Button
                  onClick={() => onEdit(props?.row?.original?.id)}
                  className="shadow-none rounded border border-stone-300"
                  icon={<img src={'/img/icon/eye-open.svg'} height={20} width={20} alt="" />}
                />
              )}
              {PageConfig.enableEdit && (
                <Button
                  onClick={() => onEdit(props?.row?.original?.id)}
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

  const navigate = useNavigate();

  const onEdit = (id) => {
    navigate(`${PageConfig.url}/edit/${id}`);
  };

  const onDelete = (id) => {
    setDialogDeleteOpen(true);
    setRow(id);
  };

  const onDialogClose = () => {
    setRow({});
    setDialogDeleteOpen(false);
  };

  const handleDelete = async (id, value) => {
    // Check if the deletedReason is provided and does not exceed 200 characters
    if (!value || value.length === 0) {
      toast.push(
        <Notification title={'Error'} type="danger" duration={2500}>
          Alasan menghapus harus diisi.
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      return;
    }

    if (value.length > 200) {
      toast.push(
        <Notification title={'Error'} type="danger" duration={2500}>
          Alasan menghapus tidak boleh lebih dari 200 karakter.
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      return;
    }

    try {
      var bodyData = {
        deleted_reason: value,
      };
      setIsDeleting(true);
      await apiDestroy(id, bodyData);
      props.getData({ ...props.localState.params, page: 1 });
      setIsDeleting(false);
      setDeletedReason('');
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

      <Dialog
        isOpen={dialogDeleteOpen}
        loading={isDeleting}
        onClose={onDialogClose}
        width={600}
        height={578}
        closable={false}
        className={'relative'}
      >
        <div className="absolute top-4 right-4">
          <Button
            onClick={onDialogClose}
            variant="plain"
            size="xs"
            icon={
              <>
                <CloseSvg />
              </>
            }
          />
        </div>
        <div className="flex flex-col p-4">
          <div className="flex justify-center">
            <img src="/img/icon/trash.png" alt="trash" className="h-[64px] w-[64px]" />
          </div>
          <div className="flex flex-col">
            <p className="text-h3 font-opificio text-black text-center mt-10">Anda akan menghapus data ini</p>
            <div className="flex justify-center mt-4">
              <p className="text-caption-b-goth text-second-500 text-center">
                Data yang sudah dihapus tidak dapat dipulihkan. Klik "Kembali” untuk memastikan kembali.
              </p>{' '}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-caption-b-goth text-black mt-10">
              Alasan menghapus
              <span className="text-red-500">*</span>
            </p>
            <div className="flex justify-center mt-2 mb-2">
              <Input
                placeholder="Ketik isi notifikasi"
                value={deletedReason}
                onChange={(e) => setDeletedReason(e.target.value)}
                maxLength={200}
                textArea
              />
            </div>
            <p className="text-caption-b-goth text-black">*maksimal 200 karakter</p>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex justify-center">
              <Button
                variant="default"
                className="!py-0 mr-2"
                style={{ height: '40px', width: '200px' }}
                onClick={onDialogClose}
              >
                <div className="text-black font-normal">Kembali</div>
              </Button>

              <Button
                variant="default"
                className="!py-0"
                style={{ height: '40px', width: '200px' }}
                onClick={() => handleDelete(row?.file?.id, deletedReason)}
              >
                <div className="text-black font-normal">Hapus</div>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
