import {expect} from '@open-wc/testing';
import {i18n} from '../src/i18n/translations.js';

describe('i18n translations', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
  });

  it('should default to English', () => {
    i18n.init();
    expect(i18n.getCurrentLanguage()).to.equal('en');
  });

  it('should switch to Turkish', () => {
    i18n.set('tr');
    expect(i18n.getCurrentLanguage()).to.equal('tr');
  });

  it('should translate keys correctly', () => {
    i18n.set('en');
    expect(i18n.t('employeeList')).to.equal('Employees');

    i18n.set('tr');
    expect(i18n.t('employeeList')).to.equal('Çalışanlar');
  });

  it('should toggle between languages', () => {
    i18n.set('en');
    expect(i18n.toggle()).to.equal('tr');
    expect(i18n.getCurrentLanguage()).to.equal('tr');

    expect(i18n.toggle()).to.equal('en');
    expect(i18n.getCurrentLanguage()).to.equal('en');
  });

  it('should persist language to localStorage', () => {
    i18n.set('tr');
    expect(localStorage.getItem('app-language')).to.equal('tr');
  });

  it('should load language from localStorage on init', () => {
    localStorage.setItem('app-language', 'tr');
    i18n.init();
    expect(i18n.getCurrentLanguage()).to.equal('tr');
  });

  it('should return key if translation missing', () => {
    expect(i18n.t('nonExistentKey')).to.equal('nonExistentKey');
  });

  it('should dispatch language-changed event', (done) => {
    window.addEventListener('language-changed', (e) => {
      expect(e.detail.lang).to.equal('tr');
      done();
    });
    i18n.set('tr');
  });
});
