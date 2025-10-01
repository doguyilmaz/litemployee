import {expect} from '@open-wc/testing';
import {employeeStore, DEPARTMENTS, POSITIONS} from './employee-store.js';

describe('EmployeeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    employeeStore.employees = [];
  });

  describe('Constants', () => {
    it('exports DEPARTMENTS', () => {
      expect(DEPARTMENTS).to.deep.equal(['Analytics', 'Tech']);
    });

    it('exports POSITIONS', () => {
      expect(POSITIONS).to.deep.equal(['Junior', 'Medior', 'Senior']);
    });
  });

  describe('getAll', () => {
    it('returns empty array when no employees', () => {
      const result = employeeStore.getAll();
      expect(result).to.be.an('array').that.is.empty;
    });

    it('returns all employees', () => {
      const emp1 = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const emp2 = employeeStore.add({firstName: 'Jane', lastName: 'Smith'});

      const result = employeeStore.getAll();
      expect(result).to.have.lengthOf(2);
      expect(result[0].id).to.equal(emp1.id);
      expect(result[1].id).to.equal(emp2.id);
    });

    it('returns a copy of employees array', () => {
      employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const result = employeeStore.getAll();
      result.push({id: 'fake'});

      expect(employeeStore.getAll()).to.have.lengthOf(1);
    });
  });

  describe('getById', () => {
    it('returns null when employee not found', () => {
      const result = employeeStore.getById('nonexistent');
      expect(result).to.be.undefined;
    });

    it('returns employee by id', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const result = employeeStore.getById(emp.id);

      expect(result).to.exist;
      expect(result.id).to.equal(emp.id);
      expect(result.firstName).to.equal('John');
    });
  });

  describe('add', () => {
    it('adds employee with generated id', () => {
      const emp = employeeStore.add({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      });

      expect(emp.id).to.be.a('string');
      expect(emp.firstName).to.equal('John');
      expect(employeeStore.getAll()).to.have.lengthOf(1);
    });

    it('adds createdAt timestamp', () => {
      const before = new Date().toISOString();
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const after = new Date().toISOString();

      expect(emp.createdAt).to.be.a('string');
      expect(emp.createdAt).to.be.at.least(before);
      expect(emp.createdAt).to.be.at.most(after);
    });

    it('persists to localStorage', () => {
      employeeStore.add({firstName: 'John', lastName: 'Doe'});

      const stored = JSON.parse(localStorage.getItem('employees'));
      expect(stored).to.have.lengthOf(1);
      expect(stored[0].firstName).to.equal('John');
    });

    it('dispatches employees-changed event', (done) => {
      employeeStore.addEventListener('employees-changed', (e) => {
        expect(e.detail).to.be.an('array');
        expect(e.detail).to.have.lengthOf(1);
        done();
      });

      employeeStore.add({firstName: 'John', lastName: 'Doe'});
    });
  });

  describe('update', () => {
    it('returns null when employee not found', () => {
      const result = employeeStore.update('nonexistent', {firstName: 'Jane'});
      expect(result).to.be.null;
    });

    it('updates employee fields', () => {
      const emp = employeeStore.add({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      });

      const updated = employeeStore.update(emp.id, {
        firstName: 'Jane',
        email: 'jane@test.com',
      });

      expect(updated.firstName).to.equal('Jane');
      expect(updated.lastName).to.equal('Doe');
      expect(updated.email).to.equal('jane@test.com');
    });

    it('preserves id on update', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const updated = employeeStore.update(emp.id, {
        id: 'should-not-change',
        firstName: 'Jane',
      });

      expect(updated.id).to.equal(emp.id);
    });

    it('adds updatedAt timestamp', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const before = new Date().toISOString();
      const updated = employeeStore.update(emp.id, {firstName: 'Jane'});
      const after = new Date().toISOString();

      expect(updated.updatedAt).to.be.a('string');
      expect(updated.updatedAt).to.be.at.least(before);
      expect(updated.updatedAt).to.be.at.most(after);
    });

    it('persists to localStorage', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      employeeStore.update(emp.id, {firstName: 'Jane'});

      const stored = JSON.parse(localStorage.getItem('employees'));
      expect(stored[0].firstName).to.equal('Jane');
    });

    it('dispatches employees-changed event', (done) => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});

      employeeStore.addEventListener('employees-changed', (e) => {
        expect(e.detail).to.be.an('array');
        done();
      });

      employeeStore.update(emp.id, {firstName: 'Jane'});
    });
  });

  describe('delete', () => {
    it('returns false when employee not found', () => {
      const result = employeeStore.delete('nonexistent');
      expect(result).to.be.false;
    });

    it('deletes employee by id', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const result = employeeStore.delete(emp.id);

      expect(result).to.be.true;
      expect(employeeStore.getAll()).to.be.empty;
    });

    it('deletes correct employee from multiple', () => {
      const emp1 = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      const emp2 = employeeStore.add({firstName: 'Jane', lastName: 'Smith'});
      const emp3 = employeeStore.add({firstName: 'Bob', lastName: 'Johnson'});

      employeeStore.delete(emp2.id);

      const remaining = employeeStore.getAll();
      expect(remaining).to.have.lengthOf(2);
      expect(remaining[0].id).to.equal(emp1.id);
      expect(remaining[1].id).to.equal(emp3.id);
    });

    it('persists to localStorage', () => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});
      employeeStore.delete(emp.id);

      const stored = JSON.parse(localStorage.getItem('employees'));
      expect(stored).to.be.empty;
    });

    it('dispatches employees-changed event', (done) => {
      const emp = employeeStore.add({firstName: 'John', lastName: 'Doe'});

      employeeStore.addEventListener('employees-changed', () => {
        done();
      });

      employeeStore.delete(emp.id);
    });
  });

  describe('loadFromStorage', () => {
    it('loads employees from localStorage', () => {
      const employees = [
        {id: '1', firstName: 'John', lastName: 'Doe'},
        {id: '2', firstName: 'Jane', lastName: 'Smith'},
      ];
      localStorage.setItem('employees', JSON.stringify(employees));

      const loaded = employeeStore.loadFromStorage();
      expect(loaded).to.have.lengthOf(2);
      expect(loaded[0].firstName).to.equal('John');
    });

    it('returns empty array when localStorage is empty', () => {
      const loaded = employeeStore.loadFromStorage();
      expect(loaded).to.be.an('array').that.is.empty;
    });

    it('returns empty array when localStorage has invalid JSON', () => {
      localStorage.setItem('employees', 'invalid json');
      const loaded = employeeStore.loadFromStorage();
      expect(loaded).to.be.an('array').that.is.empty;
    });
  });
});
