import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null; // Form not initialized completely
  }

  const isMatching = password.value === confirmPassword.value;
  return isMatching ? null : { notMatching: true };
};
