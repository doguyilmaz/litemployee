import {fixture, html, assert} from '@open-wc/testing';
import './nav-menu.js';
import {i18n} from '../i18n/translations.js';

suite('nav-menu', () => {
  setup(() => {
    localStorage.clear();
    i18n.set('en');
  });

  test('renders navigation links', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const nav = el.shadowRoot.querySelector('nav');
    assert.exists(nav);

    const brand = el.shadowRoot.querySelector('.brand');
    assert.exists(brand);

    const addButton = el.shadowRoot.querySelector('.btn-add');
    assert.exists(addButton);
  });

  test('renders language toggle button', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const button = el.shadowRoot.querySelector('button');
    assert.exists(button);
    assert.equal(button.textContent, 'TR');
  });

  test('toggles language when button clicked', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const button = el.shadowRoot.querySelector('button');

    button.click();
    await el.updateComplete;

    assert.equal(button.textContent, 'EN');
    assert.equal(i18n.getCurrentLanguage(), 'tr');
  });

  test('persists language to localStorage', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const button = el.shadowRoot.querySelector('button');

    button.click();
    await el.updateComplete;

    assert.equal(localStorage.getItem('app-language'), 'tr');
  });

  test('loads language from localStorage on init', async () => {
    localStorage.setItem('app-language', 'tr');
    i18n.init();

    const el = await fixture(html`<nav-menu></nav-menu>`);
    const button = el.shadowRoot.querySelector('button');

    assert.equal(button.textContent, 'EN');
    assert.equal(i18n.getCurrentLanguage(), 'tr');
  });

  test('updates on language-changed event', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);

    i18n.set('tr');
    await el.updateComplete;

    const button = el.shadowRoot.querySelector('button');
    assert.equal(button.textContent, 'EN');
  });

  test('renders translated add button', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    let addBtn = el.shadowRoot.querySelector('.btn-add');
    assert.include(addBtn.textContent, 'Add New');

    i18n.set('tr');
    await el.updateComplete;

    addBtn = el.shadowRoot.querySelector('.btn-add');
    assert.include(addBtn.textContent, 'Yeni Ekle');
  });
});
