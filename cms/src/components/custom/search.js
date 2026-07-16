import { Input } from 'components/ui';
import { useRef } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { debounce } from 'lodash';

export const TableSearch = (props) => {
  const searchInput = useRef();
  const debounceFn = debounce(handleDebounceFn, 500);

  function handleDebounceFn(val) {
    if (typeof val === 'string' && val.length > 1) {
      props.getData({ ...props.localState.params, page: 1, q: val });
    }

    if (typeof val === 'string' && val.length === 0) {
      props.getData({ ...props.localState.params, page: 1, q: val });
    }
  }

  const onEdit = (e) => {
    debounceFn(e.target.value);
  };

  return (
    <Input
      ref={searchInput}
      className={`w-[18.5rem] ${props.className ?? null}`}
      size={props?.size ? props.size : 'sm'}
      placeholder={props?.placeholder ? props?.placeholder : 'Search...'}
      suffix={<HiOutlineSearch className="text-lg" />}
      onChange={onEdit}
    />
  );
};
