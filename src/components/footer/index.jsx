import styles from './footer.module.css';

export const Footer = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>
        designed and built by {''}
        <a
          className={styles.link}
          href="https://hardik-s.github.io/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Hardik Shrestha
        </a>
      </p>
    </div>
  );
};
