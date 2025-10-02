import {LitElement, html, css} from 'lit';
import {i18n} from '../i18n/translations.js';

export class PaginationControls extends LitElement {
  static properties = {
    currentPage: {type: Number},
    totalPages: {type: Number},
    itemsPerPage: {type: Number},
    totalItems: {type: Number},
    _lang: {type: String, state: true},
  };

  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-lg) 0;
    }

    .pagination-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-md);
    }

    .pagination-info {
      color: var(--color-text-light);
      font-size: var(--font-sm);
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .page-size-selector label {
      color: var(--color-text-light);
      font-size: var(--font-sm);
    }

    .page-size-selector select {
      padding: 4px 8px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-text);
      font-size: var(--font-sm);
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .page-size-selector select:hover {
      border-color: var(--color-primary);
    }

    .page-size-selector select:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .page-btn {
      min-width: 36px;
      height: 36px;
      padding: 0 var(--spacing-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-text);
      font-size: var(--font-sm);
      font-weight: var(--weight-medium);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-btn:hover:not(:disabled) {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .page-btn.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-surface);
    }

    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-btn.arrow {
      min-width: 32px;
    }

    .ellipsis {
      color: var(--color-text-light);
      padding: 0 var(--spacing-xs);
    }

    @media (max-width: 768px) {
      .pagination-container {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .pagination-info {
        order: 2;
      }

      .pagination-controls {
        order: 1;
      }
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.itemsPerPage = 10;
    this.totalItems = 0;
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

  _handlePageChange(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: {page},
        bubbles: true,
        composed: true,
      })
    );
  }

  _handlePageSizeChange(e) {
    const newSize = parseInt(e.target.value, 10);
    this.dispatchEvent(
      new CustomEvent('page-size-change', {
        detail: {size: newSize},
        bubbles: true,
        composed: true,
      })
    );
  }

  _getVisiblePages() {
    const pages = [];
    const maxVisible = 7;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  render() {
    if (this.totalPages <= 1) {
      return html``;
    }

    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(
      this.currentPage * this.itemsPerPage,
      this.totalItems
    );
    const visiblePages = this._getVisiblePages();

    return html`
      <div class="pagination-container">
        <div class="pagination-info">
          <span>
            ${i18n.t('showing')} ${startItem}-${endItem} ${i18n.t('of')}
            ${this.totalItems}
          </span>
          <div class="page-size-selector">
            <label>${i18n.t('itemsPerPage')}:</label>
            <select
              .value=${this.itemsPerPage.toString()}
              @change=${this._handlePageSizeChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div class="pagination-controls">
          <button
            class="page-btn arrow"
            @click=${() => this._handlePageChange(this.currentPage - 1)}
            ?disabled=${this.currentPage === 1}
            title="Previous page"
          >
            ‹
          </button>

          ${visiblePages.map((page) =>
            page === 'ellipsis'
              ? html`<span class="ellipsis">...</span>`
              : html`
                  <button
                    class="page-btn ${page === this.currentPage
                      ? 'active'
                      : ''}"
                    @click=${() => this._handlePageChange(page)}
                  >
                    ${page}
                  </button>
                `
          )}

          <button
            class="page-btn arrow"
            @click=${() => this._handlePageChange(this.currentPage + 1)}
            ?disabled=${this.currentPage === this.totalPages}
            title="Next page"
          >
            ›
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('pagination-controls', PaginationControls);
