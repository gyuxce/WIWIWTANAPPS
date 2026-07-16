import React from 'react';
import classNames from 'classnames';
import { ScrollBar } from 'components/ui';
import PropTypes from 'prop-types';
import {
  //   SIDE_NAV_WIDTH,
  //   SIDE_NAV_COLLAPSED_WIDTH,
  // NAV_MODE_DARK,
  NAV_MODE_THEMED,
  // NAV_MODE_TRANSPARENT,
  // SIDE_NAV_CONTENT_GUTTER,
  // LOGO_X_GUTTER,
} from 'constants/theme.constant';
// import Logo from 'components/template/Logo';
import navigationConfig from 'configs/navigation.config';
import VerticalMenuContent from 'components/template/VerticalMenuContent';
import { useSelector } from 'react-redux';
import { LogoMenuSvg } from 'assets/svg';

// const sideNavStyle = {
//   width: SIDE_NAV_WIDTH,
//   minWidth: SIDE_NAV_WIDTH,
// };

// const sideNavCollapseStyle = {
//   width: SIDE_NAV_COLLAPSED_WIDTH,
//   minWidth: SIDE_NAV_COLLAPSED_WIDTH,
// };

const SideNav = () => {
  const themeColor = useSelector((state) => state.theme.themeColor);
  const primaryColorLevel = useSelector((state) => state.theme.primaryColorLevel);
  const navMode = useSelector((state) => state.theme.navMode);
  // const mode = useSelector((state) => state.theme.mode);
  const direction = useSelector((state) => state.theme.direction);
  const currentRouteKey = useSelector((state) => state.base.common.currentRouteKey);
  const sideNavCollapse = useSelector((state) => state.theme.layout.sideNavCollapse);
  const userAuthority = useSelector((state) => state.auth.user.authority);

  const sideNavColor = () => {
    if (navMode === NAV_MODE_THEMED) {
      return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`;
    }
    return `side-nav-${navMode}`;
  };

  const menuContent = (
    <VerticalMenuContent
      navMode={navMode}
      collapsed={sideNavCollapse}
      navigationTree={navigationConfig}
      routeKey={currentRouteKey}
      userAuthority={userAuthority}
      direction={direction}
    />
  );

  return (
    <>
      <div
        className={classNames(
          'side-nav bg-transparent border-none',
          sideNavColor(),
          !sideNavCollapse && 'side-nav-expand',
        )}
      >
        {sideNavCollapse ? (
          menuContent
        ) : (
          <div className="overflow-hidden	side-nav-content flex flex-col p-4 gap-[1.5rem] h-full bg-white shadow">
            <div className="mx-auto font-bold">
              <LogoMenuSvg />
            </div>
            {/* <div className="flex-none px-3">
              <div className="text-sm font-bold leading-tight text-white">{dataUser?.user?.name}</div>
              <div className="text-gray-400 text-xs font-normal mb-4">{dataUser?.user?.role?.name}</div>
            </div> */}
            <ScrollBar autoHide direction={direction}>
              {menuContent}
            </ScrollBar>
          </div>
        )}
      </div>
    </>
  );
};

SideNav.propTypes = {
  themed: PropTypes.bool,
  darkMode: PropTypes.bool,
  themeColor: PropTypes.string,
};

SideNav.defaultProps = {
  themed: false,
  darkMode: false,
  themeColor: '',
};

export default SideNav;
