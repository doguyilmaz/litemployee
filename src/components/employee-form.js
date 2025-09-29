import {LitElement, html, css} from 'lit';
import {i18n} from '../i18n/translations';

export class EmployeeForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<form>${i18n.t('addEmployee')}</form>`;
  }
}

customElements.define('employee-form', EmployeeForm);
