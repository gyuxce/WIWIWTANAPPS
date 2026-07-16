import React from 'react';
import classNames from 'classnames';
// import { HiChevronLeft } from 'react-icons/hi';

const Prev = (props) => {
  const { currentPage, pagerClass, onPrev } = props;

  const disabled = currentPage <= 1;

  const onPrevClick = (e) => {
    if (disabled) {
      return;
    }
    onPrev(e);
  };

  const pagerPrevClass = classNames(
    pagerClass.default,
    // 'pagination-pager-prev',
    // disabled ? pagerClass.disabled : pagerClass.inactive,
    'mr-5'
  );

  return (
    <span className={pagerPrevClass} onClick={onPrevClick}>
      <img src="/img/icon/prev-pagination.svg" alt=""/>
    </span>
  );
};

export default Prev;
