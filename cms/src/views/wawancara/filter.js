import { useState } from 'react';
import { Button, Checkbox } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import SideBar from 'components/template/SideFilter';
import { STATUS_WAWANCARA } from 'components/ui/utils/constant';

export const Filter = (props) => {
  const [checkboxListProgram, setCheckboxListProgram] = useState([]);
  const [checkboxListStatus, setCheckboxListStatus] = useState([]);

  const submitFilter = async () => {
    let params = { ...props.localState.params };
    params.options = [];
    if (checkboxListProgram.length > 0) {
      params.options.push('filter,training_program,in,' + checkboxListProgram.join('|'));
    }
    if (checkboxListStatus.length > 0) {
      params.options.push('filter,interview_status,in,' + checkboxListStatus.join('|'));
    }
    props.getData(params);
    props.setCountFilter(checkboxListProgram.length + checkboxListStatus.length);
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
          <AccordionItemCustome title="Program Pelatihan">
            <Checkbox.Group
              className="mt-3 py-3 px-4"
              vertical
              value={checkboxListProgram}
              onChange={setCheckboxListProgram}
            >
              {props.program.map((val, idx) => {
                return (
                  <Checkbox
                    key={`program-${idx}`}
                    value={val.value}
                    className={`${idx != props.program.length - 1 ? ' mb-5' : ''}`}
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
          <AccordionItemCustome title="Status Penilaian">
            <Checkbox.Group
              className="mt-3 py-3 px-4"
              vertical
              value={checkboxListStatus}
              onChange={setCheckboxListStatus}
            >
              {STATUS_WAWANCARA.map((val, idx) => {
                return (
                  <Checkbox
                    key={`status-${idx}`}
                    value={val.value}
                    className={`${idx != STATUS_WAWANCARA.length - 1 ? ' mb-5' : ''}`}
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
      </div>
      <div className="">
        <div className="flex items-center justify-center border-t border-stone-200 space-x-3 pt-6 pb-8">
          <Button
            variant="default"
            className="!py-0 w-[200px] h-10 "
            icon={<img src="/img/icon/refresh-icon.svg" alt="" style={{ height: '24px', width: '24px' }} />}
            onClick={() => {
              setCheckboxListProgram([]);
              setCheckboxListStatus([]);
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
