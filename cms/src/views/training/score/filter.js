import { useState } from 'react';
import { Button, Checkbox, Input } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import SideBar from 'components/template/SideFilter';
import { HiOutlineSearch } from 'react-icons/hi';

export const Filter = (props) => {
  const { categories = [], trainings = [], asessmentTypes = [] } = props;
  const [checkboxListProgram, setCheckboxListProgram] = useState([]);
  const [categoryModules, setCategoryModules] = useState(categories);
  const [checkboxCategoryModul, setCheckboxCategoryModul] = useState([]);
  const [trainingModules, setTrainingModules] = useState(trainings);
  const [checkboxTrainingModules, setCheckboxTrainingModules] = useState([]);
  const [checkboxAssesmentTypes, setCheckboxAssesmentTypes] = useState([]);
  const [showMoreCategory, setShowMoreCategory] = useState(false);
  const [showMoreTraining, setShowMoreTraining] = useState(false);

  const onSearchCategoryModule = (e) => {
    const result = categories.filter((ct) => ct.label.toLowerCase().includes(e.target.value.toLowerCase()));
    setCategoryModules(result);
  };

  const onSearchTrainingModules = (e) => {
    const result = trainings.filter((ct) => ct.label.toLowerCase().includes(e.target.value.toLowerCase()));
    setTrainingModules(result);
  };

  const submitFilter = async () => {
    let params = { ...props.localState.params };
    params.options = [];
    delete params.training_modules;
    delete params.assesment_types;
    if (checkboxListProgram.length > 0) {
      params.options.push('filter,item.program_type,in,' + checkboxListProgram.join('|'));
    }
    if (checkboxCategoryModul.length > 0) {
      params.options.push('filter,course.uuid,in,' + checkboxCategoryModul.join('|'));
    }
    if (checkboxTrainingModules.length > 0) {
      params.training_modules = checkboxTrainingModules;
    }
    if (checkboxAssesmentTypes.length > 0) {
      params.assesment_types = checkboxAssesmentTypes;
    }
    props.getData(params);
    props.setCountFilter(
      checkboxListProgram.length +
        checkboxCategoryModul.length +
        checkboxTrainingModules.length +
        checkboxAssesmentTypes.length,
    );
    props.setToggleDrawer(false);
  };

  const handleShowMoreClick = (type = 'category') => {
    if (type === 'category') {
      setShowMoreCategory(!showMoreCategory);
    }
    if (type === 'training') {
      setShowMoreTraining(!showMoreTraining);
    }
  };

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
          <AccordionItemCustome title="Program Pelatihan">
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
                className={`w-full ${props.className ?? null}`}
                size={props?.size ? props.size : 'sm'}
                placeholder={props?.placeholder ? props?.placeholder : 'Cari kategori modul'}
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={onSearchCategoryModule}
              />
            </div>
            <div>
              <Checkbox.Group
                className="mt-3 py-3 px-4"
                vertical
                value={checkboxCategoryModul}
                onChange={setCheckboxCategoryModul}
              >
                {categoryModules
                  ?.slice(0, categoryModules.length > 3 && !showMoreCategory ? 3 : categoryModules.length)
                  .map((val, idx) => {
                    return (
                      <Checkbox
                        key={idx}
                        value={val.value}
                        className={`${idx != categoryModules.length - 1 ? ' mb-5' : ''}`}
                      >
                        <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                          {val.label}
                        </span>
                      </Checkbox>
                    );
                  })}
              </Checkbox.Group>
              {!showMoreCategory && categoryModules.length > 3 ? (
                <>
                  <div className="col-span-10">
                    <button
                      className="text-blue-950 text-sm font-bold font-goth leading-[21px] focus:outline-none"
                      onClick={() => handleShowMoreClick('category')}
                    >
                      Lihat Lebih Banyak
                    </button>
                  </div>
                </>
              ) : (
                ''
              )}
              {showMoreCategory && categoryModules.length > 3 ? (
                <>
                  <div className="col-span-10 mt-3">
                    <button
                      className="text-blue-950 text-sm font-bold font-goth leading-[21px] focus:outline-none"
                      onClick={() => handleShowMoreClick('category')}
                    >
                      Lihat Lebih Sedikit
                    </button>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </AccordionItemCustome>
        </AccordionCustome>
        <div className="h-4"></div>
        <AccordionCustome>
          <AccordionItemCustome title="Modul Pelatihan">
            <div className="mt-2">
              <Input
                className={`w-full ${props.className ?? null}`}
                size={props?.size ? props.size : 'sm'}
                placeholder={props?.placeholder ? props?.placeholder : 'Cari kategori modul'}
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={onSearchTrainingModules}
              />
            </div>
            <div>
              <Checkbox.Group
                className="mt-3 py-3 px-4"
                vertical
                value={checkboxTrainingModules}
                onChange={setCheckboxTrainingModules}
              >
                {trainingModules
                  ?.slice(0, trainingModules.length > 3 && !showMoreTraining ? 3 : trainingModules.length)
                  .map((val, idx) => {
                    return (
                      <Checkbox
                        key={idx}
                        value={val.label}
                        className={`${idx != trainingModules.length - 1 ? ' mb-5' : ''}`}
                      >
                        <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                          {val.label}
                        </span>
                      </Checkbox>
                    );
                  })}
              </Checkbox.Group>
              {!showMoreTraining && trainingModules.length > 3 ? (
                <>
                  <div className="col-span-10">
                    <button
                      className="text-blue-950 text-sm font-bold font-goth leading-[21px] focus:outline-none"
                      onClick={() => handleShowMoreClick('training')}
                    >
                      Lihat Lebih Banyak
                    </button>
                  </div>
                </>
              ) : (
                ''
              )}
              {showMoreTraining && trainingModules.length > 3 ? (
                <>
                  <div className="col-span-10 mt-3">
                    <button
                      className="text-blue-950 text-sm font-bold font-goth leading-[21px] focus:outline-none"
                      onClick={() => handleShowMoreClick('training')}
                    >
                      Lihat Lebih Sedikit
                    </button>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </AccordionItemCustome>
        </AccordionCustome>
        <div className="h-4"></div>
        <AccordionCustome>
          <AccordionItemCustome title="Tipe Asesmen">
            <div className="mt-2">
              <Checkbox.Group
                className="mt-3 py-3 px-4"
                vertical
                value={checkboxAssesmentTypes}
                onChange={setCheckboxAssesmentTypes}
              >
                {asessmentTypes.map((val, idx) => {
                  return (
                    <Checkbox
                      key={idx}
                      value={val.label}
                      className={`${idx != asessmentTypes.length - 1 ? ' mb-5' : ''}`}
                    >
                      <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                        {val.label}
                      </span>
                    </Checkbox>
                  );
                })}
              </Checkbox.Group>
            </div>
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
              setCheckboxCategoryModul([]);
              setCheckboxAssesmentTypes([]);
              setCheckboxTrainingModules([]);
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
