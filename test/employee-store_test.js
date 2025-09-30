import {
  employeeStore,
  DEPARTMENTS,
  POSITIONS,
} from '../src/store/employee-store.js';
import {assert} from '@open-wc/testing';

suite('employee-store', () => {
  let originalEmployees;

  setup(() => {
    originalEmployees = employeeStore.employees;
    employeeStore.employees = [];
    localStorage.removeItem('employees');
  });

  teardown(() => {
    employeeStore.employees = originalEmployees;
    localStorage.setItem('employees', JSON.stringify(originalEmployees));
  });

  test('exports departments and positions', () => {
    assert.deepEqual(DEPARTMENTS, ['Analytics', 'Tech']);
    assert.deepEqual(POSITIONS, ['Junior', 'Medior', 'Senior']);
  });

  test('getAll returns empty array initially', () => {
    const all = employeeStore.getAll();
    assert.isArray(all);
    assert.lengthOf(all, 0);
  });

  test('add creates employee with id and createdAt', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    const added = employeeStore.add(employee);

    assert.isDefined(added.id);
    assert.isDefined(added.createdAt);
    assert.equal(added.firstName, 'John');
    assert.equal(added.lastName, 'Doe');
    assert.equal(added.email, 'john@example.com');
  });

  test('getAll returns copy of employees', () => {
    employeeStore.add({firstName: 'John', lastName: 'Doe'});
    const all = employeeStore.getAll();
    all.push({firstName: 'Jane', lastName: 'Doe'});
    assert.lengthOf(employeeStore.getAll(), 1);
  });

  test('getById returns employee by id', () => {
    const added = employeeStore.add({firstName: 'John', lastName: 'Doe'});
    const found = employeeStore.getById(added.id);
    assert.equal(found.id, added.id);
    assert.equal(found.firstName, 'John');
  });

  test('getById returns undefined for non-existent id', () => {
    const found = employeeStore.getById('non-existent');
    assert.isUndefined(found);
  });

  test('update modifies employee and adds updatedAt', () => {
    const added = employeeStore.add({firstName: 'John', lastName: 'Doe'});
    const updated = employeeStore.update(added.id, {firstName: 'Jane'});

    assert.equal(updated.firstName, 'Jane');
    assert.equal(updated.lastName, 'Doe');
    assert.isDefined(updated.updatedAt);
    assert.equal(updated.id, added.id);
  });

  test('update returns null for non-existent id', () => {
    const result = employeeStore.update('non-existent', {firstName: 'Jane'});
    assert.isNull(result);
  });

  test('delete removes employee', () => {
    const added = employeeStore.add({firstName: 'John', lastName: 'Doe'});
    const result = employeeStore.delete(added.id);

    assert.isTrue(result);
    assert.lengthOf(employeeStore.getAll(), 0);
  });

  test('delete returns false for non-existent id', () => {
    const result = employeeStore.delete('non-existent');
    assert.isFalse(result);
  });

  test('dispatches event on add', (done) => {
    const handler = (e) => {
      assert.isArray(e.detail);
      assert.lengthOf(e.detail, 1);
      employeeStore.removeEventListener('employees-changed', handler);
      done();
    };

    employeeStore.addEventListener('employees-changed', handler);
    employeeStore.add({firstName: 'John', lastName: 'Doe'});
  });

  test('dispatches event on update', (done) => {
    const added = employeeStore.add({firstName: 'John', lastName: 'Doe'});

    const handler = (e) => {
      const updated = e.detail.find((emp) => emp.id === added.id);
      assert.equal(updated.firstName, 'Jane');
      employeeStore.removeEventListener('employees-changed', handler);
      done();
    };

    employeeStore.addEventListener('employees-changed', handler);
    employeeStore.update(added.id, {firstName: 'Jane'});
  });

  test('dispatches event on delete', (done) => {
    const added = employeeStore.add({firstName: 'John', lastName: 'Doe'});

    const handler = (e) => {
      assert.lengthOf(e.detail, 0);
      employeeStore.removeEventListener('employees-changed', handler);
      done();
    };

    employeeStore.addEventListener('employees-changed', handler);
    employeeStore.delete(added.id);
  });

  test('persists to localStorage on add', () => {
    employeeStore.add({firstName: 'John', lastName: 'Doe'});
    const stored = JSON.parse(localStorage.getItem('employees'));
    assert.lengthOf(stored, 1);
    assert.equal(stored[0].firstName, 'John');
  });

  test('loads from localStorage on init', () => {
    const testData = [{id: '1', firstName: 'John', lastName: 'Doe'}];
    localStorage.setItem('employees', JSON.stringify(testData));

    const loaded = employeeStore.loadFromStorage();
    assert.lengthOf(loaded, 1);
    assert.equal(loaded[0].firstName, 'John');
  });
});
