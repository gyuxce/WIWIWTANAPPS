import React, { forwardRef, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination, Select, Checkbox } from 'components/ui';
import TableRowSkeleton from './loaders/TableRowSkeleton';
import Loading from './Loading';
import { useTable, usePagination, useSortBy, useRowSelect } from 'react-table';
import { ViewNodata } from 'components/custom';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const IndeterminateCheckbox = forwardRef((props, ref) => {
  const { indeterminate, onChange, onCheckBoxChange, onIndeterminateCheckBoxChange, ...rest } = props;

  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  const handleChange = (e) => {
    onChange(e);
    onCheckBoxChange?.(e);
    onIndeterminateCheckBoxChange?.(e);
  };

  return <Checkbox className="mb-0" ref={resolvedRef} onChange={(_, e) => handleChange(e)} {...rest} />;
});

const DataTable = (props) => {
  const {
    skeletonAvatarColumns,
    selectedIds,
    columns,
    data,
    loading,
    onCheckBoxChange,
    onIndeterminateCheckBoxChange,
    onPaginationChange,
    onSelectChange,
    onSort,
    pageSizes,
    selectable,
    skeletonAvatarProps,
    pagingData,
    wrapClass,
    autoResetSelectedRows,
    showPagination,
    manualSortBy = true,
  } = props;

  const { pageSize, pageIndex, total } = pagingData;

  const pageSizeOption = useMemo(
    () => pageSizes.map((number) => ({ value: number, label: `${number} / Page` })),
    [pageSizes],
  );

  const handleCheckBoxChange = (checked, row) => {
    if (!loading) {
      onCheckBoxChange?.(checked, row);
    }
  };

  const handleIndeterminateCheckBoxChange = (checked, rows) => {
    if (!loading) {
      onIndeterminateCheckBoxChange?.(checked, rows);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: manualSortBy,
      autoResetSelectedRows,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (selectable) {
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            Header: (props) => (
              <div>
                <IndeterminateCheckbox
                  {...props.getToggleAllRowsSelectedProps()}
                  checked={selectedIds?.length > 0 && data?.length === selectedIds?.length}
                  onIndeterminateCheckBoxChange={(e) => handleIndeterminateCheckBoxChange(e.target.checked, props.rows)}
                />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox
                  {...row.getToggleRowSelectedProps()}
                  checked={
                    selectedIds?.find((v) => v === row?.original?.id) ||
                    selectedIds?.find((v) => v?.menu_id === row?.original?.id)
                  }
                  onCheckBoxChange={(e) => handleCheckBoxChange(e.target.checked, row.original)}
                />
              </div>
            ),
            sortable: false,
          },
          ...columns,
        ]);
      }
    },
  );

  const handlePaginationChange = (page) => {
    if (!loading) {
      onPaginationChange?.(page);
    }
  };

  const handleSelectChange = (value) => {
    if (!loading) {
      onSelectChange?.(Number(value));
    }
  };

  const handleSort = (column) => {
    if (!loading) {
      const { id, isSortedDesc, toggleSortBy, clearSortBy } = column;
      const sortOrder = isSortedDesc ? 'desc' : 'asc';
      toggleSortBy(!isSortedDesc);
      onSort?.({ order: sortOrder, key: id }, { id, clearSortBy });
    }
  };

  return (
    <Loading loading={loading && data.length !== 0} type="cover" className="flex flex-col flex-1">
      <div className="h-full">
        <Table
          {...getTableProps({
            wrapClass: wrapClass,
          })}
        >
          <THead className="!bg-transparent">
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column) => (
                  <Th
                    className={`text-stone-500 text-sm font-bold font-goth leading-[21px] bg-stone-50 border-t border-b border-stone-200  ${
                      column.className || ''
                    }`}
                    {...column.getHeaderProps({
                      style: {
                        minWidth: column.minWidth,
                        width: column.width,
                        height: column.height,
                      },
                    })}
                    key={column.render('Header') + 'index'}
                  >
                    {column.render('Header') &&
                      (column.sortable ? (
                        <div className="cursor-pointer flex items-center py-3" onClick={() => handleSort(column)}>
                          <span className="pr-[0.5rem] flex items-center">
                            <Sorter sort={column.isSortedDesc} />
                          </span>
                          <span className="flex items-center text-sm text-stone-500">{column.render('Header')}</span>
                        </div>
                      ) : (
                        <div
                          className={`${
                            ['Action', 'Status'].includes(column.render('Header')) ? 'flex items-center' : ''
                          } text-sm text-stone-500 justify-center py-3`}
                        >
                          {column.render('Header')}
                        </div>
                      ))}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          {loading && data.length === 0 ? (
            <TableRowSkeleton
              columns={columns.length}
              rows={pagingData.pageSize}
              avatarInColumns={skeletonAvatarColumns}
              avatarProps={skeletonAvatarProps}
            />
          ) : (
            <TBody {...getTableBodyProps()}>
              {!loading && page.length === 0 ? (
                <Tr>
                  <Td colSpan={100}>
                    <ViewNodata />
                  </Td>
                </Tr>
              ) : (
                page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr
                      {...row.getRowProps({
                        style: {
                          height: row.height,
                        },
                      })}
                      key={i}
                    >
                      {row.cells.map((cell, u) => {
                        return (
                          <Td {...cell.getCellProps()} key={u}>
                            <div className="py-5 text-main-200">{cell.render('Cell')}</div>
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })
              )}
            </TBody>
          )}
        </Table>
      </div>
      {showPagination ? (
        <div className="flex justify-between mt-5">
          <div className="mr-[1rem]">
            <Pagination pageSize={pageSize} currentPage={pageIndex} total={total} onChange={handlePaginationChange} />
          </div>
          <div style={{ minWidth: 130 }}>
            <Select
              className="text-main-200 !text-sm"
              size="sm"
              menuPlacement="top"
              isSearchable={false}
              value={pageSizeOption.filter((option) => option.value === pageSize)}
              options={pageSizeOption}
              onChange={(option) => handleSelectChange(option.value)}
            />
          </div>
        </div>
      ) : null}
    </Loading>
  );
};

DataTable.propTypes = {
  selectedIds: PropTypes.array,
  columns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool,
  onCheckBoxChange: PropTypes.func,
  onIndeterminateCheckBoxChange: PropTypes.func,
  onPaginationChange: PropTypes.func,
  onSelectChange: PropTypes.func,
  onSort: PropTypes.func,
  pageSizes: PropTypes.arrayOf(PropTypes.number),
  selectable: PropTypes.bool,
  skeletonAvatarColumns: PropTypes.arrayOf(PropTypes.number),
  skeletonAvatarProps: PropTypes.object,
  pagingData: PropTypes.shape({
    total: PropTypes.number,
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
  }),
  autoResetSelectedRows: PropTypes.bool,
  wrapClass: PropTypes.string,
  showPagination: PropTypes.bool,
};

DataTable.defaultProps = {
  pageSizes: [10, 25, 50, 100],
  pagingData: {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  },
  data: [],
  columns: [],
  selectedIds: [],
  wrapClass: '',
  selectable: false,
  loading: false,
  autoResetSelectedRows: true,
  showPagination: true,
};

export default DataTable;
