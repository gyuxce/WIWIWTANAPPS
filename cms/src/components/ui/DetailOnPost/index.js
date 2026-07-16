import moment from 'moment';

const DetailOnPost = (props) => {
  const { countLike, countComment, date, topics } = props;

  const parsedDate = (dateTime) => {
    const date = moment(dateTime);

    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');

    let formattedDate = '';

    if (date.isSame(today, 'd')) {
      formattedDate = date.format('[Hari Ini] HH:mm:ss');
    } else if (date.isSame(yesterday, 'd')) {
      formattedDate = date.format('[Kemarin] HH:mm:ss');
    } else {
      formattedDate = date.format('DD-MM-YYYY HH:mm:ss');
    }

    return formattedDate;
  };

  return (
    <div className="w-80 h-6 justify-start items-center gap-3 inline-flex">
      <div className="justify-start items-center gap-1 flex">
        <div className="w-4 h-4 relative">
          <img src="/img/icon/like-button-small.png" alt="trash" className="h-4 w-4" />
        </div>
        <div className="text-black text-xs font-bold font-goth">{countLike || 0}</div>
      </div>
      <div className="justify-start items-center gap-1 flex">
        <div className="w-4 h-4 relative">
          <img src="/img/icon/chat-bubble.png" alt="trash" className="h-4 w-4" />
        </div>
        <div className="text-black text-xs font-bold font-goth">{countComment || 0}</div>
      </div>
      <div className="text-right text-zinc-500 text-xs font-normal font-goth">{parsedDate(date)}</div>
      <div className="px-2 py-1 bg-stone-100 rounded justify-start items-center gap-1 flex">
        <div className="text-black text-xs font-bold font-goth">{topics}</div>
      </div>
    </div>
  );
};

export default DetailOnPost;
