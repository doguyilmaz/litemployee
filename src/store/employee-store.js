const STORAGE_KEY = 'employees';

class EmployeeStore extends EventTarget {
  constructor() {
    super();
    this.employees = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.employees));
    this.dispatchEvent(
      new CustomEvent('employees-changed', {detail: this.employees})
    );
  }

  getAll() {
    return [...this.employees];
  }

  getById(id) {
    return this.employees.find((emp) => emp.id === id);
  }

  add(employee) {
    const newEmployee = {
      ...employee,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.employees.push(newEmployee);
    this.saveToStorage();
    return newEmployee;
  }

  update(id, updates) {
    const index = this.employees.findIndex((emp) => emp.id === id);
    if (index === -1) return null;

    this.employees[index] = {
      ...this.employees[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage();
    return this.employees[index];
  }

  delete(id) {
    const index = this.employees.findIndex((emp) => emp.id === id);
    if (index === -1) return false;

    this.employees.splice(index, 1);
    this.saveToStorage();
    return true;
  }
}

export const employeeStore = new EmployeeStore();
export const DEPARTMENTS = ['Analytics', 'Tech'];
export const POSITIONS = ['Junior', 'Medior', 'Senior'];
