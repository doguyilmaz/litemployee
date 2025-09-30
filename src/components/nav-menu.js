import {LitElement, html, css} from 'lit';
import {i18n} from '../i18n/translations.js';

export class NavMenu extends LitElement {
  static properties = {
    lang: {type: String, state: true},
  };

  static styles = css`
    :host {
      display: block;
      border-bottom: 1px solid #e0e0e0;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    a:hover {
      color: #ff6300;
    }

    .spacer {
      margin-left: auto;
    }

    button {
      padding: 0.5rem 1rem;
      border: 1px solid #ff6300;
      border-radius: 4px;
      background: white;
      color: #ff6300;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    button:hover {
      background: #ff6300;
      color: white;
    }

    @media (max-width: 640px) {
      nav {
        flex-wrap: wrap;
        padding: 1rem;
        gap: 1rem;
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
  }

  toggleLanguage() {
    this.lang = i18n.toggle();
    window.dispatchEvent(new CustomEvent('language-changed'));
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
