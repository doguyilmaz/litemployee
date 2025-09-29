import {LitElement, html, css} from 'lit';
import {i18n} from '../i18n/translations.js';

export class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<p>${i18n.t('employeeList')}</p>`;
  }
}

customElements.define('employee-list', EmployeeList);
