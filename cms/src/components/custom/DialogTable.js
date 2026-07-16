import { Dialog } from 'components/ui';
import { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import { TableSearch } from 'components/custom/search';
import { DataTable } from 'components/shared';
import { formatDateDMY } from 'components/ui/utils/formatter';

dayjs.extend(utc);

function DialogTable(props) {
  const {
    isOpen,
    onClose,
    logo,
    title,
    getData,
    localState,
    field = [],
    checkboxList = [],
    setIds = [],
    primaryKey = 'id',
  } = props;

  const columns = useMemo(() => {
    const cols = [];

    for (let index = 0; index < field.length; index++) {
      const el = field[index];
      if (checkboxList.includes(el.key)) {
        if (['created_at', 'updated_at'].includes(el.key)) {
          cols.push({
            Header: el.label,
            accessor: el.key,
            width: el.width,
            sortable: true,
            Cell: (props) => {
              const row = props.row.original;
              return <span className="text-xs">{formatDateDMY(row[el.key])} </span>;
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

    return cols;
  }, [checkboxList]);

  const metaTable = {
    total: localState.meta?.total || 0,
    pageIndex: localState.meta?.current_page || 1,
    pageSize: localState.meta?.per_page || 10,
  };

  const onPaginationChange = (page) => {
    getData({ ...localState.params, page: page });
  };

  const onSelectChange = (value) => {
    getData({ ...localState.params, limit: value, page: 1 });
  };

  const onSort = (sort) => {
    getData({
      ...localState.params,
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
          selectedIds.push(el[primaryKey]);
        }

        setIds(selectedIds);
      } else {
        setIds([]);
      }
    },
    [props],
  );

  const onCheckBoxChange = (checked, row) => {
    setIds((s) => {
      let x = [...s];
      if (checked) {
        x.push(row[primaryKey]);
      } else {
        for (let index = 0; index < x.length; index++) {
          const el = x[index];

          if (row[primaryKey] === el) {
            x.splice(index, 1);
          }
        }
      }

      return x;
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      closable={true}
      contentClassName="w-[569px] p-6 bg-white"
    >
      <div className="justify-start items-start gap-4 inline-flex">
        <div className="justify-start items-center gap-3 flex">
          {logo}
          <div className="text-gray-900 text-xl font-bold">{title}</div>
        </div>
      </div>
      <div className="my-[1.25rem]">
        <TableSearch localState={localState} getData={getData} className="!w-full" />
      </div>
      <DataTable
        columns={columns}
        data={localState.data}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        loading={localState?.loading || false}
        pagingData={metaTable}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        onSort={onSort}
        selectable={false}
        wrapClass="min-h-[360px]"
        onCheckBoxChange={onCheckBoxChange}
        onIndeterminateCheckBoxChange={onAllRowSelect}
        showPagination={true}
        showLimitPerPage={true}
      />
    </Dialog>
  );
}

export default DialogTable;
