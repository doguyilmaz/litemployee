import {LitElement, html, css} from 'lit';
import {employeeStore} from '../store/employee-store.js';
import {i18n} from '../i18n/translations.js';

export class EmployeeList extends LitElement {
  static properties = {
    employees: {type: Array, state: true},
    viewMode: {type: String, state: true},
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    h1 {
      margin: 0;
      font-size: var(--font-xxxl);
      color: var(--color-primary);
      font-weight: var(--weight-semibold);
    }

    .view-toggle {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--color-primary);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-primary);
      font-weight: var(--weight-medium);
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-toggle:hover {
      background: var(--color-primary);
      color: var(--color-surface);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--color-surface);
      box-shadow: var(--shadow-base);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    thead {
      background: var(--color-primary-light);
    }

    th {
      text-align: left;
      padding: var(--spacing-md);
      font-weight: var(--weight-semibold);
      color: var(--color-primary);
      border-bottom: 2px solid var(--color-border-light);
    }

    td {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--color-border-light);
      color: var(--color-text);
    }

    tr:hover {
      background: var(--color-background);
    }

    .list-view {
      display: grid;
      gap: 1rem;
    }

    .list-item {
      background: var(--color-surface);
      padding: var(--spacing-lg);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-base);
    }

    .list-item-header {
      font-weight: var(--weight-semibold);
      font-size: var(--font-lg);
      margin-bottom: var(--spacing-sm);
      color: var(--color-text);
    }

    .list-item-detail {
      color: var(--color-text-light);
      margin: var(--spacing-xs) 0;
      font-size: var(--font-sm);
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid;
      border-radius: var(--radius-sm);
      font-size: var(--font-sm);
      font-weight: var(--weight-medium);
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit {
      border-color: var(--color-primary);
      background: var(--color-surface);
      color: var(--color-primary);
    }

    .btn-edit:hover {
      background: var(--color-primary);
      color: var(--color-surface);
    }

    .btn-delete {
      border-color: var(--color-danger);
      background: var(--color-surface);
      color: var(--color-danger);
    }

    .btn-delete:hover {
      background: var(--color-danger);
      color: var(--color-surface);
    }

    .empty {
      text-align: center;
      padding: var(--spacing-xxl);
      color: var(--color-text-light);
      font-size: var(--font-lg);
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      table {
        display: none;
      }

      .view-toggle {
        display: none;
      }

      .list-item {
        padding: 1rem;
      }

      .actions {
        flex-wrap: wrap;
      }

      .btn {
        flex: 1;
        min-width: 100px;
      }
    }

    @media (max-width: 480px) {
      :host {
        padding: 0.75rem;
      }

      h1 {
        font-size: 1.25rem;
      }

      .list-item-header {
        font-size: 1rem;
      }

      .list-item-detail {
        font-size: 0.875rem;
      }

      .btn {
        padding: 0.5rem;
        font-size: 0.8125rem;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.viewMode = 'table';
    this.loadEmployees();
    this.boundHandleChange = this.handleEmployeesChange.bind(this);
    this.boundHandleLangChange = this.handleLanguageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    employeeStore.addEventListener('employees-changed', this.boundHandleChange);
    window.addEventListener('language-changed', this.boundHandleLangChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    employeeStore.removeEventListener(
      'employees-changed',
      this.boundHandleChange
    );
    window.removeEventListener('language-changed', this.boundHandleLangChange);
  }

  handleLanguageChange() {
    this.requestUpdate();
  }

  loadEmployees() {
    this.employees = employeeStore.getAll();
  }

  handleEmployeesChange() {
    this.loadEmployees();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'list' : 'table';
  }

  handleEdit(id) {
    window.location.href = `/edit/${id}`;
  }

  handleDelete(id) {
    if (confirm(i18n.t('confirmDelete'))) {
      employeeStore.delete(id);
    }
  }

  renderTableView() {
    return html`
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(
            (emp) => html`
              <tr>
                <td>${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>
                  <div class="actions">
                    <button
                      class="btn btn-edit"
                      @click=${() => this.handleEdit(emp.id)}
                    >
                      ${i18n.t('edit')}
                    </button>
                    <button
                      class="btn btn-delete"
                      @click=${() => this.handleDelete(emp.id)}
                    >
                      ${i18n.t('delete')}
                    </button>
                  </div>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  renderListView() {
    return html`
      <div class="list-view">
        ${this.employees.map(
          (emp) => html`
            <div class="list-item">
              <div class="list-item-header">
                ${emp.firstName} ${emp.lastName}
              </div>
              <div class="list-item-detail">${emp.email}</div>
              <div class="list-item-detail">
                ${emp.department} - ${emp.position}
              </div>
              <div class="actions" style="margin-top: 1rem;">
                <button
                  class="btn btn-edit"
                  @click=${() => this.handleEdit(emp.id)}
                >
                  ${i18n.t('edit')}
                </button>
                <button
                  class="btn btn-delete"
                  @click=${() => this.handleDelete(emp.id)}
                >
                  ${i18n.t('delete')}
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class="header">
        <h1>${i18n.t('employeeList')}</h1>
        <button class="view-toggle" @click=${this.toggleView}>
          ${this.viewMode === 'table' ? 'List View' : 'Table View'}
        </button>
      </div>

      ${this.employees.length === 0
        ? html`<div class="empty">No employees found</div>`
        : this.viewMode === 'table'
        ? this.renderTableView()
        : this.renderListView()}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
