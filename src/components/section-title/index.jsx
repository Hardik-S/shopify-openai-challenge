import PropTypes from 'prop-types';

import styles from './section-title.module.css';

export const SectionTitle = ({ text }) => {
  return <h2 className={styles.root}>{text}</h2>;
};

SectionTitle.propTypes = {
  text: PropTypes.string.isRequired
};
