import { useCallback, useMemo, useState } from 'react';
import { DataTable, ConfirmDialog } from 'components/shared';

import { apiDestroy } from './api';
import { Notification, toast } from 'components/ui';
import { PageConfig } from './config';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import { formatDateDMY, numberToRupiah } from 'components/ui/utils/formatter';
import RejectButton from '../components/RejectButton';
import ApproveButton from '../components/ApproveButton';

dayjs.extend(utc);

export const PageTable = (props) => {
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [row] = useState({});
  const { getData, localState, onLoad } = props;

  const columns = useMemo(() => {
    const cols = [];

    for (let index = 0; index < PageConfig.listFields.length; index++) {
      const el = PageConfig.listFields[index];

      if (props.checkboxList.includes(el.key)) {
        if (['created_at', 'updated_at'].includes(el.key)) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: false,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return <span className="text-xs py-5">{formatDateDMY(row[el.key])} </span>;
            },
          });
        } else if (el.type === 'date') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: false,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              if (row.paymentProof == null) {
                return <span className="text-xs py-5">-</span>;
              } else {
                return <span className="text-xs py-5">{formatDateDMY(row.paymentProof.created_at)} </span>;
              }
            },
          });
        } else if (el.type === 'currency') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: false,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;

              if (row.paymentProof == null) {
                return <span className="text-xs py-5">-</span>;
              } else {
                if (row.paymentProof.status == 2) {
                  return <span className="flex text-xs">{numberToRupiah(row.paymentProof.amount)} </span>;
                } else {
                  return <span className="text-xs py-5">-</span>;
                }
              }
            },
          });
        } else if (el.linkPayment) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: false,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;

              if (!row?.paymentProof?.file) {
                return <span className="text-xs py-5">-</span>;
              } else {
                return (
                  <a
                    href={row?.paymentProof?.file?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex text-xs"
                  >
                    {row?.paymentProof?.file?.filename}
                  </a>
                );
              }
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
          const row = props.row.original;
          // const { onLoad } = props;

          if (row.paymentProof && row.paymentProof.status == 2) {
            return (
              <div className="flex">
                <span className="px-3 py-2 bg-green-50 rounded-full border border-green-500 text-green-500 text-xs font-normal font-goth">
                  Disetujui
                </span>
              </div>
            );
          } else if (row.paymentProof && row.paymentProof.status == 1) {
            return (
              <div className="flex justify-center space-x-2">
                <ApproveButton data={row.paymentProof?.id} onLoad={onLoad} />
                <RejectButton data={row.paymentProof?.id} onLoad={onLoad} />
              </div>
            );
          } else {
            return (
              <div className="flex justify-center">
                <span className="text-xs">-</span>
              </div>
            );
          }
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
    </>
  );
};
