import PropTypes from 'prop-types';

import { SectionTitle } from '../section-title';
import { PromptForm } from '../prompt-form';
import styles from './prompt-section.module.css';

import useFormWithValidation from '../../hooks/useFormWithValidation';

export const PromptSection = (props) => {
  const { submitButtonText, onPrompt } = props;

  const { values, errors, isValid, handleChange, resetForm }
    = useFormWithValidation({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const submission = onPrompt(values);

    // Keep failed prompts available for correction or retry.
    Promise.resolve(submission)
      .then(() => resetForm())
      .catch(() => {});
  };

  return (
    <section className={styles.root}>
      <SectionTitle text="Hey human, please tell me what's on your mind!"/>
      <PromptForm
        submitButtonText={submitButtonText}
        onChange={handleChange}
        onSubmit={handleSubmit}
        values={values}
        errors={errors}
        isValid={isValid}
      />
    </section>
  );
};

PromptSection.propTypes = {
  submitButtonText: PropTypes.string,
  onPrompt: PropTypes.func
};
