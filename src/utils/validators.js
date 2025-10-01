import {employeeStore} from '../store/employee-store.js';

export const validators = {
  required(value) {
    return value && value.trim().length > 0;
  },

  email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone(value) {
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    return phoneRegex.test(value);
  },

  uniqueEmail(value, excludeId = null) {
    const employees = employeeStore.getAll();
    return !employees.some(
      (emp) => emp.email === value && emp.id !== excludeId
    );
  },

  dateNotFuture(value) {
    const date = new Date(value);
    const now = new Date();
    return date <= now;
  },

  minAge(dateOfBirth, minYears = 18) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= minYears;
    }

    return age >= minYears;
  },
};

export function validateEmployee(data, employeeId = null) {
  const errors = {};

  if (!validators.required(data.firstName)) {
    errors.firstName = 'First name is required';
  }

  if (!validators.required(data.lastName)) {
    errors.lastName = 'Last name is required';
  }

  if (!validators.required(data.email)) {
    errors.email = 'Email is required';
  } else if (!validators.email(data.email)) {
    errors.email = 'Invalid email format';
  } else if (!validators.uniqueEmail(data.email, employeeId)) {
    errors.email = 'Email already exists';
  }

  if (!validators.required(data.phone)) {
    errors.phone = 'Phone is required';
  } else if (!validators.phone(data.phone)) {
    errors.phone = 'Invalid phone format';
  }

  if (!validators.required(data.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth is required';
  } else if (!validators.dateNotFuture(data.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth cannot be in the future';
  } else if (!validators.minAge(data.dateOfBirth, 18)) {
    errors.dateOfBirth = 'Employee must be at least 18 years old';
  }

  if (!validators.required(data.dateOfEmployment)) {
    errors.dateOfEmployment = 'Date of employment is required';
  }

  if (!validators.required(data.department)) {
    errors.department = 'Department is required';
  }

  if (!validators.required(data.position)) {
    errors.position = 'Position is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
