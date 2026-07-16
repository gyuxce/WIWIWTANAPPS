import { Select } from 'components/ui';
import { OPTION_STATUS_MASTER_DATA } from 'components/ui/utils/constant';
import { useEffect, useRef, useState } from 'react';
import { apiGetRole } from 'services/AppService';

export const Filter = (props) => {
  const [options, setOptions] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const firstLoad = useRef(true);

  const loadOption = async () => {
    const ress = await apiGetRole({ type: 'collection' });
    setRoleList(ress.data?.data || []);
  };

  const optionRole = roleList?.map((option) => ({
    value: option?.id,
    label: option?.name,
  }));

  const onChangeRole = (option) => {
    const filterKey = 'filter,role.uuid';
    handleChange(filterKey, option);
  };

  const onChangeStatus = (option) => {
    const filterKey = 'filter,is_active';
    handleChange(filterKey, option);
  };

  const handleChange = (key, option) => {
    let updatedOptions = options.filter((item) => !item.startsWith(key));
    if (option) {
      const filterValue = option.value;
      const filter = `${key},equal,${filterValue}`;
      updatedOptions = updatedOptions.concat(filter);

      setOptions(updatedOptions);
      props.getData({ ...props.localState.params, options: updatedOptions, page: 1 });
    } else {
      setOptions(updatedOptions);
      props.getData({ ...props.localState.params, options: updatedOptions, page: 1 });
    }
  };

  useEffect(() => {
    if (firstLoad.current) {
      loadOption();
    }
  }, []);

  return (
    <>
      <Select
        className="w-[12.5rem] !h-[32px]"
        isClearable
        size="sm"
        placeholder="Filter by Role"
        options={optionRole}
        onChange={onChangeRole}
      />
      <Select
        className="w-[12.5rem] !h-[32px]"
        isClearable
        size="sm"
        placeholder="Select Status"
        options={OPTION_STATUS_MASTER_DATA}
        onChange={onChangeStatus}
      />
    </>
  );
};
