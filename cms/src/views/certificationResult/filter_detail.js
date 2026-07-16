import { Checkbox, DatePicker, Input } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { STATUS_CERTIFICATION } from 'components/ui/utils/constant';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

export const Filter = (props) => {
  const typeCertification = props.typeCertification;
  const [typeCert, setTypeCert] = useState(typeCertification);
  const [showMore, setShowMore] = useState(false);
  const searchInput = useRef();
  const debounceFn = debounce(handleDebounceFn, 500);
  function handleDebounceFn(val) {
    const searchResult = typeCertification.filter((certification) =>
      certification.label.toLowerCase().includes(val.toLowerCase()),
    );

    setTypeCert(searchResult);
  }

  const onEdit = (e) => {
    debounceFn(e.target.value);
  };

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
    const newData = [...typeCertification];
    setTypeCert(newData);
  };

  return (
    <>
      <AccordionCustome>
        <AccordionItemCustome title="Tipe Sertifikasi">
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
            value={props.checkboxListType}
            onChange={props.setCheckboxListType}
          >
            {typeCert?.slice(0, typeCert.length > 3 && !showMore ? 3 : typeCert.length).map((val, idx) => {
              return (
                <Checkbox key={idx} value={val.value} className={`${idx != typeCert.length - 1 ? ' mb-5' : ''}`}>
                  <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                    {val.label}
                  </span>
                </Checkbox>
              );
            })}
            {!showMore && typeCert.length > 3 ? (
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
        <AccordionItemCustome title="Status Sertifikasi">
          <Checkbox.Group
            className="mt-3 py-3 px-4"
            vertical
            value={props.checkboxListStatus}
            onChange={props.setCheckboxListStatus}
          >
            {STATUS_CERTIFICATION.map((val, idx) => {
              return (
                <Checkbox
                  key={idx}
                  value={val.value}
                  className={`${idx != STATUS_CERTIFICATION.length - 1 ? ' mb-4' : ''}`}
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
        <AccordionItemCustome title="Tanggal">
          <div className="grid grid-cols-12 gap-2 mt-3">
            <div className="col-span-6">
              <p className="text-black text-sm font-normal font-goth leading-[21px] mb-2">Tanggal Awal</p>
              <DatePicker
                placeholder="Pilih Tanggal"
                value={props.startDate}
                onChange={props.handleDateStartDate}
                inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
              />
            </div>
            <div className="col-span-6">
              <p className="text-black text-sm font-normal font-goth leading-[21px] mb-2">Tanggal Akhir</p>
              <DatePicker
                minDate={props.startDate}
                inputSuffix={<img src="/img/icon/calendar.svg" className="h-5 w-5" alt="" />}
                placeholder="Pilih Tanggal"
                value={props.endDate}
                onChange={props.handleDateEndDate}
              />
            </div>
          </div>
        </AccordionItemCustome>
      </AccordionCustome>
    </>
  );
};
