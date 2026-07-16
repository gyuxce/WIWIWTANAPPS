import { useCallback, useMemo } from 'react';
import { DataTable } from 'components/shared';
import { PageConfig } from './config';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import { numberToRupiah } from 'components/ui/utils/formatter';
import StatusBadge from 'components/ui/StatusBadge';

dayjs.extend(utc);

export const PageTable = (props) => {
  const columns = useMemo(() => {
    const cols = [];

    for (let index = 0; index < PageConfig.listFields.length; index++) {
      const el = PageConfig.listFields[index];
      if (props.checkboxList.includes(el.key)) {
        if (['created_at', 'updated_at', 'exam_schedule_active.start_date'].includes(el.key)) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.key,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              let data = row[el.key];
              if (el.key === 'exam_schedule_active.start_date') {
                data = row?.exam_schedule_active?.start_date;
              }
              return data ? <span className="text-xs">{dayjs(data).format('DD MMMM YYYY, HH:mm')} </span> : '-';
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
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return (
                <div className="flex text-xs">
                  {el.key === 'status_pr' ? (
                    <StatusBadge
                      text={`${row[el.target]}/2 Selesai`}
                      color={row[el.target] === 2 ? 'green' : row[el.target] === 1 ? 'blue' : 'red'}
                    />
                  ) : (
                    <StatusBadge
                      text={row[el.target] || 'Menunggu'}
                      color={
                        [2, 3, 4, 7, null].includes(row[el.key])
                          ? 'orange'
                          : [1, 5].includes(row[el.key])
                          ? 'green'
                          : 'red'
                      }
                    />
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
        // width: 200,
        Cell: (props) => {
          return (
            <div
              className="flex justify-center content-center cursor-pointer"
              onClick={() => onEdit(props?.row?.original?.id)}
            >
              <span className="rounded py-2 px-3 border border-stone-300  ">
                <img src="/img/icon/pencil.svg" alt="" />
              </span>
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
    navigate(`${PageConfig.url}/${id}`);
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
    </>
  );
};
