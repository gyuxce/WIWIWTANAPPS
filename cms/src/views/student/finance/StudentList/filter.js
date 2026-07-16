import { Input } from 'components/ui';
// import { OPTION_STATUS_MASTER_DATA } from 'components/ui/utils/constant';
import { useEffect, useRef, useState } from 'react';
import { apiGetRole } from 'services/AppService';

export const Filter = () => {
  // const [options, setOptions] = useState([]);
  const [, setRoleList] = useState([]);
  const firstLoad = useRef(true);

  const loadOption = async () => {
    const ress = await apiGetRole({ type: 'collection' });
    setRoleList(ress.data?.data || []);
  };

  // const handleChange = (key, option) => {
  //   let updatedOptions = options.filter((item) => !item.startsWith(key));
  //   if (option) {
  //     const filterValue = option.value;
  //     const filter = `${key},equal,${filterValue}`;
  //     updatedOptions = updatedOptions.concat(filter);

  //     setOptions(updatedOptions);
  //     props.getData({ ...props.localState.params, options: updatedOptions, page: 1 });
  //   } else {
  //     setOptions(updatedOptions);
  //     props.getData({ ...props.localState.params, options: updatedOptions, page: 1 });
  //   }
  // };

  useEffect(() => {
    if (firstLoad.current) {
      loadOption();
    }
  }, []);

  return (
    <>
      <Input
        className={`w-[12.5rem] ml-3`}
        size="md"
        placeholder="Filter..."
        prefix={
          <div className="-mb-[2px]">
            <img src="/img/icon/adjust.png" alt="trash" className="h-4 w-4" />
          </div>
        }
        suffix={
          <div className="h-5 w-5 bg-main-200 rounded flex justify-center items-center">
            <p className="text-sub-b text-white -mb-[2px]">1</p>
          </div>
        }
      />
    </>
  );
};
