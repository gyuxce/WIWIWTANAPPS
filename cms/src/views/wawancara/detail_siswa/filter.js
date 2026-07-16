import { Button, Checkbox, Input } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { TUJUAN_WAWANCARA } from 'components/ui/utils/constant';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import SideBar from 'components/template/SideFilter';

export const Filter = (props) => {
  const interviewers = props.interviewers;
  const agencies = props.agencies;
  const [checkboxTujuanWawancara, setCheckboxTujuanWawancara] = useState([]);
  const [checkboxPewawancara, setCheckboxPewawancara] = useState([]);
  const [checkboxInstansi, setCheckboxInstansi] = useState([]);
  const [dataAgencies, setDataAgencies] = useState(agencies);
  const [dataInterviewer, setDataInterviewer] = useState(interviewers);
  const [showMore, setShowMore] = useState(false);
  const [showMoreAgen, setShowMoreAgen] = useState(false);
  // const [showMoreInstansi, setShowMoreInstansi] = useState(false);
  const searchInput = useRef();
  const debounceFn = debounce(handleDebounceFn, 500);
  const debounceFnAgencies = debounce(handleDebounceFnAgen, 500);
  function handleDebounceFn(val) {
    const searchResult = interviewers.filter((v) => v.label.toLowerCase().includes(val.toLowerCase()));

    setDataInterviewer(searchResult);
  }

  function handleDebounceFnAgen(val) {
    const searchResult = agencies.filter((v) => v.label.toLowerCase().includes(val.toLowerCase()));

    setDataAgencies(searchResult);
  }

  const onEdit = (e) => {
    debounceFn(e.target.value);
  };
  const onEditAgen = (e) => {
    debounceFnAgencies(e.target.value);
  };

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
    const newData = [...interviewers];
    setDataInterviewer(newData);
  };

  const handleAgenShowMoreClick = () => {
    setShowMoreAgen(!showMoreAgen);
    const newData = [...agencies];
    setDataAgencies(newData);
  };

  const submitFilter = async () => {
    let params = { ...props.localState.params };
    let optionsFilter = ['filter,user.uuid,equal,' + props.id];
    if (checkboxTujuanWawancara.length > 0) {
      optionsFilter.push('filter,type,in,' + checkboxTujuanWawancara.join('|'));
    }
    if (checkboxInstansi.length > 0) {
      optionsFilter.push('filter,agency,in,' + checkboxInstansi.join('|'));
    }
    if (checkboxPewawancara.length > 0) {
      optionsFilter.push('filter,name,in,' + checkboxPewawancara.join('|'));
    }
    params.options = [params.options[0], ...optionsFilter];
    props.getData(params);
    props.setCountFilter(checkboxTujuanWawancara?.length + checkboxPewawancara?.length + checkboxInstansi?.length);
    props.setToggleDrawer(false);
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
          <AccordionItemCustome title="Tujuan Wawancara">
            <Checkbox.Group
              className="mt-3 py-3 px-4"
              vertical
              value={checkboxTujuanWawancara}
              onChange={setCheckboxTujuanWawancara}
            >
              {TUJUAN_WAWANCARA.map((val, idx) => {
                return (
                  <Checkbox
                    key={idx}
                    value={val.value}
                    className={`${idx != TUJUAN_WAWANCARA.length - 1 ? ' mb-5' : ''}`}
                  >
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                      {val.label}
                    </span>
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </AccordionItemCustome>
        </AccordionCustome>
        <AccordionCustome>
          <AccordionItemCustome title="Pewawancara">
            <div className="mt-2">
              <Input
                ref={searchInput}
                className={`w-full ${props.className ?? null}`}
                size={props?.size ? props.size : 'sm'}
                placeholder={props?.placeholder ? props?.placeholder : 'Search...'}
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={onEdit}
              />
            </div>
            <Checkbox.Group
              className="mt-3 py-3 px-4"
              vertical
              value={checkboxPewawancara}
              onChange={setCheckboxPewawancara}
            >
              {dataInterviewer
                ?.slice(0, dataInterviewer.length > 3 && !showMore ? 3 : dataInterviewer?.length)
                .map((val, idx) => {
                  return (
                    <Checkbox
                      key={idx}
                      value={val.value}
                      className={`${idx != dataInterviewer?.length - 1 ? ' mb-5' : ''}`}
                    >
                      <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                        {val.label}
                      </span>
                    </Checkbox>
                  );
                })}
              {!showMore && dataInterviewer.length > 3 ? (
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
        <AccordionCustome>
          <AccordionItemCustome title="Instansi">
            <div className="mt-2">
              <Input
                ref={searchInput}
                className={`w-full ${props.className ?? null}`}
                size={props?.size ? props.size : 'sm'}
                placeholder={props?.placeholder ? props?.placeholder : 'Search...'}
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={onEditAgen}
              />
            </div>
            <Checkbox.Group className="mt-3 py-3 px-4" vertical value={checkboxInstansi} onChange={setCheckboxInstansi}>
              {dataAgencies
                ?.slice(0, dataAgencies.length > 3 && !showMore ? 3 : dataAgencies.length)
                .map((val, idx) => {
                  return (
                    <Checkbox
                      key={idx}
                      value={val.value}
                      className={`${idx != dataAgencies.length - 1 ? ' mb-5' : ''}`}
                    >
                      <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                        {val.label}
                      </span>
                    </Checkbox>
                  );
                })}
              {!showMore && dataAgencies.length > 3 ? (
                <>
                  <div className="col-span-10">
                    <button
                      className="text-blue-950 text-sm font-bold font-goth leading-[21px] focus:outline-none"
                      onClick={() => handleAgenShowMoreClick()}
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
              setCheckboxTujuanWawancara([]);
              setCheckboxPewawancara([]);
              setCheckboxInstansi([]);
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
