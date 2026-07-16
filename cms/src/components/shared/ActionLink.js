import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import useThemeClass from 'utils/hooks/useThemeClass';
import { Link } from 'react-router-dom';

const ActionLink = (props) => {
  const { children, className, themeColor = true, to, href = '', onClick, ...rest } = props;

  const { textTheme } = useThemeClass();

  const classNameProps = {
    className: classNames(themeColor && textTheme, 'hover:underline', className),
  };

  return to ? (
    <Link to={to} {...classNameProps} {...rest} onClick={onClick}>
      {children}
    </Link>
  ) : (
    <a href={href} {...classNameProps} {...rest} onClick={onClick}>
      {children}
    </a>
  );
};

ActionLink.propTypes = {
  themeColor: PropTypes.bool,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

ActionLink.defaultProps = {
  themeColor: true,
};

export default ActionLink;
