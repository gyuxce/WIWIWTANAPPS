import React from 'react';
import navigationIcon from 'configs/navigation-icon.config';

export const Icon = ({ component: Component }) => {
  return (
    <>
      <Component />
    </>
  );
};

const VerticalMenuIcon = ({ icon, gutter, isActive, isSubMenu, status }) => {
  if (typeof icon !== 'string' && !icon) {
    return <></>;
  }
  if (isSubMenu && status) {
    return (
      <span className={`text-2xl mb-12 ${isActive ? 'z-10' : 'border-l border-black ml-[0.5px]'}`}>
        {navigationIcon[icon]}
      </span>
    );
  }
  return <span className={`text-2xl ${gutter ? 'ltr:mr-3 rtl:ml-2' : 'mb-12'}`}>{navigationIcon[icon]}</span>;
};

VerticalMenuIcon.defaultProps = {
  gutter: true,
  isActive: false,
  isSubMenu: false,
  status: true,
};

export default VerticalMenuIcon;
