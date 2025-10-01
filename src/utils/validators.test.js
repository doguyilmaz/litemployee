import {assert} from '@open-wc/testing';
import {validators, validateEmployee} from './validators.js';
import {employeeStore} from '../store/employee-store.js';

suite('Validators', () => {
  setup(() => {
    localStorage.clear();
    employeeStore.employees = [];
  });

  suite('required', () => {
    test('returns false for empty string', () => {
      assert.notOk(validators.required(''));
    });

    test('returns false for whitespace only', () => {
      assert.notOk(validators.required('   '));
    });

    test('returns false for null', () => {
      assert.notOk(validators.required(null));
    });

    test('returns false for undefined', () => {
      assert.notOk(validators.required(undefined));
    });

    test('returns true for non-empty string', () => {
      assert.ok(validators.required('test'));
    });
  });

  suite('email', () => {
    test('returns false for invalid email', () => {
      assert.strictEqual(validators.email('invalid'), false);
      assert.strictEqual(validators.email('test@'), false);
      assert.strictEqual(validators.email('@test.com'), false);
      assert.strictEqual(validators.email('test @test.com'), false);
    });

    test('returns true for valid email', () => {
      assert.strictEqual(validators.email('test@example.com'), true);
      assert.strictEqual(validators.email('user.name@domain.co.uk'), true);
    });
  });

  suite('phone', () => {
    test('returns false for too short', () => {
      assert.strictEqual(validators.phone('123'), false);
    });

    test('returns true for valid phone', () => {
      assert.strictEqual(validators.phone('1234567890'), true);
      assert.strictEqual(validators.phone('+1 234 567 8900'), true);
      assert.strictEqual(validators.phone('(123) 456-7890'), true);
    });
  });

  suite('uniqueEmail', () => {
    test('returns true when email is unique', () => {
      employeeStore.add({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      });
      assert.strictEqual(validators.uniqueEmail('jane@test.com'), true);
    });

    test('returns false when email exists', () => {
      employeeStore.add({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      });
      assert.strictEqual(validators.uniqueEmail('john@test.com'), false);
    });

    test('excludes specified employee id', () => {
      const emp = employeeStore.add({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      });
      assert.strictEqual(validators.uniqueEmail('john@test.com', emp.id), true);
    });
  });

  suite('dateNotFuture', () => {
    test('returns false for future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      assert.strictEqual(
        validators.dateNotFuture(futureDate.toISOString()),
        false
      );
    });

    test('returns true for past date', () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      assert.strictEqual(
        validators.dateNotFuture(pastDate.toISOString()),
        true
      );
    });

    test('returns true for today', () => {
      const today = new Date();
      assert.strictEqual(validators.dateNotFuture(today.toISOString()), true);
    });
  });

  suite('minAge', () => {
    test('returns false when under minimum age', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 17);
      assert.strictEqual(validators.minAge(date.toISOString(), 18), false);
    });

    test('returns true when exactly minimum age', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      assert.strictEqual(validators.minAge(date.toISOString(), 18), true);
    });

    test('returns true when over minimum age', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 25);
      assert.strictEqual(validators.minAge(date.toISOString(), 18), true);
    });
  });

  suite('validateEmployee', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior',
    };

    test('returns valid for complete valid data', () => {
      const result = validateEmployee(validData);
      assert.strictEqual(result.isValid, true);
      assert.isEmpty(result.errors);
    });

    test('returns errors for missing firstName', () => {
      const data = {...validData, firstName: ''};
      const result = validateEmployee(data);
      assert.strictEqual(result.isValid, false);
      assert.isDefined(result.errors.firstName);
    });

    test('returns errors for invalid email', () => {
      const data = {...validData, email: 'invalid'};
      const result = validateEmployee(data);
      assert.strictEqual(result.isValid, false);
      assert.isDefined(result.errors.email);
    });

    test('returns errors for duplicate email', () => {
      employeeStore.add(validData);
      const result = validateEmployee(validData);
      assert.strictEqual(result.isValid, false);
      assert.include(result.errors.email, 'already exists');
    });

    test('allows same email when updating same employee', () => {
      const emp = employeeStore.add(validData);
      const result = validateEmployee(validData, emp.id);
      assert.strictEqual(result.isValid, true);
    });

    test('returns errors for invalid phone', () => {
      const data = {...validData, phone: '123'};
      const result = validateEmployee(data);
      assert.strictEqual(result.isValid, false);
      assert.isDefined(result.errors.phone);
    });

    test('returns errors for future date of birth', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = {...validData, dateOfBirth: futureDate.toISOString()};
      const result = validateEmployee(data);
      assert.strictEqual(result.isValid, false);
      assert.isDefined(result.errors.dateOfBirth);
    });

    test('returns errors for underage employee', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 17);
      const data = {...validData, dateOfBirth: date.toISOString()};
      const result = validateEmployee(data);
      assert.strictEqual(result.isValid, false);
      assert.include(result.errors.dateOfBirth, '18 years old');
    });

    test('returns multiple errors for multiple invalid fields', () => {
      const data = {
        firstName: '',
        lastName: '',
        email: 'invalid',
        phone: '123',
        dateOfBirth: '',
        dateOfEmployment: '',
        department: '',
        position: '',
      };
      const result = validateEmployee(data);
      assert.strictEqual(result.isValid, false);
      assert.lengthOf(Object.keys(result.errors), 8);
    });
  });
});
