import {html, fixture, expect} from '@open-wc/testing';
import '../src/components/confirm-dialog.js';

describe('confirm-dialog', () => {
  it('should not be visible initially', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    expect(el.hasAttribute('open')).to.be.false;
  });

  it('should open with custom message', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);

    el.open({
      title: 'Test Title',
      message: 'Test Message',
    });

    expect(el.hasAttribute('open')).to.be.true;
    expect(el.shadowRoot.textContent).to.include('Test Title');
    expect(el.shadowRoot.textContent).to.include('Test Message');
  });

  it('should call onConfirm when confirm button clicked', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);

    let confirmed = false;
    el.open({
      onConfirm: () => {
        confirmed = true;
      },
    });

    const confirmBtn = el.shadowRoot.querySelector('.btn-confirm');
    confirmBtn.click();

    expect(confirmed).to.be.true;
    expect(el.hasAttribute('open')).to.be.false;
  });

  it('should close when cancel button clicked', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);

    el.open({message: 'Test'});
    expect(el.hasAttribute('open')).to.be.true;

    const cancelBtn = el.shadowRoot.querySelector('.btn-cancel');
    cancelBtn.click();

    expect(el.hasAttribute('open')).to.be.false;
  });
});
