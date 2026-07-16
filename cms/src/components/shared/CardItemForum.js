import React from 'react';
import AdaptableCard from './AdaptableCard';
import { Avatar } from 'components/ui';
import { ChatBubbleSvg, ThumbSvg } from 'assets/svg';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ButtonDelete from 'views/forum/components/ButtonDelete';

dayjs.extend(utc);
dayjs.extend(timezone);

const CardItemForum = (props) => {
  const { data, onLoad } = props;
  const formatDate = (createdAt) => {
    dayjs.locale('id');
    const date = dayjs(createdAt).tz('Asia/Jakarta');

    if (date.isSame(dayjs().subtract(1, 'day'), 'day')) {
      return `kemarin di ${date.format('HH:mm')} WIB`;
    } else {
      return date.format('D MMMM YYYY [di] HH:mm WIB');
    }
  };

  return (
    <AdaptableCard bodyClass="py-3 px-4 text-black relative z-0 flex" className="rounded-xl border-grey-300 mb-4">
      <div onClick={props.onClick} className="flex flex-col w-6/12">
        <div className="flex items-center mb-3">
          <Avatar src={data?.user?.profilePicture?.url} shape="circle" size={34} />
          <p className="text-sub-b ml-2">
            {data?.user?.name} {data?.user?.role?.name ? `[${data?.user?.role?.name}]` : ''}
          </p>
        </div>
        <p className="text-mobile-h3 font-bold">{data?.title}</p>
        <div className="flex mt-3 items-center mb-3">
          <div className="flex items-center">
            <ChatBubbleSvg />
            <p className="text-mobile-sub-b ml-1">{data?.count_comment || 0}</p>
          </div>
          <p className="text-mobile-sub text-grey-500 mx-3">{data?.created_at ? formatDate(data?.created_at) : '-'}</p>
          <div className="bg-grey-100 px-2 py-1 rounded">
            <p className="text-mobile-sub-b">{data?.topic?.name}</p>
          </div>
        </div>
        {data.is_draft == true && (
          <div className="w-[82px]">
            <div className="px-6 py-1 bg-gray-100 rounded-full border border-gray-500 text-gray-500 text-xs font-normal font-goth">
              Draft
            </div>
          </div>
        )}
      </div>
      <div className="flex w-6/12 justify-end">
        <div className="text-center mr-3">
          <ThumbSvg />
          <p className="text-mobile-sub-b mt-1">{data?.count_like || 0}</p>
        </div>
        <ButtonDelete data={data?.id} onLoad={onLoad} />
      </div>
    </AdaptableCard>
  );
};

export default CardItemForum;
