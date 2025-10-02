import {LitElement, html, css} from 'lit';
import {i18n} from '../i18n/translations.js';
import {
  employeeStore,
  DEPARTMENTS,
  POSITIONS,
} from '../store/employee-store.js';
import {validateEmployee} from '../utils/validators.js';

export class EmployeeForm extends LitElement {
  static properties = {
    employeeId: {type: String, state: true},
    formData: {type: Object, state: true},
    errors: {type: Object, state: true},
  };

  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-xl);
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      margin: 0 0 var(--spacing-xl) 0;
      font-size: var(--font-xxxl);
      color: var(--color-text);
    }

    form {
      background: var(--color-surface);
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--color-border-light);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-weight: var(--weight-semibold);
      margin-bottom: var(--spacing-sm);
      color: var(--color-text);
      font-size: 0.9375rem;
      display: block;
    }

    label .required {
      color: var(--color-danger);
      margin-left: 2px;
    }

    input,
    select {
      padding: 0.75rem;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-base);
      font-family: inherit;
      background: var(--color-surface);
      color: var(--color-text);
      transition: all 0.2s;
      width: 100%;
      box-sizing: border-box;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    input.error,
    select.error {
      border-color: var(--color-danger);
      background: rgba(255, 59, 48, 0.05);
    }

    .error-message {
      color: var(--color-danger);
      font-size: var(--font-sm);
      margin-top: var(--spacing-xs);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--color-border);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-base);
      font-weight: var(--weight-semibold);
      cursor: pointer;
      transition: all 0.2s;
      min-width: 120px;
    }

    .btn-primary {
      background: var(--color-primary);
      color: var(--color-surface);
      box-shadow: 0 2px 4px rgba(255, 98, 0, 0.2);
    }

    .btn-primary:hover {
      background: var(--color-primary-hover);
      box-shadow: 0 4px 8px rgba(255, 98, 0, 0.3);
      transform: translateY(-1px);
    }

    .btn-primary:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(255, 98, 0, 0.2);
    }

    .btn-secondary {
      background: var(--color-surface);
      border: 1.5px solid var(--color-border);
      color: var(--color-text);
    }

    .btn-secondary:hover {
      background: var(--color-background);
      border-color: var(--color-text-light);
    }

    @media (max-width: 768px) {
      :host {
        padding: var(--spacing-md);
      }

      h1 {
        font-size: var(--font-xxl);
      }

      form {
        padding: var(--spacing-lg);
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      :host {
        padding: 0.75rem;
      }

      form {
        padding: var(--spacing-md);
      }

      h1 {
        font-size: var(--font-xl);
        margin-bottom: var(--spacing-lg);
      }

      input,
      select {
        font-size: 0.9375rem;
      }
    }
  `;

  constructor() {
    super();
    this.employeeId = null;
    this.formData = this.getEmptyFormData();
    this.errors = {};
    this.boundHandleLangChange = this.handleLanguageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this.boundHandleLangChange);
    this.loadEmployee();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this.boundHandleLangChange);
  }

  handleLanguageChange() {
    this.requestUpdate();
  }

  getEmptyFormData() {
    return {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
  }

  loadEmployee() {
    const path = window.location.pathname;
    const match = path.match(/\/edit\/(.+)/);

    if (match) {
      this.employeeId = match[1];
      const employee = employeeStore.getById(this.employeeId);

      if (employee) {
        this.formData = {
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          dateOfEmployment: employee.dateOfEmployment || '',
          dateOfBirth: employee.dateOfBirth || '',
          phone: employee.phone || '',
          email: employee.email || '',
          department: employee.department || '',
          position: employee.position || '',
        };
      }
    }
  }

  handleInput(field, value) {
    this.formData = {...this.formData, [field]: value};
    if (this.errors[field]) {
      this.errors = {...this.errors, [field]: undefined};
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const validation = validateEmployee(this.formData, this.employeeId);

    if (!validation.isValid) {
      this.errors = validation.errors;
      return;
    }

    if (this.employeeId) {
      employeeStore.update(this.employeeId, this.formData);
    } else {
      employeeStore.add(this.formData);
    }

    window.location.href = '/';
  }

  handleCancel() {
    window.location.href = '/';
  }

  render() {
    const isEdit = !!this.employeeId;
    const title = isEdit ? i18n.t('editEmployee') : i18n.t('addEmployee');

    return html`
      <h1>${title}</h1>
      <form @submit=${this.handleSubmit}>
        <div class="form-row">
          <div class="form-group">
            <label>
              ${i18n.t('firstName')} <span class="required">*</span>
            </label>
            <input
              type="text"
              .value=${this.formData.firstName}
              @input=${(e) => this.handleInput('firstName', e.target.value)}
              class=${this.errors.firstName ? 'error' : ''}
            />
            ${this.errors.firstName
              ? html`<span class="error-message"
                  >${this.errors.firstName}</span
                >`
              : ''}
          </div>

          <div class="form-group">
            <label>
              ${i18n.t('lastName')} <span class="required">*</span>
            </label>
            <input
              type="text"
              .value=${this.formData.lastName}
              @input=${(e) => this.handleInput('lastName', e.target.value)}
              class=${this.errors.lastName ? 'error' : ''}
            />
            ${this.errors.lastName
              ? html`<span class="error-message">${this.errors.lastName}</span>`
              : ''}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>
              ${i18n.t('dateOfEmployment')} <span class="required">*</span>
            </label>
            <input
              type="date"
              .value=${this.formData.dateOfEmployment}
              @input=${(e) =>
                this.handleInput('dateOfEmployment', e.target.value)}
              class=${this.errors.dateOfEmployment ? 'error' : ''}
            />
            ${this.errors.dateOfEmployment
              ? html`<span class="error-message"
                  >${this.errors.dateOfEmployment}</span
                >`
              : ''}
          </div>

          <div class="form-group">
            <label>
              ${i18n.t('dateOfBirth')} <span class="required">*</span>
            </label>
            <input
              type="date"
              .value=${this.formData.dateOfBirth}
              @input=${(e) => this.handleInput('dateOfBirth', e.target.value)}
              class=${this.errors.dateOfBirth ? 'error' : ''}
            />
            ${this.errors.dateOfBirth
              ? html`<span class="error-message"
                  >${this.errors.dateOfBirth}</span
                >`
              : ''}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label> ${i18n.t('phone')} <span class="required">*</span> </label>
            <input
              type="tel"
              .value=${this.formData.phone}
              @input=${(e) => this.handleInput('phone', e.target.value)}
              class=${this.errors.phone ? 'error' : ''}
            />
            ${this.errors.phone
              ? html`<span class="error-message">${this.errors.phone}</span>`
              : ''}
          </div>

          <div class="form-group">
            <label> ${i18n.t('email')} <span class="required">*</span> </label>
            <input
              type="email"
              .value=${this.formData.email}
              @input=${(e) => this.handleInput('email', e.target.value)}
              class=${this.errors.email ? 'error' : ''}
            />
            ${this.errors.email
              ? html`<span class="error-message">${this.errors.email}</span>`
              : ''}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>
              ${i18n.t('department')} <span class="required">*</span>
            </label>
            <select
              .value=${this.formData.department}
              @change=${(e) => this.handleInput('department', e.target.value)}
              class=${this.errors.department ? 'error' : ''}
            >
              <option value="">${i18n.t('selectDepartment')}</option>
              ${DEPARTMENTS.map(
                (dept) => html`<option value=${dept}>${dept}</option>`
              )}
            </select>
            ${this.errors.department
              ? html`<span class="error-message"
                  >${this.errors.department}</span
                >`
              : ''}
          </div>

          <div class="form-group">
            <label>
              ${i18n.t('position')} <span class="required">*</span>
            </label>
            <select
              .value=${this.formData.position}
              @change=${(e) => this.handleInput('position', e.target.value)}
              class=${this.errors.position ? 'error' : ''}
            >
              <option value="">${i18n.t('selectPosition')}</option>
              ${POSITIONS.map(
                (pos) => html`<option value=${pos}>${pos}</option>`
              )}
            </select>
            ${this.errors.position
              ? html`<span class="error-message">${this.errors.position}</span>`
              : ''}
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            ${i18n.t('save')}
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click=${this.handleCancel}
          >
            ${i18n.t('cancel')}
          </button>
        </div>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
