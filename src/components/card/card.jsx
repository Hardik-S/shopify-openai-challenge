import PropTypes from 'prop-types';
import * as React from 'react';
// import { View, Text } from 'react-native';
// import Constants from 'expo-constants';
import { Text } from 'react-native';
// import { Card as card2 } from 'react-native-paper';

import styles from './card.module.css';

export const Card = ({ data }) => {
  return (
    <li className={styles.root}>
      <p className={styles.heading}>Your Prompt: </p>
      <p className={styles.text}>{data.prompt}</p>
      <p className={styles.heading}>My Response: </p>
      <Text style={{ padding: 15, flex: 1, flexWrap: 'wrap' }} numberOfLines={5}>{data.response}</Text>
      {/* <p className={styles.text}>{data.response}</p> */}
    </li>
  );
};

Card.propTypes = {
  data: PropTypes.object
};
