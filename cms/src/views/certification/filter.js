import { Checkbox } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { OPTION_STATUS_MASTER_DATA } from 'components/ui/utils/constant';

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
            {OPTION_STATUS_MASTER_DATA.map((val, idx) => {
              return (
                <Checkbox
                  key={idx}
                  value={val.value}
                  className={`${idx != OPTION_STATUS_MASTER_DATA.length - 1 ? ' mb-5' : ''}`}
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
    </>
  );
};
