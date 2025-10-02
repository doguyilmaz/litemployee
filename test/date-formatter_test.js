import {expect} from '@open-wc/testing';
import {formatDate, parseDate} from '../src/utils/date-formatter.js';
import {i18n} from '../src/i18n/translations.js';

describe('date-formatter', () => {
  it('should format date for English (MM/DD/YYYY)', () => {
    i18n.set('en');
    expect(formatDate('2024-01-15')).to.equal('01/15/2024');
  });

  it('should format date for Turkish (DD/MM/YYYY)', () => {
    i18n.set('tr');
    expect(formatDate('2024-01-15')).to.equal('15/01/2024');
  });

  it('should return empty string for null date', () => {
    expect(formatDate(null)).to.equal('');
    expect(formatDate('')).to.equal('');
  });

  it('should parse Turkish date format', () => {
    expect(parseDate('15/01/2024', 'tr')).to.equal('2024-01-15');
  });

  it('should parse English date format', () => {
    expect(parseDate('01/15/2024', 'en')).to.equal('2024-01-15');
  });
});
