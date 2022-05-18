import PropTypes from 'prop-types';

import { Button } from '../ui/button';
import styles from './prompt-form.module.css';

export const PromptForm = (props) => {
  const { submitButtonText, onChange, onSubmit, values, errors, isValid }
    = props;

  return (
    <form name="prompt-form" values={values} onSubmit={onSubmit}>
      <fieldset className={styles.fieldset}>
        <textarea
          className={styles.input}
          id="prompt"
          name="prompt"
          placeholder="start typing here..."
          required
          onChange={onChange}
          value={values['prompt'] ? values['prompt'] : ''}
        />
        <span className={styles.error}>
          {errors['prompt'] && errors['prompt']}
        </span>
        <div className={styles.submitGroup}>
          <Button type="submit" text={submitButtonText} disabled={!isValid}/>
        </div>
      </fieldset>
    </form>
  );
};

PromptForm.propTypes = {
  submitButtonText: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object,
  isValid: PropTypes.bool
};
