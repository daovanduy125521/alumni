import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateLessThanTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();

    // Reset time part of current date to compare only date part
    today.setHours(0, 0, 0, 0);

    if (control.value && inputDate >= today) {
      return { dateLessThanToday: true };
    }
    return null;
  };
}
