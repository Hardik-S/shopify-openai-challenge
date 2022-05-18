import PropTypes from 'prop-types';

import styles from './page-footer.module.css';

export const PageFooter = ({ children }) => {
  return <footer className={styles.root}>{children}</footer>;
};

PageFooter.propTypes = {
  children: PropTypes.element.isRequired
};
