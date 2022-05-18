import styles from './header.module.css';

export const Header = () => {
  return (
    <div className={styles.container}>
      <h5 className={styles.title}>
        Curious{'  '}Curie{'  '}Chat
      </h5>
    </div>
  );
};
