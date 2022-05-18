import PropTypes from 'prop-types';

import styles from './page-content.module.css';

export const PageContent = ({ children }) => {
  return <main className={styles.root}>{children}</main>;
};

PageContent.propTypes = {
  children: PropTypes.array
};
