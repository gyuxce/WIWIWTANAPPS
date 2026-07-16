import { useState } from 'react';
import { Button, DatePicker } from 'components/ui';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import SideBar from 'components/template/SideFilter';
import dayjs from 'dayjs';

export const Filter = (props) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
    params.options = [];
    if (startDate) {
      params.options.push(
        'filter,started_at,greater_than_equal,' + dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00',
      );
    }
    if (endDate) {
      params.options.push('filter,finished_at,less_then_equal,' + dayjs(endDate).format('YYYY-MM-DD') + ' 23:59:59');
    }
    props.getData(params);
    props.setCountFilter(startDate || endDate ? 1 : 0);
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
