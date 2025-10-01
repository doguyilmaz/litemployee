import {assert} from '@open-wc/testing';
import {employeeStore, DEPARTMENTS, POSITIONS} from './employee-store.js';

suite('EmployeeStore', () => {
  setup(() => {
    localStorage.clear();
    employeeStore.employees = [];
  });

  suite('Constants', () => {
    test('exports DEPARTMENTS', () => {
      assert.deepEqual(DEPARTMENTS, ['Analytics', 'Tech']);
    });

    test('exports POSITIONS', () => {
      assert.deepEqual(POSITIONS, ['Junior', 'Medior', 'Senior']);
    });
  });

  suite('getAll', () => {
    test('returns empty array when no employees', () => {
      const result = employeeStore.getAll();
      assert.isArray(result);
      assert.isEmpty(result);
    });

    test('returns all employees', () => {
      const emp1 = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const emp2 = employeeStore.add({firstName: 'Jane', lastName: 'Smith'});

      const result = employeeStore.getAll();
      assert.lengthOf(result, 2);
      assert.equal(result[0].id, emp1.id);
      assert.equal(result[1].id, emp2.id);
    });

    test('returns a copy of employees array', () => {
      employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const result = employeeStore.getAll();
      result.push({id: 'fake'});

      assert.lengthOf(employeeStore.getAll(), 1);
    });
  });

  suite('getById', () => {
    test('returns null when employee not found', () => {
      const result = employeeStore.getById('nonexistent');
      assert.isUndefined(result);
    });

    test('returns employee by id', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const result = employeeStore.getById(emp.id);

      assert.isDefined(result);
      assert.equal(result.id, emp.id);
      assert.equal(result.firstName, 'John');
    });
  });

  suite('add', () => {
    test('adds employee with generated id', () => {
      const emp = employeeStore.add({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      });

      assert.isString(emp.id);
      assert.equal(emp.firstName, 'John');
      assert.lengthOf(employeeStore.getAll(), 1);
    });

    test('adds createdAt timestamp', () => {
      const before = Date.now();
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const after = Date.now();

      assert.isString(emp.createdAt);
      const createdAtTime = new Date(emp.createdAt).getTime();
      assert.isAtLeast(createdAtTime, before);
      assert.isAtMost(createdAtTime, after);
    });

    test('persists to localStorage', () => {
      employeeStore.add({firstName: 'John', lastName: 'Doe'});

      const stored = JSON.parse(localStorage.getItem('employees'));
      assert.lengthOf(stored, 1);
      assert.equal(stored[0].firstName, 'John');
    });

    test('dispatches employees-changed event', (done) => {
      const handler = (e) => {
        assert.isArray(e.detail);
        assert.lengthOf(e.detail, 1);
        employeeStore.removeEventListener('employees-changed', handler);
        done();
      };

      employeeStore.addEventListener('employees-changed', handler);
      employeeStore.add({firstName: 'John', lastName: 'Doe'});
    });
  });

  suite('update', () => {
    test('returns null when employee not found', () => {
      const result = employeeStore.update('nonexistent', {firstName: 'Jane'});
      assert.isNull(result);
    });

    test('updates employee fields', () => {
      const emp = employeeStore.add({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      });

      const updated = employeeStore.update(emp.id, {
        firstName: 'Jane',
        email: 'jane@test.com',
      });

      assert.equal(updated.firstName, 'Jane');
      assert.equal(updated.lastName, 'Doe');
      assert.equal(updated.email, 'jane@test.com');
    });

    test('preserves id on update', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const updated = employeeStore.update(emp.id, {
        id: 'should-not-change',
        firstName: 'Jane',
      });

      assert.equal(updated.id, emp.id);
    });

    test('adds updatedAt timestamp', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const before = Date.now();
      const updated = employeeStore.update(emp.id, {firstName: 'Jane'});
      const after = Date.now();

      assert.isString(updated.updatedAt);
      const updatedAtTime = new Date(updated.updatedAt).getTime();
      assert.isAtLeast(updatedAtTime, before);
      assert.isAtMost(updatedAtTime, after);
    });

    test('persists to localStorage', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      employeeStore.update(emp.id, {firstName: 'Jane'});

      const stored = JSON.parse(localStorage.getItem('employees'));
      assert.equal(stored[0].firstName, 'Jane');
    });

    test('dispatches employees-changed event', (done) => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});

      const handler = (e) => {
        assert.isArray(e.detail);
        employeeStore.removeEventListener('employees-changed', handler);
        done();
      };

      employeeStore.addEventListener('employees-changed', handler);
      employeeStore.update(emp.id, {firstName: 'Jane'});
    });
  });

  suite('delete', () => {
    test('returns false when employee not found', () => {
      const result = employeeStore.delete('nonexistent');
      assert.isFalse(result);
    });

    test('deletes employee by id', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const result = employeeStore.delete(emp.id);

      assert.isTrue(result);
      assert.isEmpty(employeeStore.getAll());
    });

    test('deletes correct employee from multiple', () => {
      const emp1 = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const emp2 = employeeStore.add({firstName: 'Jane', lastName: 'Smith'});
      const emp3 = employeeStore.add({firstName: 'Bob', lastName: 'Johnson'});

      employeeStore.delete(emp2.id);

      const remaining = employeeStore.getAll();
      assert.lengthOf(remaining, 2);
      assert.equal(remaining[0].id, emp1.id);
      assert.equal(remaining[1].id, emp3.id);
    });

    test('persists to localStorage', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      employeeStore.delete(emp.id);

      const stored = JSON.parse(localStorage.getItem('employees'));
      assert.isEmpty(stored);
    });

    test('dispatches employees-changed event', (done) => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});

      const handler = () => {
        employeeStore.removeEventListener('employees-changed', handler);
        done();
      };

      employeeStore.addEventListener('employees-changed', handler);
      employeeStore.delete(emp.id);
    });
  });

  suite('loadFromStorage', () => {
    test('loads employees from localStorage', () => {
      const employees = [
        {id: '1', firstName: 'John', lastName: 'Doe'},
        {id: '2', firstName: 'Jane', lastName: 'Smith'},
      ];
      localStorage.setItem('employees', JSON.stringify(employees));

      const loaded = employeeStore.loadFromStorage();
      assert.lengthOf(loaded, 2);
      assert.equal(loaded[0].firstName, 'John');
    });

    test('returns empty array when localStorage is empty', () => {
      const loaded = employeeStore.loadFromStorage();
      assert.isArray(loaded);
      assert.isEmpty(loaded);
    });

    test('returns empty array when localStorage has invalid JSON', () => {
      localStorage.setItem('employees', 'invalid json');
      const loaded = employeeStore.loadFromStorage();
      assert.isArray(loaded);
      assert.isEmpty(loaded);
    });
  });
});
