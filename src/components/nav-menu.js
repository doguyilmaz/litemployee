import {LitElement, html, css} from 'lit';
import {i18n} from '../i18n/translations.js';

export class NavMenu extends LitElement {
  static properties = {
    lang: {type: String, state: true},
  };

  static styles = css`
    :host {
      display: block;
      border-bottom: 1px solid var(--color-border-light);
    }

    nav {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      padding: var(--spacing-md) var(--spacing-xl);
      max-width: 1200px;
      margin: 0 auto;
    }

    a {
      color: var(--color-text);
      text-decoration: none;
      font-weight: var(--weight-medium);
      transition: color 0.2s;
    }

    a:hover {
      color: var(--color-primary);
    }

    .spacer {
      margin-left: auto;
    }

    button {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--color-primary);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-primary);
      font-weight: var(--weight-medium);
      cursor: pointer;
      transition: all 0.2s;
    }

    button:hover {
      background: var(--color-primary);
      color: var(--color-surface);
    }

    @media (max-width: 640px) {
      nav {
        flex-wrap: wrap;
        padding: var(--spacing-md);
        gap: var(--spacing-md);
      }

      .spacer {
        display: none;
      }

      button {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.lang = i18n.getCurrentLanguage();
    this.boundHandleLangChange = this.handleLanguageChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this.boundHandleLangChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this.boundHandleLangChange);
  }

  handleLanguageChange(e) {
    this.lang = e.detail.lang;
  }

  toggleLanguage() {
    this.lang = i18n.toggle();
  }

  render() {
    const buttonText = this.lang === 'en' ? 'TR' : 'EN';

    return html`
      <nav>
        <a href="/">${i18n.t('employeeList')}</a>
        <a href="/add">${i18n.t('addEmployee')}</a>
        <span class="spacer"></span>
        <button @click=${this.toggleLanguage}>${buttonText}</button>
      </nav>
    `;
  }
}

customElements.define('nav-menu', NavMenu);
