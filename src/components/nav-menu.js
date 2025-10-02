import {LitElement, html, css} from 'lit';
import {i18n} from '../i18n/translations.js';
import {seedEmployees} from '../utils/seed-data.js';

export class NavMenu extends LitElement {
  static properties = {
    _lang: {type: String, state: true},
  };

  static styles = css`
    :host {
      display: block;
      background: var(--color-surface);
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

    .brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-weight: var(--weight-semibold);
      font-size: var(--font-lg);
      color: var(--color-text);
      text-decoration: none;
    }

    .logo {
      width: 32px;
      height: 32px;
      background: var(--color-primary);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-surface);
      font-weight: var(--weight-bold);
      font-size: var(--font-sm);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
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

    .nav-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .btn-add,
    .btn-seed {
      padding: var(--spacing-sm) var(--spacing-lg);
      border: none;
      border-radius: var(--radius-sm);
      background: var(--color-primary);
      color: var(--color-surface);
      font-weight: var(--weight-medium);
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .btn-add:hover,
    .btn-seed:hover {
      background: var(--color-primary-hover);
    }

    .btn-add::before {
      content: '+';
      font-size: var(--font-lg);
      font-weight: var(--weight-bold);
    }

    .btn-seed {
      background: var(--color-text-light);
      font-size: var(--font-sm);
    }

    .btn-seed:hover {
      background: var(--color-text);
    }

    .btn-lang {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--color-primary);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-primary);
      font-weight: var(--weight-medium);
      cursor: pointer;
      transition: all 0.2s;
      min-width: 48px;
    }

    .btn-lang:hover {
      background: var(--color-primary);
      color: var(--color-surface);
    }

    @media (max-width: 768px) {
      nav {
        flex-wrap: wrap;
        padding: var(--spacing-md);
        gap: var(--spacing-md);
      }

      .nav-links {
        display: none;
      }

      .spacer {
        display: none;
      }

      .nav-actions {
        flex: 1;
        justify-content: flex-end;
      }

      .btn-add {
        flex: 1;
      }
    }
  `;

  constructor() {
    super();
    this._lang = i18n.getCurrentLanguage();
  }

  connectedCallback() {
    super.connectedCallback();
    this._boundHandleLangChange = this._handleLanguageChange.bind(this);
    window.addEventListener('language-changed', this._boundHandleLangChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this._boundHandleLangChange);
  }

  _handleLanguageChange(e) {
    this._lang = e.detail.lang;
  }

  _toggleLanguage() {
    this._lang = i18n.toggle();
  }

  _handleSeed() {
    seedEmployees(25);
    window.location.reload();
  }

  render() {
    const buttonText = this._lang === 'en' ? 'TR' : 'EN';

    return html`
      <nav>
        <a href="/" class="brand">
          <div class="logo">ING</div>
          <span>Employee Management</span>
        </a>
        <div class="nav-links">
          <a href="/">${i18n.t('employeeList')}</a>
        </div>
        <span class="spacer"></span>
        <div class="nav-actions">
          <button class="btn-seed" @click=${this._handleSeed}>Seed 25</button>
          <a href="/add" class="btn-add">${i18n.t('addNew')}</a>
          <button class="btn-lang" @click=${this._toggleLanguage}>
            ${buttonText}
          </button>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-menu', NavMenu);
