import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';

interface IValidationError {
  message: string;
  value: any;
  children: {
    index: string;
    errors?: IError;
  }[];
}

interface IError {
  [key: string]: IValidationError;
}

const buildValidation = (
  validationError: ValidationError
): IValidationError => {
  const { value, constraints } = validationError;
  return {
    message: constraints ? Object.values(constraints).join(' ').trim() : '',
    value,
    children: [],
  };
};

const config: ValidationPipeOptions = {
  validationError: { target: true, value: true },
  whitelist: true,
  transform: true,
  stopAtFirstError: true,
  exceptionFactory(errors) {
    const error: IError = {};

    errors.forEach((validationError) => {
      const { property, children } = validationError;
      const validation = buildValidation(validationError);

      if (children && children.length > 0) {
        children.forEach((child) => {
          const index = child.property;
          const childError: IError = {};
          child.children?.forEach((childValidationError) => {
            const { property } = childValidationError;
            childError[property] = buildValidation(childValidationError);
          });

          validation.children.push({ index, errors: childError });
        });
      }

      error[property] = validation;
    });

    return new BadRequestException({ validationErrors: error });
  },
};

export default config;
