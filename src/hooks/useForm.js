import { useState, useCallback } from "react";

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return "";

      for (const rule of rules) {
        if (rule.required && (!value || value.toString().trim() === "")) {
          return rule.message || `${name} é obrigatório`;
        }

        if (rule.minLength && value && value.length < rule.minLength) {
          return (
            rule.message ||
            `${name} deve ter pelo menos ${rule.minLength} caracteres`
          );
        }

        if (rule.maxLength && value && value.length > rule.maxLength) {
          return (
            rule.message ||
            `${name} deve ter no máximo ${rule.maxLength} caracteres`
          );
        }

        if (rule.pattern && value && !rule.pattern.test(value)) {
          return rule.message || `${name} tem formato inválido`;
        }

        if (rule.custom && value) {
          const customError = rule.custom(value, values);
          if (customError) return customError;
        }
      }

      return "";
    },
    [validationRules, values],
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  const handleChange = useCallback(
    (name) => (e) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;

      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors],
  );

  const handleBlur = useCallback(
    (name) => (e) => {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, e.target.value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField],
  );

  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e.preventDefault();

      const allTouched = {};
      Object.keys(validationRules).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, validationRules],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFormValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  const setFormErrors = useCallback((newErrors) => {
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    setFormErrors,
    validateForm,
    validateField,
  };
};

export default useForm;
