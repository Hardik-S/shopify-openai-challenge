import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './button.module.css';

const cn = classNames.bind(styles);

export const Button = (props) => {
  const {
    text,
    type = 'button',
    size = 'l',
    view = 'primary',
    disabled,
    ...restButtonProps
  } = props;

  const classes = cn('button', size, view);

  return (
    <button
      className={classes}
      type={type}
      disabled={disabled}
      {...restButtonProps}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.string,
  view: PropTypes.string,
  disabled: PropTypes.bool
};
