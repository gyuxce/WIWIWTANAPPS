import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Input } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import SideBar from 'components/template/SideFilter';
import { HiOutlineSearch } from 'react-icons/hi';
import { debounce } from 'lodash';

export const Filter = (props) => {
  const category = props.category;
  const [categoryModule, setCategoryModule] = useState(category);
  const [showMore, setShowMore] = useState(false);
  const searchInput = useRef();
  const debounceFn = debounce(handleDebounceFn, 500);
  const [checkboxListProgram, setCheckboxListProgram] = useState([]);
  const [checkboxListCategory, setCheckboxListCategory] = useState([]);
  const [checkboxListAccess, setCheckboxListAccess] = useState([]);
  const [checkboxListLevel, setCheckboxListLevel] = useState([]);
  function handleDebounceFn(val) {
    const searchResult = category.filter((ct) => ct.title.toLowerCase().includes(val.toLowerCase()));
    setCategoryModule(searchResult);
  }

  const onEdit = (e) => {
    debounceFn(e.target.value);
  };

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
    const newData = [...category];
    setCategoryModule(newData);
  };

  const submitFilter = async () => {
    let params = { ...props.localState.params };
    params.options = ['filter,is_header,is_not_null'];
    if (checkboxListProgram.length > 0) {
      params.options.push('filter,program_type,in,' + checkboxListProgram.join('|'));
    }
    if (checkboxListCategory.length > 0) {
      params.options.push('filter,course.uuid,in,' + checkboxListCategory.join('|'));
    }
    if (checkboxListAccess.length > 0) {
      params.options.push('filter,access_module,in,' + checkboxListAccess.join('|'));
    }
    if (checkboxListLevel.length > 0) {
      params.options.push('filter,level_module,in,' + checkboxListLevel.join('|'));
    }
    props.getData(params);
    props.setCountFilter(
      checkboxListProgram.length + checkboxListCategory.length + checkboxListAccess.length + checkboxListLevel.length,
    );
    props.setToggleDrawer(false);
  };

  useEffect(() => {
    if (!props.toggleDrawer) {
      setCategoryModule(category);
    }
  }, [props.toggleDrawer]);

  return (
    <SideBar
      closePanel={() => {
        props.setToggleDrawer(false);
      }}
      panelExpand={props.toggleDrawer}
      className="w-[520px]"
    >
      <div className="h-[85%] 2xl:h-[88%] overflow-auto">
        <AccordionCustome>
          <AccordionItemCustome title="Fase Pelatihan">
            <Checkbox.Group
              className="mt-3 py-3 px-4"
              vertical
              value={checkboxListProgram}
              onChange={setCheckboxListProgram}
            >
              {props.program.map((val, idx) => {
                return (
                  <Checkbox key={idx} value={val.value} className={`${idx != props.program.length - 1 ? ' mb-5' : ''}`}>
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                      {val.name}
                    </span>
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </AccordionItemCustome>
        </AccordionCustome>
        <div className="h-4"></div>
        <AccordionCustome>
          <AccordionItemCustome title="Kategori Modul">
            <div className="mt-2">
              <Input
                ref={searchInput}
                className={`w-full ${props.className ?? null}`}
                size={props?.size ? props.size : 'sm'}
                placeholder={props?.placeholder ? props?.placeholder : 'Cari modul pelatihan'}
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={onEdit}
              />
            </div>
            <Checkbox.Group
              className="mt-3 py-3 px-4"
              vertical
              value={checkboxListCategory}
              onChange={setCheckboxListCategory}
            >
              {categoryModule
                ?.slice(0, categoryModule.length > 3 && !showMore ? 3 : categoryModule.length)
                .map((val, idx) => {
                  return (
                    <Checkbox key={idx} value={val.id} className={`${idx != categoryModule.length - 1 ? ' mb-5' : ''}`}>
                      <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                        {val.title}
                      </span>
                    </Checkbox>
                  );
                })}
              {!showMore && categoryModule.length > 3 ? (
                <>
                  <div className="col-span-10">
                    <button
                      className="text-blue-950 text-sm font-bold font-goth leading-[21px] focus:outline-none"
                      onClick={() => handleShowMoreClick()}
                    >
                      Lihat Lebih Banyak
                    </button>
                  </div>
                </>
              ) : (
                ''
              )}
            </Checkbox.Group>
          </AccordionItemCustome>
        </AccordionCustome>
        <div className="h-4"></div>
        <AccordionCustome>
          <AccordionItemCustome title="Akses Modul">
            <Checkbox.Group
              className="mt-3 py-3 px-4"
              vertical
              value={checkboxListAccess}
              onChange={setCheckboxListAccess}
            >
              {props.accessModule.map((val, idx) => {
                return (
                  <Checkbox
                    key={idx}
                    value={val.value}
                    className={`${idx != props.accessModule.length - 1 ? ' mb-5' : ''}`}
                  >
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                      {val.name}
                    </span>
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </AccordionItemCustome>
        </AccordionCustome>
        <div className="h-4"></div>
        <AccordionCustome>
          <AccordionItemCustome title="Level Modul">
            <Checkbox.Group
              className="mt-3 py-3 px-4"
              vertical
              value={checkboxListLevel}
              onChange={setCheckboxListLevel}
            >
              {props.levelModule.map((val, idx) => {
                return (
                  <Checkbox
                    key={idx}
                    value={val.value}
                    className={`${idx != props.levelModule.length - 1 ? ' mb-5' : ''}`}
                  >
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                      {val.name}
                    </span>
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </AccordionItemCustome>
        </AccordionCustome>
      </div>
      <div className="">
        <div className="flex items-center justify-center border-t border-stone-200 space-x-3 pt-6 pb-8">
          <Button
            variant="default"
            className="!py-0 w-[200px] h-10 "
            icon={<img src="/img/icon/refresh-icon.svg" alt="" style={{ height: '24px', width: '24px' }} />}
            onClick={() => {
              setCheckboxListProgram([]);
              setCheckboxListCategory([]);
              setCheckboxListAccess([]);
              setCheckboxListLevel([]);
            }}
          >
            <div className="text-black font-normal">Atur Ulang</div>
          </Button>
          <Button
            variant="default"
            className="!py-0 w-[200px] h-10"
            icon={<img src="/img/icon/checklist-icon.svg" alt="" style={{ height: '24px', width: '24px' }} />}
            onClick={submitFilter}
          >
            <div className="text-black font-normal">Konfirmasi</div>
          </Button>
        </div>
      </div>
    </SideBar>
  );
};
