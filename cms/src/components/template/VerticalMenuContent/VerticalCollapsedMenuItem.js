import React from 'react';
import { Menu, Dropdown } from 'components/ui';
import { Link, useLocation } from 'react-router-dom';
import VerticalMenuIcon from './VerticalMenuIcon';
import { Trans } from 'react-i18next';
import { AuthorityCheck } from 'components/shared';

const { MenuItem, MenuCollapse } = Menu;

const DefaultItem = ({ nav, onLinkClick, userAuthority }) => {
  var status = true;
  const location = useLocation();

  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <MenuCollapse
        label={
          <>
            <VerticalMenuIcon icon={nav.icon} />
            <span>
              <Trans i18nKey={nav.translateKey} defaults={nav.title} />
            </span>
          </>
        }
        key={nav.key}
        eventKey={nav.key}
        expanded={false}
        // className="mb-2 text-[.875rem] !font-normal hover:!bg-transparent hover:!text-blue !h-[50px]"
      >
        {nav.subMenu.map((subNav) => {
          return (
            <AuthorityCheck userAuthority={userAuthority} authority={subNav.authority} key={subNav.key}>
              <MenuItem
                eventKey={subNav.key}
                isSubMenu
                className="!h-[37px] text-[.875rem] font-normal hover:!text-blue ml-2"
                style={{ columnGap: 0 }}
              >
                {location.pathname.includes(subNav.path) ? (status = false) : null}

                <VerticalMenuIcon
                  status={status}
                  isSubMenu
                  isActive={location.pathname.includes(subNav.path) ? true : false}
                  gutter={false}
                  // icon={window.location.pathname === subNav.path ? 'curveLineActive' : 'curveLine'}
                />

                {subNav.path ? (
                  <Link
                    className="h-full w-full flex items-center"
                    onClick={() =>
                      onLinkClick?.({
                        key: subNav.key,
                        title: subNav.title,
                        path: subNav.path,
                      })
                    }
                    to={subNav.path}
                  >
                    <li
                      className={
                        location.pathname.includes(subNav.path)
                          ? 'pl-2 after:!border-black after:!border-t-transparent after:!border-r-transparent after:!w-[0.5625rem] z-10 after:!h-screen'
                          : 'pl-4'
                      }
                    >
                      <span
                        className={`!text-main-200 ${
                          location.pathname.includes(subNav.path)
                            ? 'border-[1px] border-black rounded-lg px-4 py-2'
                            : 'p-2'
                        }`}
                      >
                        <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
                      </span>
                    </li>
                  </Link>
                ) : (
                  <span>
                    <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
                  </span>
                )}
              </MenuItem>
            </AuthorityCheck>
          );
        })}
      </MenuCollapse>
    </AuthorityCheck>
  );
};

const CollapsedItem = ({ nav, onLinkClick, userAuthority, direction }) => {
  const menuItem = (
    <MenuItem key={nav.key} eventKey={nav.key} className="mb-2  bg-black ">
      <VerticalMenuIcon icon={nav.icon} />
    </MenuItem>
  );

  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <Dropdown
        trigger="hover"
        renderTitle={menuItem}
        placement={direction === 'rtl' ? 'middle-end-top' : 'middle-start-top'}
      >
        {nav.subMenu.map((subNav) => (
          <AuthorityCheck userAuthority={userAuthority} authority={subNav.authority} key={subNav.key}>
            <Dropdown.Item eventKey={subNav.key}>
              {subNav.path ? (
                <Link
                  className="h-full w-full flex items-center"
                  onClick={() =>
                    onLinkClick?.({
                      key: subNav.key,
                      title: subNav.title,
                      path: subNav.path,
                    })
                  }
                  to={subNav.path}
                >
                  <span>
                    <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
                  </span>
                </Link>
              ) : (
                <span>
                  <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
                </span>
              )}
            </Dropdown.Item>
          </AuthorityCheck>
        ))}
      </Dropdown>
    </AuthorityCheck>
  );
};

const VerticalCollapsedMenuItem = ({ sideCollapsed, ...rest }) => {
  return sideCollapsed ? <CollapsedItem {...rest} /> : <DefaultItem {...rest} />;
};

export default VerticalCollapsedMenuItem;
