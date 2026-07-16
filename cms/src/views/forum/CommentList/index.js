import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import CommentCard from 'components/shared/CommentCard';
import { useState } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

const CommentList = (props) => {
  const { data, onCommentAdded } = props;
  const [shownReplies, setShownReplies] = useState(0);
  const remainingReplies = data?.total_child - shownReplies;

  const handleShowMoreReplies = () => {
    setShownReplies((prevShownReplies) => Math.min(prevShownReplies + 3, data?.total_child));
  };

  return (
    <div>
      <CommentCard data={data} onCommentAdded={onCommentAdded}></CommentCard>
      <div className="ml-11">
        {data?.child?.slice(0, shownReplies).map((childData, index) => {
          return (
            <CommentCard
              key={index}
              parentId={data.id}
              data={childData}
              parentData={data}
              onCommentAdded={onCommentAdded}
            />
          );
        })}
        {remainingReplies > 0 && (
          <div className="flex items-center space-x-2 mt-6">
            <div style={{ width: '20px' }} className="border-t border-black"></div>
            <button
              className="text-sm font-semibold text-black focus:outline-none mt-1"
              onClick={handleShowMoreReplies}
            >
              Lihat {remainingReplies} Balasan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
