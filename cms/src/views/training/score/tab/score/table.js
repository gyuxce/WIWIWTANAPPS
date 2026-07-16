import { useCallback, useMemo, useState } from 'react';
import { DataTable } from 'components/shared';
import { PageConfig } from './config';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import StatusBadge from 'components/ui/StatusBadge';
import { TrashIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { Button, Input } from 'components/ui';
import { formatDateDMY, formatDateTime } from 'components/ui/utils/formatter';
import { QUESTION_TYPE } from 'components/ui/utils/constant';
import { handleDownloadClick } from 'components/ui/utils/downloadFile';

dayjs.extend(utc);

export const PageTable = (props) => {
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
            sortable: true,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              return <span className="text-xs py-5">{formatDateDMY(row[el.key])}</span>;
            },
          });
        } else if (el.type === 'datetime') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: true,
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
        } else if (el.type === 'answer') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (props) => {
              const row = props.row.original;
              const value = getValueByKey(row, 'a_body_text');
              const file = getValueByKey(row, 'file.url');
              if (row?.question?.type == QUESTION_TYPE[0]?.value || row?.question?.type == QUESTION_TYPE[1]?.value) {
                return (
                  <span className="text-xs">{getValueByKey(row, 'user_exam_question_item.o_description') || '-'}</span>
                );
              } else if (
                row?.question?.type == QUESTION_TYPE[3]?.value ||
                row?.question?.type == QUESTION_TYPE[4]?.value
              ) {
                return (
                  <div className="flex text-xs">
                    {file ? (
                      <div>
                        <div
                          className="grow shrink basis-0 cursor-pointer text-blue-950 text-xs font-normal font-goth underline"
                          onClick={() => handleDownloadClick(file)}
                        >
                          Lampiran
                        </div>
                      </div>
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                );
              } else {
                return <span className="text-xs">{value || '-'}</span>;
              }
            },
          });
        } else if (el.type === 'poin') {
          cols.push({
            Header: el.label,
            accessor: el.key,
            sortable: el.sortable,
            width: el.width,
            Cell: (propz) => {
              const row = propz.row.original;
              let value = getValueByKey(row, el.key);
              const [nilai, setNilai] = useState(value);
              const onChangeNilai = (val) => {
                if (/^\d*\.?\d*$/.test(val)) {
                  setNilai(val);
                  props.setQuestion((prevQuestion) => {
                    return prevQuestion.map((item) => {
                      if (item.id == row?.question?.id) {
                        return { ...item, a_weight: val };
                      } else {
                        return item;
                      }
                    });
                  });
                }
              };
              if (
                row?.question?.type == QUESTION_TYPE[2]?.value ||
                row?.question?.type == QUESTION_TYPE[3]?.value ||
                row?.question?.type == QUESTION_TYPE[4]?.value
              ) {
                return (
                  <Input
                    size="md"
                    type="text"
                    value={nilai}
                    onChange={(e) => {
                      onChangeNilai(e.target.value);
                    }}
                  />
                );
              } else {
                return <span className="text-xs">{value || '0'}</span>;
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
                  onClick={() => {}}
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
