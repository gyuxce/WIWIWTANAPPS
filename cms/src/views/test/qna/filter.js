import { Checkbox, DatePicker } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { STATUS_PRA_TEST_QNA } from 'components/ui/utils/constant';

export const Filter = (props) => {
  return (
    <>
      <AccordionCustome>
        <AccordionItemCustome title="Status Pra Test">
          <Checkbox.Group
            className="mt-3 py-3 px-4"
            vertical
            value={props.checkboxListStatus}
            onChange={props.setCheckboxListStatus}
          >
            {STATUS_PRA_TEST_QNA.map((val, idx) => {
              return (
                <Checkbox
                  key={idx}
                  value={val.value}
                  className={`${idx != STATUS_PRA_TEST_QNA.length - 1 ? ' mb-5' : ''}`}
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
      <div className="h-4"></div>
      <AccordionCustome>
        <AccordionItemCustome title="Jadwal QnA Pilihan">
          <div className="grid grid-cols-12 gap-2 mt-3">
            <div className="col-span-6">
              <p className="text-black text-sm font-normal font-goth leading-[21px] mb-2">Tanggal Awal</p>
              <DatePicker
                placeholder="Pilih Tanggal"
                inputFormat="DD MMMM YYYY"
                className="font-goth"
                value={props.startDate || null}
                onChange={(value) => props.handleDateStartDate(value || '')}
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
                value={props.endtDate || null}
                onChange={(value) => props.handleDateEndDate(value || '')}
              />
            </div>
          </div>
        </AccordionItemCustome>
      </AccordionCustome>
    </>
  );
};
