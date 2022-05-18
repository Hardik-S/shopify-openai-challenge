import PropTypes from 'prop-types';

import styles from './close-button.module.css';

export const CloseButton = (props) => {
  const { ariaLabel, onClose } = props;

  return (
    <button
      className={styles.closeButton}
      type="button"
      aria-label={ariaLabel}
      onClick={onClose}
    />
  );
};

CloseButton.propTypes = {
  ariaLabel: PropTypes.string,
  onClose: PropTypes.func
};
