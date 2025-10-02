import {LitElement, html, css} from 'lit';
import {employeeStore} from '../store/employee-store.js';
import {i18n} from '../i18n/translations.js';
import './confirm-dialog.js';

export class EmployeeList extends LitElement {
  static properties = {
    employees: {type: Array, state: true},
    viewMode: {type: String, state: true},
    selectedIds: {type: Set, state: true},
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

    .view-controls {
      display: flex;
      gap: var(--spacing-sm);
    }

    .view-btn {
      width: 40px;
      height: 40px;
      padding: 0;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      color: var(--color-text-light);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .view-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .view-btn.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-surface);
    }

    .view-btn.active:hover {
      background: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
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

    th.checkbox-col,
    td.checkbox-col {
      width: 40px;
      text-align: center;
      padding: var(--spacing-sm);
    }

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--color-primary);
    }

    td {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--color-border-light);
      color: var(--color-text);
    }

    tr:hover {
      background: var(--color-background);
    }

    .grid-view {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .grid-item {
      background: var(--color-surface);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--color-border-light);
      display: flex;
      flex-direction: column;
    }

    .grid-item-header {
      font-weight: var(--weight-semibold);
      font-size: var(--font-lg);
      margin-bottom: var(--spacing-md);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .grid-item-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--color-primary);
    }

    .grid-item-info {
      flex: 1;
      margin-bottom: var(--spacing-md);
    }

    .grid-item-field {
      color: var(--color-text);
      margin: var(--spacing-sm) 0;
      font-size: var(--font-sm);
      display: flex;
      gap: var(--spacing-xs);
    }

    .grid-item-label {
      font-weight: var(--weight-semibold);
      color: var(--color-text-light);
      min-width: 80px;
    }

    .grid-item-value {
      color: var(--color-text);
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

    @media (max-width: 1024px) {
      .grid-view {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
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

      .view-controls {
        display: none;
      }

      .grid-view {
        grid-template-columns: 1fr;
      }

      .grid-item {
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

      .grid-item-header {
        font-size: 1rem;
      }

      .grid-item-field {
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
    this.selectedIds = new Set();
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

  setViewMode(mode) {
    this.viewMode = mode;
  }

  handleEdit(id) {
    window.location.href = `/edit/${id}`;
  }

  handleDelete(id) {
    const dialog = this.shadowRoot.querySelector('confirm-dialog');
    dialog.open({
      onConfirm: () => {
        employeeStore.delete(id);
      },
    });
  }

  toggleSelectAll(e) {
    if (e.target.checked) {
      this.selectedIds = new Set(this.employees.map((emp) => emp.id));
    } else {
      this.selectedIds = new Set();
    }
  }

  toggleSelect(id, e) {
    const newSelected = new Set(this.selectedIds);
    if (e.target.checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    this.selectedIds = newSelected;
  }

  get isAllSelected() {
    return (
      this.employees.length > 0 &&
      this.employees.every((emp) => this.selectedIds.has(emp.id))
    );
  }

  renderTableView() {
    return html`
      <table>
        <thead>
          <tr>
            <th class="checkbox-col">
              <input
                type="checkbox"
                .checked=${this.isAllSelected}
                @change=${this.toggleSelectAll}
              />
            </th>
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
                <td class="checkbox-col">
                  <input
                    type="checkbox"
                    .checked=${this.selectedIds.has(emp.id)}
                    @change=${(e) => this.toggleSelect(emp.id, e)}
                  />
                </td>
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

  renderGridView() {
    return html`
      <div class="grid-view">
        ${this.employees.map(
          (emp) => html`
            <div class="grid-item">
              <div class="grid-item-header">
                <input
                  type="checkbox"
                  class="grid-item-checkbox"
                  .checked=${this.selectedIds.has(emp.id)}
                  @change=${(e) => this.toggleSelect(emp.id, e)}
                />
                <span>${emp.firstName} ${emp.lastName}</span>
              </div>
              <div class="grid-item-info">
                <div class="grid-item-field">
                  <span class="grid-item-label">Email:</span>
                  <span class="grid-item-value">${emp.email}</span>
                </div>
                <div class="grid-item-field">
                  <span class="grid-item-label">Phone:</span>
                  <span class="grid-item-value">${emp.phone}</span>
                </div>
                <div class="grid-item-field">
                  <span class="grid-item-label">Department:</span>
                  <span class="grid-item-value">${emp.department}</span>
                </div>
                <div class="grid-item-field">
                  <span class="grid-item-label">Position:</span>
                  <span class="grid-item-value">${emp.position}</span>
                </div>
              </div>
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
        <div class="view-controls">
          <button
            class="view-btn ${this.viewMode === 'table' ? 'active' : ''}"
            @click=${() => this.setViewMode('table')}
            title="Table View"
          >
            ☰
          </button>
          <button
            class="view-btn ${this.viewMode === 'grid' ? 'active' : ''}"
            @click=${() => this.setViewMode('grid')}
            title="Grid View"
          >
            ▦
          </button>
        </div>
      </div>

      ${this.employees.length === 0
        ? html`<div class="empty">No employees found</div>`
        : this.viewMode === 'table'
        ? this.renderTableView()
        : this.renderGridView()}

      <confirm-dialog></confirm-dialog>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
