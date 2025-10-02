import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import {i18n} from '../i18n/translations.js';
import {seedEmployees} from '../utils/seed-data.js';
import './confirm-dialog.js';

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
    .btn-seed,
    .btn-clear,
    .btn-lang {
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-weight: var(--weight-medium);
      font-size: 0.8125rem;
      line-height: 1.2;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      box-sizing: border-box;
      height: 30px;
    }

    .btn-add {
      border: 1px solid transparent;
      background: var(--color-primary);
      color: var(--color-surface);
      text-decoration: none;
    }

    .btn-add:hover {
      background: #e55800;
      color: white;
      box-shadow: 0 4px 8px rgba(255, 98, 0, 0.3);
    }

    .btn-add::before {
      content: '+';
      font-size: 14px;
      font-weight: var(--weight-bold);
      line-height: 1;
    }

    .btn-seed {
      border: 1px solid transparent;
      background: var(--color-text-light);
      color: var(--color-surface);
    }

    .btn-seed:hover {
      background: var(--color-text);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }

    .btn-clear {
      border: 1px solid var(--color-danger);
      background: var(--color-surface);
      color: var(--color-danger);
    }

    .btn-clear:hover {
      background: var(--color-danger);
      color: white;
      box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
    }

    .btn-lang {
      border: 1px solid var(--color-primary);
      background: var(--color-surface);
      color: var(--color-primary);
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
    this._employees = [];
    this.requestUpdate();
    Router.go('/');
  }

  _handleClearData() {
    const dialog = this.shadowRoot.querySelector('confirm-dialog');
    dialog.open({
      title: i18n.t('clearData'),
      message: i18n.t('confirmClearData'),
      onConfirm: () => {
        localStorage.removeItem('employees');
        window.location.reload();
      },
    });
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
          <button class="btn-clear" @click=${this._handleClearData}>
            ${i18n.t('clearData')}
          </button>
          <a href="/add" class="btn-add">${i18n.t('addNew')}</a>
          <button class="btn-lang" @click=${this._toggleLanguage}>
            ${buttonText}
          </button>
        </div>
      </nav>
      <confirm-dialog></confirm-dialog>
    `;
  }
}

customElements.define('nav-menu', NavMenu);
