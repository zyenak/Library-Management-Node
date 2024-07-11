import React, { ComponentType, useState } from 'react';
import CustomForm, { CustomFormProps } from '../components/forms/custom-form';

interface WithInputValidationProps {}

interface Errors {
  [key: string]: string;
}

const withInputValidation = <P extends CustomFormProps>(WrappedComponent: ComponentType<P>) => {
  const WithInputValidation: React.FC<P & WithInputValidationProps> = (props) => {
    const { fields, ...rest } = props;
    const initialErrors: Errors = Object.fromEntries(fields.map((field) => [field.name, '']));
    const [errors, setErrors] = useState<Errors>(initialErrors);

    const validateField = (fieldName: string, value: any, required: boolean, type?: string) => {
      if (required && (!value || typeof value !== 'string' || value.trim() === '')) {
        return `* ${fieldName} can't be empty`;
      } else if (type === 'number' && isNaN(Number(value))) {
        return 'Only numbers are allowed';
      }
      return '';
    };


    const validateFormInternal = (formData: any) => {
      const newErrors: Errors = {};
      fields.forEach((field) => {
        const { name, required, type } = field;
        const value = formData[name];
        const error = validateField(field.label, value, required, type);
        newErrors[name] = error;
      });
      setErrors(newErrors);
      return Object.values(newErrors).every((error) => !error);
    };

    return (
      <WrappedComponent
        {...rest as P}
        fields={fields}
        errors={errors}
        validateForm={validateFormInternal} 
      />
    );
  };

  return WithInputValidation;
};

export default withInputValidation;
