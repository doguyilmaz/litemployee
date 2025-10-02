import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import {employeeStore} from '../store/employee-store.js';
import {i18n} from '../i18n/translations.js';
import {tableIcon, gridIcon} from '../utils/icons.js';
import {formatDate} from '../utils/date-formatter.js';
import './confirm-dialog.js';
import './pagination-controls.js';

export class EmployeeList extends LitElement {
  static properties = {
    _employees: {type: Array, state: true},
    _viewMode: {type: String, state: true},
    _selectedIds: {type: Array, state: true},
    _currentPage: {type: Number, state: true},
    _itemsPerPage: {type: Number, state: true},
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
      width: 44px;
      height: 44px;
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
      position: relative;
    }

    .view-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
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
    this._employees = [];
    this._viewMode = 'table';
    this._selectedIds = [];
    this._currentPage = 1;
    this._itemsPerPage = 10;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadEmployees();
    this._boundHandleChange = this._handleEmployeesChange.bind(this);
    this._boundHandleLangChange = this._handleLanguageChange.bind(this);
    employeeStore.addEventListener(
      'employees-changed',
      this._boundHandleChange
    );
    window.addEventListener('language-changed', this._boundHandleLangChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    employeeStore.removeEventListener(
      'employees-changed',
      this._boundHandleChange
    );
    window.removeEventListener('language-changed', this._boundHandleLangChange);
  }

  _handleLanguageChange() {
    this.requestUpdate();
  }

  _loadEmployees() {
    this._employees = employeeStore.getAll();
  }

  _handleEmployeesChange() {
    this._loadEmployees();
  }

  _setViewMode(mode) {
    this._viewMode = mode;
  }

  _handleEdit(id) {
    Router.go(`/edit/${id}`);
  }

  _handleDelete(id) {
    const dialog = this.shadowRoot.querySelector('confirm-dialog');
    dialog.open({
      onConfirm: () => {
        employeeStore.delete(id);
      },
    });
  }

  _toggleSelectAll(e) {
    const paginatedEmployees = this._getPaginatedEmployees();
    if (e.target.checked) {
      const paginatedIds = paginatedEmployees.map((emp) => emp.id);
      const newSelected = [...this._selectedIds];
      paginatedIds.forEach((id) => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      this._selectedIds = newSelected;
    } else {
      const paginatedIds = paginatedEmployees.map((emp) => emp.id);
      this._selectedIds = this._selectedIds.filter(
        (id) => !paginatedIds.includes(id)
      );
    }
  }

  _toggleSelect(id, e) {
    const newSelected = [...this._selectedIds];
    if (e.target.checked) {
      if (!newSelected.includes(id)) {
        this._selectedIds = [...newSelected, id];
      }
    } else {
      this._selectedIds = newSelected.filter((selectedId) => selectedId !== id);
    }
  }

  get _isAllSelected() {
    const paginatedEmployees = this._getPaginatedEmployees();
    return (
      paginatedEmployees.length > 0 &&
      paginatedEmployees.every((emp) => this._selectedIds.includes(emp.id))
    );
  }

  get _totalPages() {
    return Math.ceil(this._employees.length / this._itemsPerPage);
  }

  _getPaginatedEmployees() {
    const start = (this._currentPage - 1) * this._itemsPerPage;
    const end = start + this._itemsPerPage;
    return this._employees.slice(start, end);
  }

  _handlePageChange(e) {
    this._currentPage = e.detail.page;
    this._selectedIds = [];
  }

  renderTableView() {
    const paginatedEmployees = this._getPaginatedEmployees();

    return html`
      <table>
        <thead>
          <tr>
            <th class="checkbox-col">
              <input
                type="checkbox"
                .checked=${this._isAllSelected}
                @change=${this._toggleSelectAll}
              />
            </th>
            <th>${i18n.t('firstName')}</th>
            <th>${i18n.t('lastName')}</th>
            <th>${i18n.t('dateOfEmployment')}</th>
            <th>${i18n.t('dateOfBirth')}</th>
            <th>${i18n.t('phone')}</th>
            <th>${i18n.t('email')}</th>
            <th>${i18n.t('department')}</th>
            <th>${i18n.t('position')}</th>
            <th>${i18n.t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${paginatedEmployees.map(
            (emp) => html`
              <tr>
                <td class="checkbox-col">
                  <input
                    type="checkbox"
                    .checked=${this._selectedIds.includes(emp.id)}
                    @change=${(e) => this._toggleSelect(emp.id, e)}
                  />
                </td>
                <td>${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td>${formatDate(emp.dateOfEmployment)}</td>
                <td>${formatDate(emp.dateOfBirth)}</td>
                <td>${emp.phone}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>
                  <div class="actions">
                    <button
                      class="btn btn-edit"
                      @click=${() => this._handleEdit(emp.id)}
                    >
                      ${i18n.t('edit')}
                    </button>
                    <button
                      class="btn btn-delete"
                      @click=${() => this._handleDelete(emp.id)}
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
    const paginatedEmployees = this._getPaginatedEmployees();

    return html`
      <div class="grid-view">
        ${paginatedEmployees.map(
          (emp) => html`
            <div class="grid-item">
              <div class="grid-item-header">
                <input
                  type="checkbox"
                  class="grid-item-checkbox"
                  .checked=${this._selectedIds.includes(emp.id)}
                  @change=${(e) => this._toggleSelect(emp.id, e)}
                />
                <span>${emp.firstName} ${emp.lastName}</span>
              </div>
              <div class="grid-item-info">
                <div class="grid-item-field">
                  <span class="grid-item-label">${i18n.t('email')}:</span>
                  <span class="grid-item-value">${emp.email}</span>
                </div>
                <div class="grid-item-field">
                  <span class="grid-item-label">${i18n.t('phone')}:</span>
                  <span class="grid-item-value">${emp.phone}</span>
                </div>
                <div class="grid-item-field">
                  <span class="grid-item-label">${i18n.t('dateOfEmployment')}:</span>
                  <span class="grid-item-value">${formatDate(emp.dateOfEmployment)}</span>
                </div>
                <div class="grid-item-field">
                  <span class="grid-item-label">${i18n.t('dateOfBirth')}:</span>
                  <span class="grid-item-value">${formatDate(emp.dateOfBirth)}</span>
                </div>
                <div class="grid-item-field">
                  <span class="grid-item-label">${i18n.t('department')}:</span>
                  <span class="grid-item-value">${emp.department}</span>
                </div>
                <div class="grid-item-field">
                  <span class="grid-item-label">${i18n.t('position')}:</span>
                  <span class="grid-item-value">${emp.position}</span>
                </div>
              </div>
              <div class="actions">
                <button
                  class="btn btn-edit"
                  @click=${() => this._handleEdit(emp.id)}
                >
                  ${i18n.t('edit')}
                </button>
                <button
                  class="btn btn-delete"
                  @click=${() => this._handleDelete(emp.id)}
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
            class="view-btn ${this._viewMode === 'table' ? 'active' : ''}"
            @click=${() => this._setViewMode('table')}
            title="Table View"
          >
            ${tableIcon}
          </button>
          <button
            class="view-btn ${this._viewMode === 'grid' ? 'active' : ''}"
            @click=${() => this._setViewMode('grid')}
            title="Grid View"
          >
            ${gridIcon}
          </button>
        </div>
      </div>

      ${this._employees.length === 0
        ? html`<div class="empty">No employees found</div>`
        : html`
            ${this._viewMode === 'table'
              ? this.renderTableView()
              : this.renderGridView()}
            <pagination-controls
              .currentPage=${this._currentPage}
              .totalPages=${this._totalPages}
              .itemsPerPage=${this._itemsPerPage}
              .totalItems=${this._employees.length}
              @page-change=${this._handlePageChange}
            ></pagination-controls>
          `}

      <confirm-dialog></confirm-dialog>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
