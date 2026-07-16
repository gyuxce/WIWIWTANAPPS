import { Checkbox, DatePicker } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { STATUS_CERTIFICATION } from 'components/ui/utils/constant';

export const Filter = (props) => {
  return (
    <>
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
