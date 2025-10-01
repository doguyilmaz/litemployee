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
      font-size: 1.75rem;
      color: #333;
    }

    .view-toggle {
      padding: 0.5rem 1rem;
      border: 1px solid #ff6300;
      border-radius: 4px;
      background: white;
      color: #ff6300;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-toggle:hover {
      background: #ff6300;
      color: white;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    thead {
      background: #f8f9fa;
    }

    th {
      text-align: left;
      padding: 1rem;
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
    }

    tr:hover {
      background: #f8f9fa;
    }

    .list-view {
      display: grid;
      gap: 1rem;
    }

    .list-item {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .list-item-header {
      font-weight: 600;
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .list-item-detail {
      color: #6c757d;
      margin: 0.25rem 0;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.375rem 0.75rem;
      border: 1px solid;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit {
      border-color: #007bff;
      background: white;
      color: #007bff;
    }

    .btn-edit:hover {
      background: #007bff;
      color: white;
    }

    .btn-delete {
      border-color: #dc3545;
      background: white;
      color: #dc3545;
    }

    .btn-delete:hover {
      background: #dc3545;
      color: white;
    }

    .empty {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
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
