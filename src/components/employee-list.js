import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import {employeeStore} from '../store/employee-store.js';
import {i18n} from '../i18n/translations.js';
import {tableIcon, gridIcon, editIcon, deleteIcon} from '../utils/icons.js';
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
    _sortField: {type: String, state: true},
    _sortDirection: {type: String, state: true},
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: var(--spacing-lg);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      flex: 1;
    }

    h1 {
      margin: 0;
      font-size: var(--font-xxxl);
      color: var(--color-primary);
      font-weight: var(--weight-semibold);
    }

    .bulk-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--color-primary-light);
      border: 1px solid var(--color-primary);
      border-radius: var(--radius-md);
    }

    .selection-count {
      font-size: var(--font-sm);
      font-weight: var(--weight-medium);
      color: var(--color-primary);
    }

    .btn-bulk-delete,
    .btn-clear-selection {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: none;
      border-radius: var(--radius-sm);
      font-size: var(--font-sm);
      font-weight: var(--weight-medium);
      cursor: pointer;
      transition: all 0.2s;
      background: transparent;
    }

    .btn-bulk-delete {
      color: var(--color-danger);
    }

    .btn-bulk-delete:hover {
      background: var(--color-danger);
      color: var(--color-surface);
    }

    .btn-clear-selection {
      color: var(--color-text-light);
    }

    .btn-clear-selection:hover {
      background: rgba(0, 0, 0, 0.05);
      color: var(--color-text);
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

    .show-table .grid-view {
      display: none;
    }

    .show-grid .table-wrapper {
      display: none;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-base);
    }

    table {
      width: 100%;
      min-width: 1000px;
      border-collapse: collapse;
      background: var(--color-surface);
    }

    thead {
      background: var(--color-primary-light);
    }

    th {
      text-align: left;
      padding: 12px 16px;
      font-weight: var(--weight-semibold);
      color: var(--color-primary);
      border-bottom: 2px solid var(--color-border-light);
      font-size: 0.875rem;
      white-space: nowrap;
    }

    td {
      padding: 12px 16px;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    th.sortable {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
      position: relative;
    }

    th.sortable:hover {
      background: rgba(255, 98, 0, 0.1);
    }

    th.sortable.active {
      background: rgba(255, 98, 0, 0.15);
    }

    th.sortable::after {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      margin-left: 6px;
      opacity: 0.3;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid currentColor;
    }

    th.sortable.active.asc::after {
      opacity: 1;
      border-top: 5px solid currentColor;
      border-bottom: none;
    }

    th.sortable.active.desc::after {
      opacity: 1;
      border-top: none;
      border-bottom: 5px solid currentColor;
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

    tbody td {
      border-bottom: 1px solid var(--color-border-light);
      color: var(--color-text);
    }

    tr:hover {
      background: var(--color-background);
    }

    .grid-view {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }

    .grid-item {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      border: 1px solid var(--color-border-light);
      display: flex;
      flex-direction: column;
      transition: all 0.2s;
      overflow: hidden;
    }

    .grid-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .grid-item-header {
      background: var(--color-primary-light);
      padding: 0.875rem 1rem;
      font-weight: var(--weight-semibold);
      font-size: 0.9375rem;
      color: var(--color-primary);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      border-bottom: 1px solid var(--color-primary);
    }

    .grid-item-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--color-primary);
    }

    .grid-item-info {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .grid-item-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .grid-item-field {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      min-width: 0;
    }

    .grid-item-label {
      font-size: 0.6875rem;
      font-weight: var(--weight-medium);
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .grid-item-value {
      font-size: 0.8125rem;
      color: var(--color-text);
      font-weight: var(--weight-normal);
      word-break: break-word;
      overflow-wrap: break-word;
      line-height: 1.4;
    }

    .grid-item .actions {
      padding: 0.75rem 1rem;
      display: flex;
      gap: 0.5rem;
      background: var(--color-background);
      border-top: 1px solid var(--color-border-light);
    }

    .btn {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .btn-edit {
      background: var(--color-primary);
      color: white;
    }

    .btn-edit:hover {
      background: #e55800;
      box-shadow: 0 2px 4px rgba(255, 98, 0, 0.3);
    }

    .btn-edit:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 4px;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.85);
      color: white;
      font-size: 0.75rem;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      pointer-events: none;
      z-index: 1000;
    }

    .btn-delete {
      background: var(--color-surface);
      color: var(--color-danger);
      border: 1px solid var(--color-danger);
    }

    .btn-delete:hover {
      background: var(--color-danger);
      color: white;
      border-color: var(--color-danger);
    }

    .btn-delete:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 4px;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.85);
      color: white;
      font-size: 0.75rem;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      pointer-events: none;
      z-index: 1000;
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
    this._sortField = null;
    this._sortDirection = 'asc';
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

  _sortEmployees(employees) {
    if (!this._sortField) return employees;

    return [...employees].sort((a, b) => {
      let aVal = a[this._sortField];
      let bVal = b[this._sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return this._sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this._sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  _getPaginatedEmployees() {
    const sorted = this._sortEmployees(this._employees);
    const start = (this._currentPage - 1) * this._itemsPerPage;
    const end = start + this._itemsPerPage;
    return sorted.slice(start, end);
  }

  _handleSort(field) {
    if (this._sortField === field) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortField = field;
      this._sortDirection = 'asc';
    }
  }

  _handlePageChange(e) {
    this._currentPage = e.detail.page;
    this._selectedIds = [];
  }

  _handlePageSizeChange(e) {
    this._itemsPerPage = e.detail.size;
    this._currentPage = 1;
    this._selectedIds = [];
  }

  renderTableView() {
    const paginatedEmployees = this._getPaginatedEmployees();

    return html`
      <div class="table-wrapper">
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
              <th
                class="sortable ${this._sortField === 'firstName'
                  ? 'active'
                  : ''} ${this._sortField === 'firstName'
                  ? this._sortDirection
                  : ''}"
                @click=${() => this._handleSort('firstName')}
              >
                ${i18n.t('firstName')}
              </th>
              <th
                class="sortable ${this._sortField === 'lastName'
                  ? 'active'
                  : ''} ${this._sortField === 'lastName'
                  ? this._sortDirection
                  : ''}"
                @click=${() => this._handleSort('lastName')}
              >
                ${i18n.t('lastName')}
              </th>
              <th
                class="sortable ${this._sortField === 'dateOfEmployment'
                  ? 'active'
                  : ''} ${this._sortField === 'dateOfEmployment'
                  ? this._sortDirection
                  : ''}"
                @click=${() => this._handleSort('dateOfEmployment')}
              >
                ${i18n.t('dateOfEmployment')}
              </th>
              <th
                class="sortable ${this._sortField === 'dateOfBirth'
                  ? 'active'
                  : ''} ${this._sortField === 'dateOfBirth'
                  ? this._sortDirection
                  : ''}"
                @click=${() => this._handleSort('dateOfBirth')}
              >
                ${i18n.t('dateOfBirth')}
              </th>
              <th
                class="sortable ${this._sortField === 'phone'
                  ? 'active'
                  : ''} ${this._sortField === 'phone'
                  ? this._sortDirection
                  : ''}"
                @click=${() => this._handleSort('phone')}
              >
                ${i18n.t('phone')}
              </th>
              <th
                class="sortable ${this._sortField === 'email'
                  ? 'active'
                  : ''} ${this._sortField === 'email'
                  ? this._sortDirection
                  : ''}"
                @click=${() => this._handleSort('email')}
              >
                ${i18n.t('email')}
              </th>
              <th
                class="sortable ${this._sortField === 'department'
                  ? 'active'
                  : ''} ${this._sortField === 'department'
                  ? this._sortDirection
                  : ''}"
                @click=${() => this._handleSort('department')}
              >
                ${i18n.t('department')}
              </th>
              <th
                class="sortable ${this._sortField === 'position'
                  ? 'active'
                  : ''} ${this._sortField === 'position'
                  ? this._sortDirection
                  : ''}"
                @click=${() => this._handleSort('position')}
              >
                ${i18n.t('position')}
              </th>
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
                        data-tooltip="${i18n.t('edit')}"
                        @click=${() => this._handleEdit(emp.id)}
                      >
                        ${editIcon}
                      </button>
                      <button
                        class="btn btn-delete"
                        data-tooltip="${i18n.t('delete')}"
                        @click=${() => this._handleDelete(emp.id)}
                      >
                        ${deleteIcon}
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
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
                  <span class="grid-item-label">${i18n.t('email')}</span>
                  <span class="grid-item-value">${emp.email}</span>
                </div>
                <div class="grid-item-field">
                  <span class="grid-item-label">${i18n.t('phone')}</span>
                  <span class="grid-item-value">${emp.phone}</span>
                </div>
                <div class="grid-item-row">
                  <div class="grid-item-field">
                    <span class="grid-item-label"
                      >${i18n.t('dateOfEmployment')}</span
                    >
                    <span class="grid-item-value"
                      >${formatDate(emp.dateOfEmployment)}</span
                    >
                  </div>
                  <div class="grid-item-field">
                    <span class="grid-item-label"
                      >${i18n.t('dateOfBirth')}</span
                    >
                    <span class="grid-item-value"
                      >${formatDate(emp.dateOfBirth)}</span
                    >
                  </div>
                </div>
                <div class="grid-item-row">
                  <div class="grid-item-field">
                    <span class="grid-item-label">${i18n.t('department')}</span>
                    <span class="grid-item-value">${emp.department}</span>
                  </div>
                  <div class="grid-item-field">
                    <span class="grid-item-label">${i18n.t('position')}</span>
                    <span class="grid-item-value">${emp.position}</span>
                  </div>
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

  _handleBulkDelete() {
    if (this._selectedIds.length === 0) return;

    const dialog = this.shadowRoot.querySelector('confirm-dialog');
    const count = this._selectedIds.length;
    dialog.open({
      title: i18n.t('confirmDelete'),
      message:
        count === 1
          ? i18n.t('confirmDeleteMessage')
          : i18n.t('confirmDeleteMultiple').replace('{count}', count),
      onConfirm: () => {
        this._selectedIds.forEach((id) => {
          employeeStore.delete(id);
        });
        this._selectedIds = [];
        this._loadEmployees();
      },
    });
  }

  _handleClearSelection() {
    this._selectedIds = [];
  }

  render() {
    return html`
      <div class="header">
        <div class="header-left">
          <h1>${i18n.t('employeeList')}</h1>
          ${this._selectedIds.length > 0
            ? html`
                <div class="bulk-actions">
                  <span class="selection-count">
                    ${this._selectedIds.length} ${i18n.t('employeesSelected')}
                  </span>
                  <button
                    class="btn-bulk-delete"
                    @click=${this._handleBulkDelete}
                  >
                    <iconify-icon
                      icon="lucide:trash-2"
                      width="16"
                      height="16"
                    ></iconify-icon>
                    ${i18n.t('delete')}
                  </button>
                  <button
                    class="btn-clear-selection"
                    @click=${this._handleClearSelection}
                  >
                    <iconify-icon
                      icon="lucide:x"
                      width="16"
                      height="16"
                    ></iconify-icon>
                    ${i18n.t('clearSelection')}
                  </button>
                </div>
              `
            : ''}
        </div>
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
            <div
              class="${this._viewMode === 'table' ? 'show-table' : 'show-grid'}"
            >
              ${this.renderTableView()} ${this.renderGridView()}
            </div>
            <pagination-controls
              .currentPage=${this._currentPage}
              .totalPages=${this._totalPages}
              .itemsPerPage=${this._itemsPerPage}
              .totalItems=${this._employees.length}
              @page-change=${this._handlePageChange}
              @page-size-change=${this._handlePageSizeChange}
            ></pagination-controls>
          `}

      <confirm-dialog></confirm-dialog>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
