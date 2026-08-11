import { useState, useCallback } from 'react';

import { hasNonWhitespaceContent }
  from '../shared/helpers/has-non-whitespace-content';

function useFormWithValidation() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const hasMeaningfulValue = hasNonWhitespaceContent(value);

    setValues({ ...values, [name]: value });
    setErrors({
      ...errors,
      [name]: target.validationMessage
        || (hasMeaningfulValue ? '' : 'Please enter a value.')
    });
    setIsValid(target.closest('form').checkValidity() && hasMeaningfulValue);
  };

  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid]
  );

  return {
    values,
    handleChange,
    errors,
    isValid,
    resetForm
  };
}

export default useFormWithValidation;
