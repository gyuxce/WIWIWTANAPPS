import { Button, Dropdown, Input } from 'components/ui';
import React from 'react';
import { BsSearch } from 'react-icons/bs';

function TableFilter({searchOnChange = () => {}, setSearch, sort = () => {}, filter,valid}) {
  return (
    <div className="flex justify-between bg-white p-3 border-b-[1px] rounded-t-xl">
      <div>
        <Input size="sm" placeholder="Search" prefix={<BsSearch size={18} />} className="w-[282px]" onChange={(e) => {searchOnChange(e); setSearch(e.target.value)}}/>
      </div>
      <div className="flex gap-3">
        {
          valid &&
          <div className='w-[150px] border border-second-100 rounded-lg px-3 py-1 flex justify-center items-center text-second-100 font-bold'>
            Total Valid : {valid}
          </div>
        }
        {/* {
          hapus && Object.values(rowSelection).length != 0 &&
          <Button size="sm" variant="plain" className="border border-second-200 text-second-200 w-[100px]" onClick={()=>sort()}>
            {`Delete (${Object.values(rowSelection).length})`}
          </Button>

        } */}
        <Dropdown placement="bottom-center" title="Sort" renderTitle={
          <Button size="sm" variant="plain" className="border border-main-200 text-main-200 w-[100px]">
            Sort
          </Button>
        }>
          <Dropdown.Item 
            eventKey=""
            onSelect={(e) => {sort(e)}}
          >
            All
          </Dropdown.Item>
          <Dropdown.Item 
            eventKey="asc"
            onSelect={(e) => {sort(e)}}
          >
            A - Z
          </Dropdown.Item>
          <Dropdown.Item 
            eventKey="desc"
            onSelect={(e) => {sort(e)}}
          >
            Z - A
          </Dropdown.Item>
        </Dropdown>
        {
          filter && (
            <Button size="sm" variant="plain" className="border border-main-200 text-main-200 w-[100px]" onClick={()=> filter()}>
              Filter
            </Button>
          )
        }
      </div>
    </div>
  );
}

export default TableFilter;
