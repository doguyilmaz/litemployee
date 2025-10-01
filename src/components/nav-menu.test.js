import {fixture, html, expect} from '@open-wc/testing';
import './nav-menu.js';
import {i18n} from '../i18n/translations.js';

describe('NavMenu', () => {
  beforeEach(() => {
    localStorage.clear();
    i18n.set('en');
  });

  it('renders navigation links', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const nav = el.shadowRoot.querySelector('nav');
    expect(nav).to.exist;

    const links = el.shadowRoot.querySelectorAll('a');
    expect(links.length).to.equal(2);
  });

  it('renders language toggle button', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const button = el.shadowRoot.querySelector('button');
    expect(button).to.exist;
    expect(button.textContent).to.equal('TR');
  });

  it('toggles language when button clicked', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const button = el.shadowRoot.querySelector('button');

    button.click();
    await el.updateComplete;

    expect(button.textContent).to.equal('EN');
    expect(i18n.getCurrentLanguage()).to.equal('tr');
  });

  it('persists language to localStorage', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const button = el.shadowRoot.querySelector('button');

    button.click();
    await el.updateComplete;

    expect(localStorage.getItem('app-language')).to.equal('tr');
  });

  it('loads language from localStorage on init', async () => {
    localStorage.setItem('app-language', 'tr');
    i18n.init();

    const el = await fixture(html`<nav-menu></nav-menu>`);
    const button = el.shadowRoot.querySelector('button');

    expect(button.textContent).to.equal('EN');
    expect(i18n.getCurrentLanguage()).to.equal('tr');
  });

  it('updates on language-changed event', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);

    i18n.set('tr');
    await el.updateComplete;

    const button = el.shadowRoot.querySelector('button');
    expect(button.textContent).to.equal('EN');
  });

  it('renders translated links', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    let links = el.shadowRoot.querySelectorAll('a');
    expect(links[0].textContent).to.equal('Employees');

    i18n.set('tr');
    await el.updateComplete;

    links = el.shadowRoot.querySelectorAll('a');
    expect(links[0].textContent).to.equal('Çalışanlar');
  });
});
