import { useCallback, useMemo, useState } from 'react';
import { DataTable } from 'components/shared';
import { PageConfig } from './config';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import StatusBadge from 'components/ui/StatusBadge';
import { ExclamationTriangleIcon, EyeOpenIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { Button, Dialog, Notification, toast } from 'components/ui';
import { apiDestroy } from './api';

dayjs.extend(utc);

export const PageTable = (props) => {
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [row, setRow] = useState({});

  const columns = useMemo(() => {
    const cols = [];

    for (let index = 0; index < PageConfig.listFieldsDetail.length; index++) {
      const el = PageConfig.listFieldsDetail[index];
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
        } else if (el.status) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return (
                <div className="flex pl-6 text-xs">
                  <StatusBadge
                    text={row[el.target]}
                    color={row[el.key] === 1 ? 'green' : row[el.key] === 0 ? 'orange' : 'red'}
                  />
                </div>
              );
            },
          });
        } else if (el.file) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return (
                <div className={`flex text-xs w-[${el.width}px]`}>
                  <a
                    href={row.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ellipsis truncate flex text-xs"
                  >
                    <p className="text-ellipsis truncate underline">{row.file.filename}</p>
                  </a>{' '}
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
              return <span className="text-xs ">{value ? value : el.is_num ? 0 : '-'}</span>;
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
            <div className="flex flex-col items-center gap-2">
              {props?.row?.original?.status === 0 ? (
                <Button
                  onClick={() => onChangeStatus(props?.row?.original?.id)}
                  className="text-black text-xs border-[1px] border-grey-300 rounded !h-8 !w-8"
                  icon={<Pencil2Icon height={20} width={20} color="#262564" />}
                />
              ) : (
                <Button
                  icon={<EyeOpenIcon height={20} width={20} color="#262564" />}
                  variant="plain"
                  className="text-black text-xs border-[1px] border-grey-300 rounded !h-8 !w-8"
                  type="button"
                  onClick={() => onDetails(props?.row?.original?.id)}
                ></Button>
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

  const onDetails = (id) => {
    navigate(`${PageConfig.url}/detail-certification/${id}`);
  };
  const onChangeStatus = (id) => {
    navigate(`${PageConfig.url}/change-status/${id}`);
  };

  const onDialogClose = () => {
    setRow({});
    setDialogDeleteOpen(false);
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
