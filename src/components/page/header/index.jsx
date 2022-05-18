import PropTypes from 'prop-types';

import styles from './page-header.module.css';

export const PageHeader = ({ children }) => {
  return <header className={styles.root}>{children}</header>;
};

PageHeader.propTypes = {
  children: PropTypes.element.isRequired
};
