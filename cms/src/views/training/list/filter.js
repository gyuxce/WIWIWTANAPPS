import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Input } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import SideBar from 'components/template/SideFilter';
import { COURSE_GROUP } from 'components/ui/utils/constant';
import { HiOutlineSearch } from 'react-icons/hi';
import { debounce } from 'lodash';

export const Filter = (props) => {
  const category = props.category;
  const training = props.training;
  const [categoryModule, setCategoryModule] = useState(category || []);
  const [trainingModule, setTrainingModule] = useState(training || []);
  const [showMore, setShowMore] = useState(false);
  const [showMoreTraining, setShowMoreTraining] = useState(false);
  const searchInput = useRef();
  const [checkboxListProgram, setCheckboxListProgram] = useState([]);
  const [checkboxListCategory, setCheckboxListCategory] = useState([]);
  const [checkboxListTraining, setCheckboxListTraining] = useState([]);

  const handleSearchCategory = debounce((value) => {
    const searchResult = category.filter((ct) => ct.title.toLowerCase().includes(value.toLowerCase()));
    setCategoryModule(searchResult);
  }, 500);

  const handleSearchTraining = debounce((value) => {
    const searchResult = training.filter((ct) => ct.title.toLowerCase().includes(value.toLowerCase()));
    setTrainingModule(searchResult);
  }, 500);

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === 'category') {
      handleSearchCategory(value);
    } else if (type === 'training') {
      handleSearchTraining(value);
    }
  };

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
    const newData = [...category];
    setCategoryModule(newData);
  };

  const handleShowMoreTrainingClick = () => {
    setShowMoreTraining(!showMoreTraining);
    const newData = [...training];
    setTrainingModule(newData);
  };

  const submitFilter = async () => {
    let params = { ...props.localState.params };
    params.options = ['filter,is_header,is_null', `filter,group,equal,${COURSE_GROUP.MATERIAL}`];
    if (checkboxListProgram.length > 0) {
      params.options.push('filter,program_type,in,' + checkboxListProgram.join('|'));
    }
    if (checkboxListCategory.length > 0) {
      params.options.push('filter,course.uuid,in,' + checkboxListCategory.join('|'));
    }
    if (checkboxListTraining.length > 0) {
      params.options.push('filter,module.uuid,in,' + checkboxListTraining.join('|'));
    }
    props.getData(params);
    props.setCountFilter(checkboxListProgram.length + checkboxListCategory.length + checkboxListTraining.length);
    props.setToggleDrawer(false);
  };

  useEffect(() => {
    setCategoryModule(category || []);
    setTrainingModule(training || []);
  }, [category, training]);

  useEffect(() => {
    if (!props.toggleDrawer) {
      setCategoryModule(category || []);
      setTrainingModule(training || []);
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
                placeholder={props?.placeholder ? props?.placeholder : 'Cari kategori modul'}
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={(e) => handleInputChange(e, 'category')}
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
          <AccordionItemCustome title="Modul Pelatihan">
            <div className="mt-2">
              <Input
                ref={searchInput}
                className={`w-full ${props.className ?? null}`}
                size={props?.size ? props.size : 'sm'}
                placeholder={props?.placeholder ? props?.placeholder : 'Cari modul pelatihan'}
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={(e) => handleInputChange(e, 'training')}
              />
            </div>
            <Checkbox.Group
              className="mt-3 py-3 px-4"
              vertical
              value={checkboxListTraining}
              onChange={setCheckboxListTraining}
            >
              {trainingModule
                ?.slice(0, trainingModule.length > 3 && !showMoreTraining ? 3 : trainingModule.length)
                .map((val, idx) => {
                  return (
                    <Checkbox key={idx} value={val.id} className={`${idx != trainingModule.length - 1 ? ' mb-5' : ''}`}>
                      <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                        {val.title}
                      </span>
                    </Checkbox>
                  );
                })}
              {!showMoreTraining && trainingModule.length > 3 ? (
                <>
                  <div className="col-span-10">
                    <button
                      className="text-blue-950 text-sm font-bold font-goth leading-[21px] focus:outline-none"
                      onClick={() => handleShowMoreTrainingClick()}
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
              setCheckboxListTraining([]);
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
