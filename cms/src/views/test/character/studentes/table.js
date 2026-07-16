import { useCallback, useMemo } from 'react';
import { DataTable } from 'components/shared';

import { apiUpdate } from '../api/api';
import { Notification, toast } from 'components/ui';
import { PageConfig } from './config';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import { numberToRupiah } from 'components/ui/utils/formatter';
import { handleDownloadClick } from 'components/ui/utils/downloadFile';

dayjs.extend(utc);

export const PageTable = (props) => {
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
                      <div className=" px-3">
                        <span className="px-3 py-2 bg-green-50 rounded-full border border-green-500 text-green-500 text-xs font-normal font-goth">
                          {row[el.target]}
                        </span>
                      </div>
                    ) : (
                      <div className=" px-3">
                        {row[el.target] !== null ? (
                          <div className="h-[31px] px-3 py-2 bg-blue-50 rounded-[100px] border border-blue-600  justify-center items-center gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xs font-normal font-goth">{row[el.target]}</div>
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
        } else if (el.key == 'file_tes_character_status') {
          // fileTesCharacter.url
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: true,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              const value = row[el.target];

              return (
                <div className="flex text-xs">
                  {value ? (
                    <div>
                      <div
                        className="grow shrink basis-0 cursor-pointer text-blue-950 text-xs font-normal font-goth underline"
                        onClick={() => handleDownloadClick(value?.url)}
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
                <div
                  className="flex justify-center content-center cursor-pointer"
                  onClick={() => onEdit(props?.row?.original?.id)}
                >
                  <span className="rounded py-2 px-3 border border-stone-300  ">
                    <img src="/img/icon/pencil.svg" alt="" />
                  </span>
                </div>
              ) : (
                <div className="flex justify-center gap-2">
                  <div className="flex items-center justify-center content-center">
                    <span
                      className="py-2 px-3 text-center text-blue-950 text-xs font-normal font-goth rounded border border-blue-950 cursor-pointer"
                      onClick={() => UpdateStatus(props?.row?.original?.id, 1)}
                    >
                      Terima
                    </span>
                  </div>
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

  const navigate = useNavigate();

  const onEdit = (id) => {
    navigate(`${PageConfig.url}/${id}`);
  };

  const UpdateStatus = async (id, status) => {
    try {
      await apiUpdate(id, {
        status: status,
        finished_at: dayjs().utc().format('YYYY-MM-DD HH:mm:ss'),
      });

      toast.push(
        <Notification title={'Successfully Updated'} type="success" duration={2500}>
          Data successfully updated
        </Notification>,
        {
          placement: 'top-center',
        },
      );

      props.getData(props.localState.params);
    } catch (error) {
      console.error('Error updating status:', error);

      toast.push(
        <Notification title={'Error'} type="error" duration={2500}>
          An error occurred while updating data
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
    </>
  );
};
