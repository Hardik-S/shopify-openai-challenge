import PropTypes from 'prop-types';

import { PageHeader } from './header';
import { PageContent } from './content';
import { PageFooter } from './footer';
import styles from './page.module.css';

export const Page = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};

Page.propTypes = {
  children: PropTypes.array
};

Page.Header = PageHeader;
Page.Content = PageContent;
Page.Footer = PageFooter;
