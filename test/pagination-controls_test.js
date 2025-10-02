import {html, fixture, expect} from '@open-wc/testing';
import '../src/components/pagination-controls.js';

describe('pagination-controls', () => {
  it('should render pagination info', async () => {
    const el = await fixture(html`
      <pagination-controls
        .currentPage=${1}
        .totalPages=${5}
        .itemsPerPage=${10}
        .totalItems=${50}
      ></pagination-controls>
    `);

    const info = el.shadowRoot.querySelector('.pagination-info');
    expect(info).to.exist;
    expect(info.textContent).to.include('1-10');
    expect(info.textContent).to.include('50');
  });

  it('should dispatch page-change event when clicking next', async () => {
    const el = await fixture(html`
      <pagination-controls
        .currentPage=${1}
        .totalPages=${5}
        .itemsPerPage=${10}
        .totalItems=${50}
      ></pagination-controls>
    `);

    let eventFired = false;
    el.addEventListener('page-change', (e) => {
      expect(e.detail.page).to.equal(2);
      eventFired = true;
    });

    const nextBtn = el.shadowRoot.querySelector('.btn-next');
    nextBtn.click();
    expect(eventFired).to.be.true;
  });

  it('should disable previous button on first page', async () => {
    const el = await fixture(html`
      <pagination-controls
        .currentPage=${1}
        .totalPages=${5}
        .itemsPerPage=${10}
        .totalItems=${50}
      ></pagination-controls>
    `);

    const prevBtn = el.shadowRoot.querySelector('.btn-prev');
    expect(prevBtn.disabled).to.be.true;
  });
});
