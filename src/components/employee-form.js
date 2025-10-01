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
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      margin: 0 0 2rem 0;
      font-size: 1.75rem;
      color: #333;
    }

    form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #333;
    }

    label .required {
      color: #dc3545;
    }

    input,
    select {
      padding: 0.625rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: #007bff;
    }

    input.error,
    select.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #dee2e6;
    }

    .btn {
      padding: 0.625rem 1.5rem;
      border: 1px solid;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #007bff;
      border-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
      border-color: #0056b3;
    }

    .btn-secondary {
      background: white;
      border-color: #6c757d;
      color: #6c757d;
    }

    .btn-secondary:hover {
      background: #6c757d;
      color: white;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      form {
        padding: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
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
        padding: 1rem;
      }

      h1 {
        font-size: 1.25rem;
        margin-bottom: 1.5rem;
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
