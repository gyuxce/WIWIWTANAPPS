import { useRef, useState } from 'react';
import { Button, DatePicker, Checkbox, Input } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import SideBar from 'components/template/SideFilter';
import dayjs from 'dayjs';
import { HiOutlineSearch } from 'react-icons/hi';
import { debounce } from 'lodash';

export const Filter = (props) => {
  const type = props.type;
  const [typeDoc, setTypeDoc] = useState(type);
  const [showMore, setShowMore] = useState(false);
  const searchInput = useRef();
  const debounceFn = debounce(handleDebounceFn, 500);
  const [checkboxListType, setCheckboxListType] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function handleDebounceFn(val) {
    const searchResult = type.filter((tp) => tp.name.toLowerCase().includes(val.toLowerCase()));
    setTypeDoc(searchResult);
  }

  const onEdit = (e) => {
    debounceFn(e.target.value);
  };

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
    const newData = [...type];
    setTypeDoc(newData);
  };

  const handleStartDate = (date) => {
    if (date == null) {
      setStartDate('');
    } else {
      setStartDate(date);
    }
  };

  const handleEndDate = (date) => {
    if (date == null) {
      setEndDate('');
    } else {
      setEndDate(date);
    }
  };

  const submitFilter = async () => {
    let params = { ...props.localState.params };
    params.options = [`filter,user.uuid,equal,${props.id}`];
    if (checkboxListType.length > 0) {
      params.options.push('filter,type,in,' + checkboxListType.join('|'));
    }
    if (startDate) {
      params.options.push(
        'filter,created_at,greater_than_equal,' + dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      );
    }
    if (endDate) {
      params.options.push('filter,created_at,less_then_equal,' + dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59');
    }
    props.getData(params);
    props.setCountFilter(checkboxListType.length + (startDate || endDate ? 1 : 0));
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
          <AccordionItemCustome title="Tipe Dokumen">
            <div className="mt-2">
              <Input
                ref={searchInput}
                className={`w-full ${props.className ?? null}`}
                size={props?.size ? props.size : 'sm'}
                placeholder={props?.placeholder ? props?.placeholder : 'Cari tipe dokumen'}
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={onEdit}
              />
            </div>
            <Checkbox.Group className="mt-3 py-3 px-4" vertical value={checkboxListType} onChange={setCheckboxListType}>
              {typeDoc?.slice(0, typeDoc.length > 3 && !showMore ? 3 : typeDoc.length).map((val, idx) => {
                return (
                  <Checkbox key={idx} value={val.value} className={`${idx != typeDoc.length - 1 ? ' mb-5' : ''}`}>
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                      {val.name}
                    </span>
                  </Checkbox>
                );
              })}
              {!showMore && typeDoc.length > 3 ? (
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
          <AccordionItemCustome title="Tanggal">
            <div className="grid grid-cols-12 gap-2 mt-3">
              <div className="col-span-6">
                <p className="text-black text-sm font-normal font-goth leading-[21px] mb-2">Tanggal Awal</p>
                <DatePicker
                  placeholder="Pilih Tanggal"
                  inputFormat="DD MMMM YYYY"
                  className="font-goth"
                  value={startDate || null}
                  onChange={(value) => handleStartDate(value || '')}
                  inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                />
              </div>
              <div className="col-span-6">
                <p className="text-black text-sm font-normal font-goth leading-[21px] mb-2">Tanggal Akhir</p>
                <DatePicker
                  inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                  placeholder="Pilih Tanggal"
                  className="font-goth"
                  inputFormat="DD MMMM YYYY"
                  value={endDate || null}
                  onChange={(value) => handleEndDate(value || '')}
                />
              </div>
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
              setStartDate('');
              setEndDate('');
              setCheckboxListType([]);
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
