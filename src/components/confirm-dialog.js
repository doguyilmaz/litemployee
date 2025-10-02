import {LitElement, html, css} from 'lit';
import {i18n} from '../i18n/translations.js';

export class ConfirmDialog extends LitElement {
  static properties = {
    _isOpen: {type: Boolean, state: true},
    _title: {type: String, state: true},
    _message: {type: String, state: true},
    _confirmText: {type: String, state: true},
    _cancelText: {type: String, state: true},
    _onConfirm: {type: Function, state: true},
    _onCancel: {type: Function, state: true},
  };

  static styles = css`
    :host {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
    }

    :host([open]) {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      animation: fadeIn 0.2s ease-out;
    }

    .dialog {
      position: relative;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-width: 480px;
      width: 90%;
      padding: 2rem;
      animation: slideUp 0.3s ease-out;
    }

    .dialog-header {
      margin-bottom: var(--spacing-md);
    }

    .dialog-title {
      font-size: var(--font-xl);
      font-weight: var(--weight-semibold);
      color: var(--color-text);
      margin: 0;
    }

    .dialog-message {
      color: var(--color-text-light);
      font-size: var(--font-base);
      line-height: 1.5;
      margin-bottom: var(--spacing-xl);
    }

    .dialog-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-base);
      font-weight: var(--weight-semibold);
      cursor: pointer;
      transition: all 0.2s;
      min-width: 100px;
    }

    .btn-confirm {
      background: var(--color-danger);
      color: var(--color-surface);
      box-shadow: 0 2px 4px rgba(255, 59, 48, 0.2);
    }

    .btn-confirm:hover {
      background: #e5342e;
      box-shadow: 0 4px 8px rgba(255, 59, 48, 0.3);
      transform: translateY(-1px);
    }

    .btn-confirm:active {
      transform: translateY(0);
    }

    .btn-cancel {
      background: var(--color-surface);
      border: 1.5px solid var(--color-border);
      color: var(--color-text);
    }

    .btn-cancel:hover {
      background: var(--color-background);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 480px) {
      .dialog {
        padding: 1.5rem;
        width: 95%;
      }

      .dialog-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this._isOpen = false;
    this._title = '';
    this._message = '';
    this._confirmText = '';
    this._cancelText = '';
    this._onConfirm = null;
    this._onCancel = null;
  }

  open({title, message, confirmText, cancelText, onConfirm, onCancel}) {
    this._title = title || i18n.t('confirmDelete');
    this._message = message || i18n.t('confirmDeleteMessage');
    this._confirmText = confirmText || i18n.t('delete');
    this._cancelText = cancelText || i18n.t('cancel');
    this._onConfirm = onConfirm;
    this._onCancel = onCancel;
    this._isOpen = true;
    this.setAttribute('open', '');
  }

  close() {
    this._isOpen = false;
    this.removeAttribute('open');
  }

  _handleConfirm() {
    if (this._onConfirm) {
      this._onConfirm();
    }
    this.close();
  }

  _handleCancel() {
    if (this._onCancel) {
      this._onCancel();
    }
    this.close();
  }

  _handleOverlayClick(e) {
    if (e.target.classList.contains('overlay')) {
      this._handleCancel();
    }
  }

  render() {
    if (!this._isOpen) return html``;

    return html`
      <div class="overlay" @click=${this._handleOverlayClick}></div>
      <div class="dialog">
        <div class="dialog-header">
          <h2 class="dialog-title">${this._title}</h2>
        </div>
        <div class="dialog-message">${this._message}</div>
        <div class="dialog-actions">
          <button class="btn btn-cancel" @click=${this._handleCancel}>
            ${this._cancelText}
          </button>
          <button class="btn btn-confirm" @click=${this._handleConfirm}>
            ${this._confirmText}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);
