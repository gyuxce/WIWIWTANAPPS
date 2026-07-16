import { useCallback, useMemo, useState } from 'react';
import { DataTable, ConfirmDialog } from 'components/shared';

import { apiDestroy } from './api';
import { Button, Notification, Tag, toast } from 'components/ui';
import { PageConfig } from './config';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import { useNavigate } from 'react-router-dom';
import { formatDateDMY, numberToRupiah } from 'components/ui/utils/formatter';
import { EditSvg } from 'assets/svg';

dayjs.extend(utc);

const ActionColumn = ({ row, setDialogDeleteOpen, setRow }) => {
  const navigate = useNavigate();

  const onDelete = () => {
    setRow(row);
    setDialogDeleteOpen(true);
  };

  const onEdit = () => {
    navigate(`/student/payment/price/edit/${row.id}`);
  };

  const actionItems = [];

  if (PageConfig.enableEdit) {
    actionItems.push(
      <Button
        icon={<EditSvg />}
        variant="plain"
        className="text-main-100 text-xs"
        type="button"
        onClick={onEdit}
      ></Button>,
    );
  }

  if (PageConfig.enableDetails) {
    actionItems.push(
      <Button
        className="shadow-none rounded border border-stone-300"
        icon={<Pencil2Icon height={20} width={20} color="#262564" />}
        onClick={onEdit}
        // onClick={onEdit}
      ></Button>,
    );
  }

  if (PageConfig.enableDelete) {
    actionItems.push(
      <Button
        icon={<TrashIcon />}
        variant="plain"
        className="text-main-100 border-[1px] border-grey-300 rounded !h-8 !w-8"
        type="button"
        onClick={onDelete}
      ></Button>,
    );
  }

  return (
    <div className="flex justify-center gap-2">
      {PageConfig.enableActions && actionItems.map((item, index) => <div key={index}>{item}</div>)}
    </div>
  );
};

export const PageTable = (props) => {
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const [row, setRow] = useState({});
  const { getData, localState } = props;

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
              return <span className="text-xs py-5">{formatDateDMY(row[el.key])} </span>;
            },
          });
        } else if (el.administration) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              const tagStyle = getTagStyleAdminstration(row.transaction_status);

              return (
                <div className="flex text-xs py-5">
                  <Tag className={`${tagStyle} border-0 text-[.625rem]`}>{row.transaction_status_administration}</Tag>
                </div>
              );
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
              return <span className="flex text-xs">{numberToRupiah(row[el.key])} </span>;
            },
          });
        } else if (el.training) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              const tagStyle = getTagStyleTraining(row.transaction2_status);

              return (
                <div className="flex text-xs">
                  <Tag className={`${tagStyle} border-0 text-[.625rem]`}>{row.transaction_status_training}</Tag>
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
              return (
                <span className="text-xs">
                  {el?.target ? getValueByKey(row, el.target) : getValueByKey(row, el.key)}
                </span>
              );
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
            <div className="flex justify-center">
              <ActionColumn
                row={props.row.original}
                index={props.row.index}
                length={props.rows.length}
                setRow={setRow}
              />
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

  function getTagStyleAdminstration(status) {
    const styles = {
      1: 'text-green-100 bg-green-200',
      2: 'text-orange-500 bg-orange-200',
      3: 'text-red-100 bg-red-200',
    };

    return styles[status] || 'text-gray-100 bg-gray-200';
  }

  function getTagStyleTraining(status) {
    const styles = {
      1: 'text-green-100 bg-green-200',
      2: 'text-blue-500 bg-blue-200',
      3: 'text-red-100 bg-red-200',
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
