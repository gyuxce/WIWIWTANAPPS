import { AdaptableCard } from 'components/shared';
import { Button } from 'components/ui';
import React, { useState, useEffect } from 'react';
import { openNotification } from 'components/custom/NotificationComponent';
import { apiIndex } from './api';
import { useNavigate } from 'react-router-dom';

const Page = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const getDataContent = async () => {
    try {
      const response = await apiIndex();
      setData(response.data.data);
    } catch (error) {
      openNotification('Error fetching data:', 'danger', error);
    }
  };

  useEffect(() => {
    getDataContent();
  }, []);

  return (
    <AdaptableCard className="rounded-2xl border-none">
      <div className="text-black text-xl font-normal font-opificio mb-5 flex justify-between items-center">
        <span>Konten Pembayaran</span>
      </div>

      <div>
        {data.map((dataItem, index) => (
          <div key={index} className="px-6 py-4 rounded-xl border border-stone-300 mb-5">
            <div className="relative mb-6">
              <div className="w-[930px] text-slate-600 text-sm font-normal font-goth leading-[21px]">Ketentuan</div>
              <div className="text-blue-950 text-xl font-normal font-opificio">{dataItem?.title}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate(`/student/payment/content/edit/${dataItem.id}`)}
                  type="button"
                  size="custome"
                  className="p-0"
                >
                  <div className="text-center space-x-2 text-black flex items-center text-sm font-normal font-goth leading-[21px]">
                    <img src="/img/icon/pencil.svg" alt="" />
                    <span className="text-center text-black text-sm font-normal font-goth leading-[21px] mt-1.5">
                      Edit Konten
                    </span>
                  </div>
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-blue-950 px-4 py-1 bg-gray-50 rounded-xl border border-stone-200 flex items-center space-x-2">
                  <div className="text-sm font-normal font-goth leading-[21px] mt-1">Total Konten</div>
                  <div className="text-xl font-normal font-'Opificio Neue'">{dataItem?.total_content}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdaptableCard>
  );
};

export default Page;
