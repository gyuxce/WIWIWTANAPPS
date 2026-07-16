import { useCallback, useMemo, useState } from 'react';
import { DataTable } from 'components/shared';

import { apiDestroy } from './api';
import { Button, Notification, Tag, toast } from 'components/ui';
import { PageConfig } from './config';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import { useNavigate } from 'react-router-dom';
import { formatDateDMY } from 'components/ui/utils/formatter';
import DialogDelete from 'components/custom/DialogDelete';
dayjs.extend(utc);

export const PageTable = (props) => {
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [row, setRow] = useState({});

  const columns = useMemo(() => {
    const cols = [];

    for (let index = 0; index < PageConfig.listFields.length; index++) {
      const el = PageConfig.listFields[index];
      if (props.checkboxList.includes(el.key)) {
        if (['created_at', 'updated_at'].includes(el.key)) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: true,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return <span className="text-xs">{formatDateDMY(row[el.key])} </span>;
            },
          });
        } else if (el.key === 'role') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return (
                <span className="text-xs">
                  {' '}
                  {row?.comment
                    ? row?.comment?.user?.role?.name
                      ? row?.comment?.user?.role?.name
                      : 'Siswa'
                    : row?.post
                    ? row?.post?.user?.role?.name
                      ? row?.post?.user?.role?.name
                      : 'Siswa'
                    : 'Siswa'}
                </span>
              );
            },
          });
        } else if (el.key === 'type') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return <span className="text-xs"> {row.type_label}</span>;
            },
          });
        } else if (el.key === 'user') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return <span className="text-xs"> {row.comment ? row?.comment?.user?.name : row?.post?.user?.name}</span>;
            },
          });
        } else if (el.key === 'count') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return (
                <span className="text-xs"> {row.post ? row?.post?.count_report : row?.comment?.count_report}</span>
              );
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
                  {(row.comment?.status_report_label || row?.post?.status_report_label) && (
                    <Tag className="text-red-100 bg-red-200 border-0 text-[.625rem]">
                      {row.comment ? row.comment?.status_report_label : row?.post?.status_report_label}
                    </Tag>
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
              return <span className="text-xs">{getValueByKey(row, el.key)}</span>;
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
        width: 100,
        Cell: (props) => {
          return (
            <div className="flex items-center justify-center gap-2">
              {PageConfig.enableDetails && (
                <Button
                  onClick={() => onDetail(props?.row?.original?.id)}
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

  const onDetail = (id) => {
    navigate(`${PageConfig.url}/${id}`);
  };

  const onEdit = () => {
    navigate(`${PageConfig.url}/edit/${row.id}`);
  };

  const onDelete = (id) => {
    setDialogDeleteOpen(true);
    setRow(id);
  };

  const onDialogClose = () => {
    setRow({});
    setDialogDeleteOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      await apiDestroy(id);
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
      <DialogDelete
        dialogIsOpen={dialogDeleteOpen}
        loading={isDeleting}
        onDialogClose={onDialogClose}
        onDialogOk={() => handleDelete(row?.id)}
      />
    </>
  );
};
