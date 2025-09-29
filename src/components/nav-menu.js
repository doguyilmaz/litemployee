import {LitElement, html, css} from 'lit';
import {i18n} from '../i18n/translations.js';

export class NavMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  toggleLanguage() {
    i18n.toggle();
    this.requestUpdate();
  }

  render() {
    const lang = i18n.getCurrentLanguage();
    const buttonText = lang === 'en' ? 'TR' : 'EN';

    return html`
      <nav>
        <a href="/">${i18n.t('employeeList')}</a>
        <a href="/add">${i18n.t('addEmployee')}</a>
        <button @click=${this.toggleLanguage}>${buttonText}</button>
      </nav>
    `;
  }
}

customElements.define('nav-menu', NavMenu);
